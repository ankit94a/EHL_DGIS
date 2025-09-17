
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using EHL.Api.Authorization;
using EHL.Common.Models;
using EHL.Common.Helpers;

namespace InSync.Api.Authorization
{
	public class JwtManager : IJwtManager
	{
		private readonly JwtConfig _jwtSettings;



		public JwtManager(IOptions<JwtConfig> jwtSettings)
		{
			_jwtSettings = jwtSettings.Value;
		}
		public string GenerateJwtToken(UserDetails user)
		{

			var jwtTokenHandler = new JwtSecurityTokenHandler();

			var key = Encoding.ASCII.GetBytes(_jwtSettings.Key);


			var tokenDescriptor = new SecurityTokenDescriptor
			{
				Subject = new ClaimsIdentity(new[]
				{
				new Claim(EHLConstant.UserId, user.Id.ToString()),

				 new Claim(EHLConstant.RoleType,user.RoleType.ToString()),

				new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
			}),
				Issuer = _jwtSettings.Issuer,
				Audience = _jwtSettings.Audience,
				Expires = DateTime.UtcNow.AddMinutes(_jwtSettings.DurationInMinutes),
				SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha512Signature)
			};
			return jwtTokenHandler.WriteToken(jwtTokenHandler.CreateToken(tokenDescriptor));
		}


	}
}
















