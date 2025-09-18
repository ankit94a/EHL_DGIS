using EHL.Api.Authorization;
using EHL.Business.Interfaces;
using EHL.Common.Helpers;
using EHL.Common.Models;
using InSync.Api.Helpers;
using iText.Commons.Datastructures;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.AspNetCore.Mvc;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System;
using Microsoft.AspNetCore.Http;
using SixLabors.ImageSharp.PixelFormats;
using Net.Pkcs11Interop.HighLevelAPI.MechanismParams;
using Net.Pkcs11Interop.Common;
using System.Security.Cryptography.X509Certificates;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Net.Pkcs11Interop.HighLevelAPI;
using System.Text.RegularExpressions;

namespace EHL.Api.Controllers
{
	[Route("api/[controller]")]
	public class AuthController : ControllerBase
	{
		private readonly IUserManager _userManager;
		readonly IJwtManager _jwtManager;
		private readonly LoginAttemptService _loginAttemptService;

		public AuthController(IUserManager userManager, IJwtManager jwtManager, LoginAttemptService loginAttemptService)
		{
			_userManager = userManager;
			_jwtManager = jwtManager;
			_loginAttemptService = loginAttemptService;
		}
        //[AllowAnonymous]
        //[HttpPost, Route("login")]
        //public IActionResult DoLogin([FromBody] Login login)
        //{

        //    var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        //    if (_loginAttemptService.IsBlocked(ip))
        //    {
        //        return Unauthorized(new { message = "Too many failed login attempts. Please try again after 15 minutes." });

        //    }
        //    var rsaService = new RSAKeyManager();
        //    login.UserName = rsaService.Decrypt(login.UserName);
        //    login.Password = rsaService.Decrypt(login.Password);

        //    var user = _userManager.GetUserByEmail(login.UserName);
        //    if (user.isLoggedIn == true)
        //    {
        //        return Unauthorized(new { message = "Admin Already Logged In." });
        //    }

        //    if (user != null)
        //    {
        //        bool captchaValid = ValidateCaptcha(login.Code, login.Token);
        //        if (captchaValid)
        //        {
        //            //_loginAttemptService.ResetAttempts(ip);

        //            bool isPasswordCorrect = BCrypt.Net.BCrypt.Verify(login.Password, user.Password);
        //            if (isPasswordCorrect)
        //            {
        //                var jwtToken = _jwtManager.GenerateJwtToken(user);
        //                Response.Cookies.Append("auth_token", jwtToken, new CookieOptions
        //                {
        //                    HttpOnly = true,
        //                    Secure = true,
        //                    SameSite = SameSiteMode.None,
        //                    Expires = DateTimeOffset.UtcNow.AddMinutes(15)
        //                });
        //                _loginAttemptService.ResetAttempts(ip);
        //                _userManager.updateLoggedIn(1, user.UserName);
        //                return Ok(new { msg = "Login Successful" });
        //            }
        //            else
        //            {
        //                _loginAttemptService.RecordFailedAttempt(ip);
        //                return Unauthorized(new { message = "Invalid password" });
        //            }
        //        }
        //        else
        //        {
        //            return Unauthorized(new { message = "Invalid Captcha Code." });
        //        }

        //    }
        //    else
        //    {
        //        //_loginAttemptService.RecordFailedAttempt(ip);
        //        return Unauthorized(new { message = "Invalid username or password." });
        //    }
        //}

