using System.Net.NetworkInformation;
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
	public class AttributeController : ControllerBase
	{
		private readonly IAttributeManager _attributeManager;
		private readonly EncriptionService _encriptionService;

		public AttributeController(IAttributeManager attributeManager, EncriptionService encriptionService)
		{
			_attributeManager = attributeManager;
			_encriptionService = encriptionService;
		}
		[Authorization(RoleType.Admin)]
		[HttpPost, Route("wing")]
		public IActionResult AddCategory([FromBody] Wing wing)
		{
			wing.CreatedBy = HttpContext.GetUserId();
			wing.CreatedOn = DateTime.Now;
			wing.IsDeleted = false;
			wing.IsActive = true;
			wing = _encriptionService.EncryptModel(wing);
			return Ok(_attributeManager.AddWing(wing));
		}
		[Authorization(RoleType.Admin)]
		[HttpPost, Route("wing/update")]
		public IActionResult UpdateCategory([FromBody] Wing wing)
		{
			wing.CreatedBy = HttpContext.GetUserId();
			wing.CreatedOn = DateTime.Now;
			wing.IsDeleted = false;
			wing.IsActive = true;
			wing = _encriptionService.EncryptModel(wing);
			return Ok(_attributeManager.UpdateWing(wing));
		}
		[Authorization(RoleType.Admin)]
		[HttpPost, Route("category")]
		public IActionResult AddCategory([FromBody] Category category)
		{
			category.Name = category.Name.ToUpper();
			category.CreatedBy = HttpContext.GetUserId();
			category.CreatedOn = DateTime.Now;
			category.IsDeleted = false;
			category.IsActive = true;
			category = _encriptionService.EncryptModel(category);
			return Ok(_attributeManager.AddCategory(category));
		}
		[Authorization(RoleType.Admin)]
		[HttpPost, Route("category/updated")]
		public IActionResult UpdateCategory([FromBody] Category category)
		{
			category.Name = category.Name.ToUpper();
			category.CreatedBy = HttpContext.GetUserId();
			category.CreatedOn = DateTime.Now;
			category.IsDeleted = false;
			category.IsActive = true;
			category = _encriptionService.EncryptModel(category);
			return Ok(_attributeManager.UpdateCategory(category));
		}
		[Authorization(RoleType.Admin)]
		[HttpPost, Route("subcategory")]
		public IActionResult AddSubCategory([FromBody] SubCategory subCategory)
		{
			subCategory.Name = subCategory.Name.ToUpper();
			subCategory.CreatedBy = HttpContext.GetUserId();
			subCategory.CreatedOn = DateTime.Now;
			subCategory.IsDeleted = false;
			subCategory.IsActive = true;
			subCategory = _encriptionService.EncryptModel(subCategory);
			return Ok(_attributeManager.AddSubCategory(subCategory));
		}
		[Authorization(RoleType.Admin)]
		[HttpPost, Route("eqpt")]
		public IActionResult AddEqpt([FromBody] Eqpt eqpt)
		{
			eqpt.Name = eqpt.Name.ToUpper();
			eqpt.CreatedBy = HttpContext.GetUserId();
			eqpt.CreatedOn = DateTime.Now;
			eqpt.IsDeleted = false;
			eqpt.IsActive = true;
			eqpt = _encriptionService.EncryptModel(eqpt);
			return Ok(_attributeManager.AddEqpt(eqpt));
		}
		[AllowAnonymous]
		[HttpGet, Route("wing")]
		public IActionResult GetAllWings()
		{
			var encryptedData = _attributeManager.GetWing();

			var decryptedData = encryptedData
				.Select(p => _encriptionService.DecryptModel(p))
				.ToList();

			return Ok(decryptedData);
		
		}
		[HttpGet, Route("category{wingId}")]
		public IActionResult GetWing(long wingId)
		{
			var encryptedData = _attributeManager.GetCategories(wingId);

			
			var decryptedData = encryptedData
				.Select(p => _encriptionService.DecryptModel(p))
				.ToList();

			return Ok(decryptedData);
		
		}
		[HttpGet, Route("getAllcategory")]
		public IActionResult GetWing()
		{
			var encryptedData = _attributeManager.GetAllCategories();

		
			var decryptedData = encryptedData
				.Select(p => _encriptionService.DecryptModel(p))
				.ToList();

			return Ok(decryptedData);
			
		}
		[HttpGet, Route("subcategory{categoryId}")]
		public IActionResult GetSubCategory(long categoryId)
		{
			var encryptedData = _attributeManager.GetSubCategories(categoryId);

			var decryptedData = encryptedData
				.Select(p => _encriptionService.DecryptModel(p))
				.ToList();

			return Ok(decryptedData);
			
		}
		[HttpGet, Route("eqpt{categoryId}/{subCategoryId}")]
		public IActionResult GetSubCategory(long categoryId, long subCategoryId)
		{
			var encryptedData = _attributeManager.GetEqpt(categoryId, subCategoryId);

			var decryptedData = encryptedData
				.Select(p => _encriptionService.DecryptModel(p))
				.ToList();

			return Ok(decryptedData);
			
		}
		[Authorization(RoleType.Admin)]
		[HttpPost, Route("category/update")]
		public IActionResult DeactiveCategory([FromBody] Category category)
		{
			return Ok(_attributeManager.DeactivateCategory(category.Id));
		}
		[Authorization(RoleType.Admin)]
		[HttpPost, Route("subcategory/update")]
		public IActionResult UpdateSubCategory([FromBody] SubCategory subCategory)
		{
			subCategory.UpdatedBy = HttpContext.GetUserId();
			subCategory.UpdatedOn = DateTime.Now;
			subCategory = _encriptionService.EncryptModel(subCategory);
			return Ok(_attributeManager.UpdateSubCategory(subCategory));
		}
		[Authorization(RoleType.Admin)]
		[HttpPost, Route("eqpt/update")]
		public IActionResult UpdateEqpt([FromBody] Eqpt eqpt)
		{
			eqpt.UpdatedBy = HttpContext.GetUserId();
			eqpt.UpdatedOn = DateTime.Now;
			eqpt = _encriptionService.EncryptModel(eqpt);
			return Ok(_attributeManager.UpdateEqpt(eqpt));
		}
		[Authorization(RoleType.Admin)]
		[HttpPost, Route("delete")]
		public IActionResult DeleteDynamic([FromBody] DeactivateModel data)
		{
			return Ok(_attributeManager.DeleteDynamic(data));
		}



	}
}
