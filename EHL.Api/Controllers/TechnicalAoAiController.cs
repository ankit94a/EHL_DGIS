using EHL.Api.Helpers;
using EHL.Business.Implements;
using EHL.Business.Interfaces;
using EHL.Common.Models;
using InSync.Api.Helpers;
using Microsoft.AspNetCore.Mvc;
using static EHL.Common.Enum.Enum;

namespace EHL.Api.Controllers
{
	[Route("api/[controller]")]
	public class TechnicalAoAiController : ControllerBase
	{

		private readonly ITechnicalAoAiManager _technichalAoAiManager;
		private readonly EncriptionService _encriptionService;
		public TechnicalAoAiController(ITechnicalAoAiManager technicalAoAiManager, EncriptionService encriptionService)
		{
			_technichalAoAiManager = technicalAoAiManager;
			_encriptionService = encriptionService;
		}

		[Authorization(RoleType.Admin)]
		[HttpPost]
		public async Task<IActionResult> AddTechnicalAoAi([FromForm] TechnicalAoAi technicalAoAi)
		{
			technicalAoAi.CreatedBy = HttpContext.GetUserId();
			technicalAoAi.CreatedOn = DateTime.Now;
			technicalAoAi.IsDeleted = false;
			technicalAoAi.IsActive = true;

			if (technicalAoAi.TechnicalAoAiFile != null && technicalAoAi.TechnicalAoAiFile.Length > 0)
			{
				using (var memoryStream = new MemoryStream())
				{
					await technicalAoAi.TechnicalAoAiFile.CopyToAsync(memoryStream);
					technicalAoAi.FileBytes = memoryStream.ToArray();
				}
			}
			technicalAoAi = _encriptionService.EncryptModel(technicalAoAi);
			var result = await _technichalAoAiManager.AddTechnicalAoAi(technicalAoAi);

			return Ok(result);
		}

		[HttpGet]
		public IActionResult GetList()
		{
			var encryptedData = _technichalAoAiManager.GetList();

			var decryptedData = encryptedData
				.Select(p => _encriptionService.DecryptModel(p))
				.ToList();

			return Ok(decryptedData);

		}

		[Authorization(RoleType.Admin)]
		[HttpPost, Route("update")]
		public async Task<IActionResult> UpdateTechnicalAoAi([FromForm] TechnicalAoAi technicalAoAi)
		{
			technicalAoAi.UpdatedBy = HttpContext.GetUserId();
			technicalAoAi.UpdatedOn = DateTime.Now;
			technicalAoAi.IsActive = true;
			technicalAoAi.IsDeleted = false;
			technicalAoAi = _encriptionService.EncryptModel(technicalAoAi);
			return Ok(await _technichalAoAiManager.UpdateTechnicalAoAi(technicalAoAi));
		}

	}
}
