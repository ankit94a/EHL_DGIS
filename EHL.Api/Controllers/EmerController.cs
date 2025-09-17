using EHL.Api.Authorization;
using EHL.Api.Helpers;
using EHL.Business.Implements;
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
	public class EmerController : ControllerBase
	{
		private readonly IEmerManager _emmerManager;
		private readonly EncriptionService _encriptionService;

		public EmerController(IEmerManager emmerManager, EncriptionService encriptionService)
		{
			_emmerManager = emmerManager;
			_encriptionService = encriptionService;
		}

		[HttpGet, Route("wing/{wingId}")]
		public IActionResult GetAllEmer(long wingId)
		{
			var encryptedData = _emmerManager.GetAllEmer(wingId);

			var decryptedData = encryptedData
				.Select(p => _encriptionService.DecryptModel(p))
				.ToList();

			return Ok(decryptedData);

		}


		[Authorization(RoleType.Admin)]
		[HttpPost]
		public async Task<IActionResult> AddEmer([FromForm] EmerModel emerModel)
		{
			emerModel.CreatedBy = HttpContext.GetUserId();
			emerModel.CreatedOn = DateTime.Now;
            emerModel.UpdatedBy = HttpContext.GetUserId();
            emerModel.UpdatedOn = DateTime.Now;
            emerModel.IsActive = true;
			emerModel.IsDeleted = false;

			if (emerModel.EmerFile != null && emerModel.EmerFile.Length > 0)
			{
				using (var memoryStream = new MemoryStream())
				{
					await emerModel.EmerFile.CopyToAsync(memoryStream);
					emerModel.FileBytes = memoryStream.ToArray();
				}
			}
			emerModel = _encriptionService.EncryptModel(emerModel);
			var result = await _emmerManager.AddEmer(emerModel);
			return Ok(result);
		}

		[Authorization(RoleType.Admin)]
		[HttpPost, Route("update")]
		public async Task<IActionResult> UpdateEmer([FromForm] EmerModel emerModel)
		{
			emerModel.UpdatedBy = HttpContext.GetUserId();
			emerModel.UpdatedOn = DateTime.Now;
			emerModel.IsActive = true;
			emerModel.IsDeleted = false;
			emerModel = _encriptionService.EncryptModel(emerModel);
			return Ok(await _emmerManager.UpdateEmer(emerModel));
		}

		[HttpGet, Route("index/{wingId}")]
		public IActionResult GetEmerIndex(int wingId)
		{
			var encryptedData = _emmerManager.GetEmerIndex(wingId);

			var decryptedData = encryptedData
				.Select(p => _encriptionService.DecryptModel(p))
				.ToList();

			return Ok(decryptedData);

		}

		[Authorization(RoleType.Admin)]
		[HttpPost, Route("index")]
		public async Task<IActionResult> AddEmerIndex([FromForm] EmerIndex EmerIndex)
		{
			EmerIndex.CreatedBy = HttpContext.GetUserId();
			EmerIndex.CreatedOn = DateTime.Now;
			EmerIndex.IsActive = true;
			EmerIndex.IsDeleted = false;

			if (EmerIndex.EmerFile != null && EmerIndex.EmerFile.Length > 0)
			{
				using (var memoryStream = new MemoryStream())
				{
					await EmerIndex.EmerFile.CopyToAsync(memoryStream);
					EmerIndex.FileBytes = memoryStream.ToArray();
				}
			}
			EmerIndex = _encriptionService.EncryptModel(EmerIndex);
			var result = await _emmerManager.AddEmerIndex(EmerIndex);
			return Ok(result);
		}

		[Authorization(RoleType.Admin)]
		[HttpPost, Route("index/update")]
		public async Task<IActionResult> UpdateEmerIndex([FromForm] EmerIndex emerIndex)
		{
			emerIndex.UpdatedBy = HttpContext.GetUserId();
			emerIndex.UpdatedOn = DateTime.Now;
			emerIndex = _encriptionService.EncryptModel(emerIndex);
			return Ok(await _emmerManager.UpdateEmerIndex(emerIndex));
		}

		[HttpGet, Route("mastersheet")]
		public IActionResult GetAllMasterSheet()
		{
			var encryptedData = _emmerManager.GetAllMasterSheet();


			var decryptedData = encryptedData
				.Select(p => _encriptionService.DecryptModel(p))
				.ToList();

			return Ok(decryptedData);

		}
		[AllowAnonymous]
		[HttpGet, Route("latest/emer")]
		public IActionResult GetLatestEmer()
		{
			var encryptedData = _emmerManager.GetLatestEmer();


			var decryptedData = encryptedData
				.Select(p => _encriptionService.DecryptModel(p))
				.ToList();

			return Ok(decryptedData);


		}
		[AllowAnonymous]
		[HttpGet, Route("latest/policy")]
		public IActionResult GetLatestTwoPoliciesPerType()
		{
			var encryptedData = _emmerManager.GetLatestTwoPoliciesPerType();

			var decryptedData = encryptedData
				.Select(p => _encriptionService.DecryptModel(p))
				.ToList();

			return Ok(decryptedData);

		}
	}
}
