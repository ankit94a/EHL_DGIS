using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

public class EncriptionService
{
	private readonly string password;
	private const int Iterations = 150000;
	private const int SaltLength = 16;
	private const int IvLength = 12;
	public EncriptionService(IConfiguration configuration)
	{
		password = configuration["EncryptionSettings:Key"];
		if (string.IsNullOrWhiteSpace(password))
		{
			throw new ArgumentException("Encryption key is missing from configuration.");
		}
	}

	public string Encrypt(string plainText)
	{
		var salt = GenerateRandomBytes(SaltLength);
		var iv = GenerateRandomBytes(IvLength);

		using var aes = new AesGcm(DeriveKey(salt));
		var plainBytes = Encoding.UTF8.GetBytes(plainText);
		var cipherBytes = new byte[plainBytes.Length];
		var tag = new byte[16];

		aes.Encrypt(iv, plainBytes, cipherBytes, tag);

		var result = new byte[salt.Length + iv.Length + cipherBytes.Length + tag.Length];
		Buffer.BlockCopy(salt, 0, result, 0, salt.Length);
		Buffer.BlockCopy(iv, 0, result, salt.Length, iv.Length);
		Buffer.BlockCopy(cipherBytes, 0, result, salt.Length + iv.Length, cipherBytes.Length);
		Buffer.BlockCopy(tag, 0, result, salt.Length + iv.Length + cipherBytes.Length, tag.Length);

		return Convert.ToBase64String(result);
	}

	public string Decrypt(string encrypted)
	{
		var data = Convert.FromBase64String(encrypted);
		var salt = data[..SaltLength];
		var iv = data[SaltLength..(SaltLength + IvLength)];
		var tag = data[^16..];
		var cipherText = data[(SaltLength + IvLength)..^16];

		using var aes = new AesGcm(DeriveKey(salt));
		var decrypted = new byte[cipherText.Length];

		aes.Decrypt(iv, cipherText, tag, decrypted);
		return Encoding.UTF8.GetString(decrypted);
	}

	public Dictionary<string, object> EncryptObjectValues(Dictionary<string, object> obj)
	{
		var result = new Dictionary<string, object>();

		foreach (var pair in obj)
		{
			if (pair.Value is string || pair.Value is int || pair.Value is double)
				result[pair.Key] = Encrypt(Convert.ToString(pair.Value));
			else
				result[pair.Key] = pair.Value;
		}

		return result;
	}

	public Dictionary<string, object> DecryptObjectValues(Dictionary<string, object> obj)
	{
		var result = new Dictionary<string, object>();

		foreach (var pair in obj)
		{
			if (pair.Value is string str && IsProbablyEncrypted(str))
			{
				try { result[pair.Key] = Decrypt(str); }
				catch { result[pair.Key] = str; }
			}
			else
			{
				result[pair.Key] = pair.Value;
			}
		}

		return result;
	}

	public List<Dictionary<string, object>> DecryptList(List<Dictionary<string, object>> list)
	{
		var result = new List<Dictionary<string, object>>();

		foreach (var item in list)
			result.Add(DecryptObjectValues(item));

		return result;
	}

	private bool IsProbablyEncrypted(string value)
	{
		return value.Length > 40 && Convert.TryFromBase64String(value, new Span<byte>(new byte[value.Length]), out _);
	}

	private byte[] GenerateRandomBytes(int length)
	{
		var buffer = new byte[length];
		using var rng = RandomNumberGenerator.Create();
		rng.GetBytes(buffer);
		return buffer;
	}

	private byte[] DeriveKey(byte[] salt)
	{
		using var pbkdf2 = new Rfc2898DeriveBytes(password, salt, Iterations, HashAlgorithmName.SHA512);
		return pbkdf2.GetBytes(32);
	}

	public T EncryptModel<T>(T model)
	{
		if (model == null) return default!;
		var type = typeof(T);
		var properties = type.GetProperties();

		foreach (var prop in properties)
		{
			if (!prop.CanRead || !prop.CanWrite || prop.GetIndexParameters().Length > 0)
				continue;


			if (string.Equals(prop.Name, "type", StringComparison.OrdinalIgnoreCase) ||
				string.Equals(prop.Name, "emernumber", StringComparison.OrdinalIgnoreCase))
				continue;

			if (prop.PropertyType == typeof(string))
			{
				var value = prop.GetValue(model);
				if (value != null)
				{
					string encrypted = Encrypt(value.ToString());
					prop.SetValue(model, encrypted);
				}
			}
		}

		return model;
	}


	public T DecryptModel<T>(T model)
	{
		if (model == null) return default!;
		var type = typeof(T);
		var properties = type.GetProperties();

		foreach (var prop in properties)
		{
			if (!prop.CanRead || !prop.CanWrite || prop.GetIndexParameters().Length > 0)
				continue;

			if (prop.PropertyType == typeof(string))
			{
				var value = prop.GetValue(model) as string;
				if (!string.IsNullOrEmpty(value) && IsProbablyEncrypted(value))
				{
					try
					{
						string decrypted = Decrypt(value);
						prop.SetValue(model, decrypted);
					}
					catch
					{

					}
				}
			}
		}

		return model;
	}

}
