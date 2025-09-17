
using EHL.Common.Helpers;
using EHL.Common.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using static EHL.Common.Enum.Enum;


namespace InSync.Api.Helpers
{
    public static class ClaimHelper
    {
        public static int GetUserId(this HttpContext httpContext)
        {
            var userIdClaim = httpContext.User?.Claims?.FirstOrDefault(c => c.Type == EHLConstant.UserId);

            if (userIdClaim == null || string.IsNullOrWhiteSpace(userIdClaim.Value))
            {
                throw new UnauthorizedAccessException("User ID claim is missing.");
            }

            if (!int.TryParse(userIdClaim.Value, out int userId))
            {
                throw new UnauthorizedAccessException("Invalid user ID value.");
            }

            return userId;
        }


        public static RoleType GetRoleType(this HttpContext httpContext)
        {
            var roleClaim = httpContext.User?.Claims?.FirstOrDefault(c => c.Type == EHLConstant.RoleType);

            if (roleClaim == null || string.IsNullOrEmpty(roleClaim.Value))
            {
                throw new UnauthorizedAccessException("User role claim is missing.");
            }

            if (!Enum.TryParse<RoleType>(roleClaim.Value, out var role))
            {
                throw new UnauthorizedAccessException("Invalid role type.");
            }

            return role;
        }


    }
}
