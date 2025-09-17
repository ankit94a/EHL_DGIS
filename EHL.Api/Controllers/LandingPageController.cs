using EHL.Api.Helpers;
using EHL.Business.Implements;
using EHL.Business.Interfaces;
using EHL.Common.Models;
using InSync.Api.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static EHL.Common.Enum.Enum;

namespace EHL.Api.Controllers
{
	[Route("api/[controller]")]
	public class LandingPageController : ControllerBase
	{
		private readonly ILandingPageManager _landingPageManager;
		private readonly EncriptionService _encriptionService;
		public LandingPageController(ILandingPageManager landingPageManager, EncriptionService encriptionService)
		{
			_landingPageManager = landingPageManager;
			_encriptionService = encriptionService;
		}

		[Authorization(RoleType.Admin)]
		[HttpPost, Route("deativate")]
		public IActionResult Deactivate([FromBody] DeactivateModel model)
		{
			return Ok(_landingPageManager.Deactivate(model));
		}

		[Authorization(RoleType.Admin)]
		[HttpPost, Route("drone")]
		public async Task<IActionResult> AddDroneOrIcsc([FromForm] DroneIcsc droneIcsc)
		{
			droneIcsc.CreatedBy = HttpContext.GetUserId();
			droneIcsc.CreatedOn = DateTime.Now;
			droneIcsc.IsActive = true;
			droneIcsc.IsDeleted = false;

			if (droneIcsc.DroneIcscFile != null && droneIcsc.DroneIcscFile.Length > 0)
			{
				using (var memoryStream = new MemoryStream())
				{
					await droneIcsc.DroneIcscFile.CopyToAsync(memoryStream);
					droneIcsc.FileBytes = memoryStream.ToArray();
				}
			}
			droneIcsc = _encriptionService.EncryptModel(droneIcsc);
			var result = await _landingPageManager.AddDroneOrIcsc(droneIcsc);
			return Ok(result);
		}

		[Authorization(RoleType.Admin)]
		[HttpPost, Route("drone/update")]
		public async Task<IActionResult> UpdateDroneOrIcsc([FromForm] DroneIcsc droneIcsc)
		{
			droneIcsc.UpdatedBy = HttpContext.GetUserId();
			droneIcsc.UpdatedOn = DateTime.Now;
			droneIcsc = _encriptionService.EncryptModel(droneIcsc);
			return Ok(await _landingPageManager.UpdateDroneOrIcsc(droneIcsc));
		}

		[AllowAnonymous]
		[HttpPost, Route("type")]
		public IActionResult GetByDroneOrIcscType([FromBody] DroneIcsc droneIcsc)
		{
			var encryptedData = _landingPageManager.GetByDroneOrIcscType(droneIcsc.WingId, droneIcsc.Type);
			var decryptedData = encryptedData
				.Select(p => _encriptionService.DecryptModel(p))
				.ToList();

			return Ok(decryptedData);

		}
        [AllowAnonymous]
        [HttpPost, Route("feedback")]
        public async Task<IActionResult> AddUserFeedback([FromBody] Feedback feedback)
        {
            feedback.CreatedBy = 2;
            feedback.CreatedOn = DateTime.Now;
			feedback.IsActive = true;
            feedback = _encriptionService.EncryptModel(feedback);
            return Ok(await _landingPageManager.AddUserFeedback(feedback));
        }
        [AllowAnonymous]
        [HttpGet, Route("feedback")]
        public async Task<IActionResult> GetAllFeedback()
        {
            var encryptedData = _landingPageManager.GetAllFeedback();
            var decryptedData = encryptedData
                .Select(p => _encriptionService.DecryptModel(p))
                .ToList();

            return Ok(decryptedData);
        }
    }
}
