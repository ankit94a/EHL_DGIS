using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static EHL.Common.Enum.Enum;

namespace EHL.Common.Models
{
	public class UserDetails : Base
	{
		public string Name { get; set; }
		public string Email { get; set; }
		public string Phone { get; set; }
		public int RoleId { get; set; }
		public int RoleType { get; set; }
		public string UserName { get; set; }
		public string Password { get; set; }
		public bool isLoggedIn { get; set; }
    }
	public class RolePermission : Base
	{
		public long RoleId { get; set; }
		public PermissionAction PermissionAction { get; set; }
		public PermissionItem PermissionName { get; set; }

		public RolePermission Clone()
		{
			return (RolePermission)MemberwiseClone();
		}
	}

	public static class CaptchaStore
	{
		public static Dictionary<string, string> Captchas = new();
	}
	public class CaptchaRequest
	{
		public string Token { get; set; }
		public string Code { get; set; }
	}
}
