
using EHL.Common.Models;
namespace EHL.Api.Authorization
{
	public interface IJwtManager
	{
		string GenerateJwtToken(UserDetails user);
	}
}
