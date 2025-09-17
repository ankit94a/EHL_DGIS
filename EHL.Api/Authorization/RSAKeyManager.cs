using System.Security.Cryptography;
using System.Text;



namespace EHL.Api.Authorization
{
    public class RSAKeyManager
    {
        private static RSAParameters _publicKey;
        private static RSAParameters _privateKey;
        private static bool _initialized = false;

        public RSAKeyManager()
        {
           
            if (!_initialized)
            {
                using var rsa = RSA.Create(2048);
                _publicKey = rsa.ExportParameters(false);
                _privateKey = rsa.ExportParameters(true);
                _initialized = true;
            }
        }

        public string GetPublicKeyXml()
        {
            using var rsa = RSA.Create();
            rsa.ImportParameters(_publicKey);
            return rsa.ToXmlString(false);
        }

        public string Decrypt(string base64Encrypted)
        {
            try
            {
                using var rsa = RSA.Create();
                rsa.ImportParameters(_privateKey);

                byte[] encryptedBytes = Convert.FromBase64String(base64Encrypted);
                byte[] decryptedBytes = rsa.Decrypt(encryptedBytes, RSAEncryptionPadding.Pkcs1);
                return Encoding.UTF8.GetString(decryptedBytes);
            }
            catch (Exception e)

            {
                throw new Exception("Error processing Decryption");
           
            }
        }

     
    }
}
