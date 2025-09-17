using EHL.Api.Helpers;
using EHL.Business.Implements;
using EHL.Business.Interfaces;
using EHL.Common.Models;
using Microsoft.AspNetCore.Mvc;
using static EHL.Common.Enum.Enum;

namespace EHL.Api.Controllers
{
    [Route("api/[controller]")]
    public class RoleOfMagController : ControllerBase
    {
        private readonly IRoleOfMagManager _roleOfMagManager;
        private readonly EncriptionService _encriptionService;
        public RoleOfMagController(IRoleOfMagManager roleOfMagManager, EncriptionService encriptionService)
        {
            _roleOfMagManager = roleOfMagManager;
            _encriptionService = encriptionService;
        }

        [HttpGet]
        public IActionResult GetList()
        {
            
            var encryptedData = _roleOfMagManager.GetList(); ;

            var decryptedData = encryptedData
                .Select(p => _encriptionService.DecryptModel(p))
                .ToList();

            return Ok(decryptedData);
        }
        [Authorization(RoleType.Admin)]
        [HttpPost]
        public IActionResult AddRoleOfMag([FromBody] RoleOfMag roleOfMag)
        {
            if(roleOfMag.Id > 0)
            {
                roleOfMag = _encriptionService.EncryptModel(roleOfMag);
                return Ok(_roleOfMagManager.UpdateRoleOfMag(roleOfMag));
            }
            if (roleOfMag == null)
            {
                return BadRequest("Role of Mag cannot be null");
            }
            roleOfMag = _encriptionService.EncryptModel(roleOfMag);
            return Ok(_roleOfMagManager.AddRoleOfMag(roleOfMag));
        }

    }
}