        [AllowAnonymous]
        [HttpPost, Route("login")]
        public IActionResult DoLogin([FromBody] Login login)
        {
            try
            {
                var ip = HttpContext.Connection.RemoteIpAddress?.ToString();

                if (_loginAttemptService.IsBlocked(ip))
                {
                    return Unauthorized(new { message = "Too many failed login attempts. Please try again after 15 minutes." });
                }

                var rsaService = new RSAKeyManager();

                // Defensive checks before decryption
                if (string.IsNullOrEmpty(login.UserName) || string.IsNullOrEmpty(login.Password))
                {
                    return BadRequest(new { message = "Username and password are required." });
                }

                string decryptedUserName, decryptedPassword;
                try
                {
                    decryptedUserName = rsaService.Decrypt(login.UserName);
                    decryptedPassword = rsaService.Decrypt(login.Password);
                }
                catch (Exception)
                {
                    return BadRequest(new { message = "Invalid credentials format." });
                }

                var user = _userManager.GetUserByEmail(decryptedUserName);

                if (user == null)
                {
                    return Unauthorized(new { message = "Invalid username or password." });
                }

                if (user.isLoggedIn)
                {
                    return Unauthorized(new { message = "Admin already logged in." });
                }

                bool captchaValid = ValidateCaptcha(login.Code, login.Token);
                if (!captchaValid)
                {
                    return Unauthorized(new { message = "Invalid captcha code." });
                }

                bool isPasswordCorrect;
                try
                {
                    isPasswordCorrect = BCrypt.Net.BCrypt.Verify(decryptedPassword, user.Password);
                }
                catch
                {
                    return Unauthorized(new { message = "Invalid password." });
                }

                if (!isPasswordCorrect)
                {
                    _loginAttemptService.RecordFailedAttempt(ip);
                    return Unauthorized(new { message = "Invalid password." });
                }

                // Password correct -> issue token
                var jwtToken = _jwtManager.GenerateJwtToken(user);
                Response.Cookies.Append("auth_token", jwtToken, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Expires = DateTimeOffset.UtcNow.AddMinutes(15)
                });

                _loginAttemptService.ResetAttempts(ip);
                _userManager.updateLoggedIn(1, user.UserName);

                return Ok(new { msg = "Login successful." });
            }
            catch (Exception ex)
            {
                // Log the exception internally
                EHLLogger.Error(ex, "Error during login.");

                // Return sanitized error
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { message = "An unexpected error occurred. Please try again later." });
            }
        }


        [HttpGet("publickey")]
        [AllowAnonymous]
        public IActionResult GetPublicKey()
        {
            var rsaService = new RSAKeyManager();
            string publicKeyXml = rsaService.GetPublicKeyXml();
            return Ok(new { key = publicKeyXml });
        }


        [AllowAnonymous]
        [HttpPost, Route("forget-password")]
        public IActionResult ForgetPassword([FromBody] Login request)
        {
            if (!PasswordValidator.IsComplex(request.Password))
            {
                return BadRequest("Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character.");
            }
            var user = _userManager.GetUserByEmail(request.UserName);
            if (user == null)
                return NotFound(new { message = "User not found" });

            _userManager.UpdatePassword(user.Id, request.Password);

            return Ok(new { message = "Password reset link sent to your email." });
        }
        private static class PasswordValidator
        {
            public static bool IsComplex(string password)
            {
                if (string.IsNullOrWhiteSpace(password))
                    return false;

                var regex = new Regex(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$");
                return regex.IsMatch(password);
            }
        }
        [AllowAnonymous]
        [HttpPost, Route("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Append("auth_token", "", new CookieOptions
            {
                Expires = DateTimeOffset.UtcNow.AddDays(-1),
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None
            });
            Response.Cookies.Delete("auth_token", new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None
            });
            _userManager.updateLoggedIn(0, "admin");

            return Ok(new { StatusCode = 200, message = "Logged out successfully." });
        }

        [AllowAnonymous]
        [HttpGet("generate")]
		public IActionResult GenerateCaptcha()
		{
			var code = "12345";
                // GenerateRandomCode(5);
			var token = Guid.NewGuid().ToString();
			CaptchaStore.Captchas[token] = code;

			return Ok(new { token, code });
		}

		private bool ValidateCaptcha(string Code, string Token)
		{
			if (CaptchaStore.Captchas.TryGetValue(Token, out var correctCode))
			{
				CaptchaStore.Captchas.Remove(Token);

				if (string.Equals(Code, correctCode, StringComparison.OrdinalIgnoreCase))
					return true;

				return false;
			}

			return false;
		}

		private string GenerateRandomCode(int length)
		{
			const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
			var random = new Random();
			return new string(Enumerable.Repeat(chars, length)
				.Select(s => s[random.Next(s.Length)]).ToArray());
		}

        private string GetField(string subject, string fieldName)
        {
            var parts = subject.Split(',');
            foreach (var part in parts)
            {
                var trimmed = part.Trim();
                if (trimmed.StartsWith(fieldName + "="))
                {
                    return trimmed.Substring((fieldName + "=").Length);
                }
            }
            return null;
        }

        [HttpGet("getTokenDetails")]
        public IActionResult GetDetails()
        {
            try
            {
                var dllPath = @"C:\Windows\System32\eps2003csp11v2.dll";
                if (!System.IO.File.Exists(dllPath))
                {
                   
                    EHLLogger.Info("PKCS#11 DLL not found at path : " + dllPath, "AuthController", "GetDetails");
                    return BadRequest( new { message = "Please ensure the ECR token software is properly installed and try again." });
                }
                    

                var factories = new Pkcs11InteropFactories();
                using var pkcs11 = factories.Pkcs11LibraryFactory.LoadPkcs11Library(factories, dllPath, AppType.SingleThreaded);

                var slot = pkcs11.GetSlotList(SlotsType.WithTokenPresent).FirstOrDefault();
                if (slot == null)
                    return BadRequest(new { message = "Unable to detect ECR token. Please insert your token and refresh the application to continue." });
				var tokenInfo = slot.GetTokenInfo();
                return Ok(new
                {
                    TokenPresent = true,
                    token = new
                    {
                        tokenInfo.Label,
                        tokenInfo.SerialNumber,
                        tokenInfo.ManufacturerId,
                        tokenInfo.Model
                    }
                });
            
            }
            catch (Pkcs11Exception pkcsEx)
            {
                return StatusCode(500, $"PKCS#11 error: {pkcsEx.Message}");
				EHLLogger.Error(pkcsEx, "Class=AuthController,method=GetDetails");
			}
            catch (Exception ex)
            {
                return StatusCode(500, $"Unexpected error: {ex.Message}");
				EHLLogger.Error(ex, "Class=AuthController,method=GetDetails");
			}
        }


        [HttpPost("validate-pin")]
        public IActionResult ValidatePin([FromBody] ValidatePinRequest request)
        {
            try
            {
                var pin = request.pin;

                if (string.IsNullOrWhiteSpace(pin))
                    return BadRequest("PIN is required.");

                var dllPath = @"C:\Windows\System32\eps2003csp11v2.dll";
                if (!System.IO.File.Exists(dllPath))
                {
                    EHLLogger.Info("PKCS#11 DLL not found at path : " + dllPath, "AuthController", "GetDetails");
                    return BadRequest( new { message = "Please ensure the ECR token software is properly installed and try again." });
                }

                var factories = new Pkcs11InteropFactories();
                using var pkcs11 = factories.Pkcs11LibraryFactory.LoadPkcs11Library(
                    factories,
                    dllPath,
                    AppType.SingleThreaded
                );

                var slot = pkcs11.GetSlotList(SlotsType.WithTokenPresent).FirstOrDefault();
                if (slot == null)
                    return BadRequest( new { message = "Unable to detect ECR token. Please insert your token and refresh the application to continue." });

                using var session = slot.OpenSession(SessionType.ReadWrite);

                try
                {
                 
                    session.Login(CKU.CKU_USER, pin);

                    var certAttributes = new List<IObjectAttribute>
        {
            factories.ObjectAttributeFactory.Create(CKA.CKA_CLASS, CKO.CKO_CERTIFICATE),
            factories.ObjectAttributeFactory.Create(CKA.CKA_CERTIFICATE_TYPE, CKC.CKC_X_509)
        };

                    var certObjects = session.FindAllObjects(certAttributes);
                    if (!certObjects.Any())
                    {
                        session.Logout();
                        return BadRequest( new { message = "No valid certificate found on the ECR token." });
                    }

                    X509Certificate2 caCert = null;
                    X509Certificate2 userCert = null;

                    foreach (var obj in certObjects)
                    {
                        var attr = session.GetAttributeValue(obj, new List<CKA> { CKA.CKA_VALUE });
                        var certBytes = attr[0].GetValueAsByteArray();
                        var cert = new X509Certificate2(certBytes);

                        if (cert.Subject == cert.Issuer || cert.Subject.Contains("CA") || cert.Issuer.Contains("Root") || cert.Issuer == cert.Subject)
                            caCert = cert;
                        else
                            userCert = cert;
                    }

                    if (caCert == null)
                    {
                        session.Logout();
                        return BadRequest (new { message = "CA certificate not found in token." });
                    }

                    var checkDate = new DateTime(2020, 06, 25, 10, 0, 0, DateTimeKind.Utc);
                    if (checkDate < caCert.NotBefore || checkDate > caCert.NotAfter)
                    {
                        session.Logout();
                        return BadRequest("CA certificate is not valid on the specified date.");
                    }

                    if (userCert == null)
                    {
                        session.Logout();
                        return BadRequest( new { message = "User certificate not found" });
                    }

                    var userDetails = new
                    {
                        CommonName = userCert.GetNameInfo(X509NameType.SimpleName, false),
                        Email = userCert.GetNameInfo(X509NameType.EmailName, false),
                        Organization = GetField(userCert.Subject, "O"),
                        OrgUnit = GetField(userCert.Subject, "OU"),
                        Country = GetField(userCert.Subject, "C"),
                        ValidFrom = userCert.NotBefore,
                        ValidTo = userCert.NotAfter,
                        Thumbprint = userCert.Thumbprint
                    };

                   
                    session.Logout();

                    return Ok(new { IsValid = true });
                }
                catch
                {
                    return Ok(new { IsValid = false }); 
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = $"Error validating PIN: {ex.Message}" });
				EHLLogger.Error(ex, "Class=AuthController,method=ValidatePin");
			}
        }

    }
}