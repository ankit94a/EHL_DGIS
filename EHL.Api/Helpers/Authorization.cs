using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using EHL.Common.Enum;
using InSync.Api.Helpers;
using static EHL.Common.Enum.Enum;

namespace EHL.Api.Helpers
{
	[AttributeUsage(AttributeTargets.Method | AttributeTargets.Class)]
	public class AuthorizationAttribute : Attribute, IAuthorizationFilter
	{
		private readonly RoleType _requiredRole;

		public AuthorizationAttribute(RoleType requiredRole)
		{
			_requiredRole = requiredRole;
		}

		public void OnAuthorization(AuthorizationFilterContext context)
		{
			var userRole = context.HttpContext.GetRoleType();

			if (userRole != _requiredRole)
			{
				context.Result = new ForbidResult();
			}
		}
	}
}
