using EHL.Business.Interfaces;
using EHL.Common.Helpers;
using EHL.Common.Models;
using EHL.DB.Interfaces;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EHL.Business.Implements
{
	public class EmerManager : IEmerManager
	{
		private readonly IEmerDB _emerDb;
		public EmerManager(IEmerDB emerDB)
		{
			_emerDb = emerDB;
		}
		public List<EmerModel> GetAllEmer(long wingId)
		{
			return _emerDb.GetAllEmer(wingId);
		}
		public List<EmerModel> GetAllMasterSheet()
		{
			return _emerDb.GetAllMasterSheet();
		}
		public List<EmerModel> GetLatestEmer()
		{
			return _emerDb.GetLatestEmer();
		}
		public List<EmerIndex> GetEmerIndex(int wingId)
		{
			return _emerDb.GetEmerIndex(wingId);
		}
		public List<Policy> GetLatestTwoPoliciesPerType()
		{
			return _emerDb.GetLatestTwoPoliciesPerType();
		}
		public async Task<bool> AddEmer(EmerModel emer)
		{
			try
			{

				if (emer.EmerFile != null && emer.EmerFile.Length > 0)
				{
					string uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "emer");
					string filePath = Path.Combine(uploadsFolder, emer.EmerFile.FileName);

					if (!Directory.Exists(uploadsFolder))
					{
						Directory.CreateDirectory(uploadsFolder);
					}

					emer.FileName = emer.EmerFile.FileName;
					emer.FilePath = emer.FileName;

					using (var fileStream = new FileStream(filePath, FileMode.Create, FileAccess.Write, FileShare.None))
					{
						await emer.EmerFile.CopyToAsync(fileStream);
					}
				}

				if (_emerDb.AddEmer(emer))
				{
					return _emerDb.AddMasterSheet(emer);
				};
				return false;
			}
			catch (Exception ex)
			{
				EHLLogger.Error(ex, "Class=EmerManager,method=AddEmer Error while adding the EmerModel data");
				throw new Exception("Error while adding the EmerModel data.", ex);
			}
		}


		public async Task<bool> AddEmerIndex(EmerIndex emer)
		{
			try
			{

				if (emer.EmerFile != null && emer.EmerFile.Length > 0)
				{
					string uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "index");
					string filePath = Path.Combine(uploadsFolder, emer.EmerFile.FileName);

					if (!Directory.Exists(uploadsFolder))
					{
						Directory.CreateDirectory(uploadsFolder);
					}

					emer.FileName = emer.EmerFile.FileName;
					emer.FilePath = emer.FileName;

					using (var fileStream = new FileStream(filePath, FileMode.Create, FileAccess.Write, FileShare.None))
					{
						await emer.EmerFile.CopyToAsync(fileStream);
					}
				}
				return _emerDb.AddEmerIndex(emer);
			}
			catch (Exception ex)
			{
				EHLLogger.Error(ex, "Class=EmerManager,method=AddEmerIndex Error while adding the EmerModel data");
				throw new Exception("Error while adding the EmerModelIndex data.", ex);
			}
		}

		public async Task<bool> UpdateEmerIndex(EmerIndex emer)
		{
			try
			{

				if (emer.EmerFile != null && emer.EmerFile.Length > 0)
				{
					string uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "index");
					string filePath = Path.Combine(uploadsFolder, emer.EmerFile.FileName);

					if (!Directory.Exists(uploadsFolder))
					{
						Directory.CreateDirectory(uploadsFolder);
					}

					emer.FileName = emer.EmerFile.FileName;
					emer.FilePath = emer.FileName;

					using (var fileStream = new FileStream(filePath, FileMode.Create, FileAccess.Write, FileShare.None))
					{
						await emer.EmerFile.CopyToAsync(fileStream);
					}
				}
				bool result = await _emerDb.UpdateEmerIndex(emer);
				return result;
			}
			catch (Exception ex)
			{
				EHLLogger.Error(ex, "Class=EmerManager,method=UpdateEmerIndex");
				throw new Exception("Error while adding the EmerModel data.", ex);
			}

		}
		public async Task<bool> UpdateEmer(EmerModel emer)
		{
			try
			{
				if (emer.EmerFile != null && emer.EmerFile.Length > 0)
				{
					string uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "emer");
					string filePath = Path.Combine(uploadsFolder, emer.EmerFile.FileName);


					if (!Directory.Exists(uploadsFolder))
					{
						Directory.CreateDirectory(uploadsFolder);
					}

					emer.FileName = emer.EmerFile.FileName;
					emer.FilePath = emer.FileName;

					using (var fileStream = new FileStream(filePath, FileMode.Create, FileAccess.Write, FileShare.None))
					{
						await emer.EmerFile.CopyToAsync(fileStream);
					}
				}
                bool updateMastesheet= _emerDb.AddMasterSheet(emer);
                bool result = await _emerDb.UpdateEmer(emer);
                if (!updateMastesheet || !result)
                {
                    throw new Exception("Failed to update Emer or MasterSheet.");
                }
                return result;
			}
			catch (Exception ex)
			{
				EHLLogger.Error(ex, "Class=EmerManager,method=UpdateEmer Error while adding the EmerModel data");
				throw new Exception("Error while updating EmerModel data.", ex);
			}
		}
	}
}
