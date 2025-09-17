using EHL.Common.Models;
using InSync.Api.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EHL.Api.Controllers
{
    [Route("api/[controller]")]
    public class StatusController : ControllerBase
    {
        [AllowAnonymous]
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new
            {
                status = "API is running",
                environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT"),
                time = DateTime.UtcNow
            });
        }
        [AllowAnonymous]
        [HttpPost,Route("roletype")]
        public IActionResult GetRoleType(Login login)
        {
            
            bool isAuthenticated = HttpContext.User.Identity?.IsAuthenticated ?? false;
            return Ok(new { isAuthenticated });
        }
    }

}
