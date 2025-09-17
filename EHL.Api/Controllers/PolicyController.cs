using EHL.Api.Helpers;
using EHL.Business.Interfaces;
using EHL.Common.Models;
using EHL.DB.Implements;
using InSync.Api.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static EHL.Common.Enum.Enum;

namespace EHL.Api.Controllers
{
	[Route("api/[controller]")]
	public class PolicyController : ControllerBase
	{
		private readonly IPolicyManger _policyManger;
        private readonly EncriptionService _encriptionService;
        public PolicyController(IPolicyManger policyManger, EncriptionService encriptionService)
		{
			_policyManger = policyManger;
            _encriptionService = encriptionService;
        }

		[Authorization(RoleType.Admin)]
		[HttpPost]
		public async Task<IActionResult> AddPolicy([FromForm] Policy policy)
		{
			policy.CreatedBy = HttpContext.GetUserId();
			policy.CreatedOn = DateTime.Now;
			policy.IsActive = true;
			policy.IsDeleted = false;
			if (policy.PolicyFile != null && policy.PolicyFile.Length > 0)
			{
				using (var memoryStream = new MemoryStream())
				{
					await policy.PolicyFile.CopyToAsync(memoryStream);
					policy.FileBytes = memoryStream.ToArray();
                }
			}
            policy = _encriptionService.EncryptModel(policy);
            return Ok(await _policyManger.AddPolicy(policy));
		}

		[Authorization(RoleType.Admin)]
		[HttpPost, Route("update")]
		public async Task<IActionResult> UpdatePolicy([FromForm] Policy policy)
		{
			policy.UpdatedBy = HttpContext.GetUserId();
			policy.UpdatedOn = DateTime.Now;
			policy.IsActive = true;
			policy.IsDeleted = false;
			if (policy.PolicyFile != null && policy.PolicyFile.Length > 0)
			{
				using (var memoryStream = new MemoryStream())
				{
					await policy.PolicyFile.CopyToAsync(memoryStream);
					policy.FileBytes = memoryStream.ToArray();
				}
			}
            policy = _encriptionService.EncryptModel(policy);
            return Ok(await _policyManger.UpdatePolicy(policy));
		}

		[HttpGet, Route("wing/{wingId}")]
		public IActionResult GetTechManualsAdvisioriesAndMiscByWing(long wingId)
		{
            var encryptedData = _policyManger.GetTechManualsAdvisioriesAndMiscByWing(wingId);
            var decryptedData = encryptedData
                .Select(p => _encriptionService.DecryptModel(p))
                .ToList();

            return Ok(decryptedData);
        
		}
		[AllowAnonymous]
		[HttpPost, Route("type")]
		public IActionResult GetByPolicyType([FromBody] Policy policy)
		{
            var encryptedData = _policyManger.GetByPolicyType(policy.WingId, policy.Type);
            var decryptedData = encryptedData
                .Select(p => _encriptionService.DecryptModel(p))
                .ToList();

            return Ok(decryptedData);
           
		}

		[HttpGet, Route("policies")]
		public IActionResult GetPoliciesAndAdvisiories()
		{
            var encryptedData = _policyManger.GetPoliciesAndAdvisiories();
            var decryptedData = encryptedData
                .Select(p => _encriptionService.DecryptModel(p))
                .ToList();

            return Ok(decryptedData);
           
		}
	}
}
