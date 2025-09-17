using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EHL.Business.Interfaces;
using EHL.Common.Models;
using EHL.DB.Implements;
using EHL.DB.Interfaces;

namespace EHL.Business.Implements
{
	internal class TechnicalAoAiManager : ITechnicalAoAiManager
	{
		private readonly ItechnicalAoAiDB _technicalAoAiDb;
		public TechnicalAoAiManager(ItechnicalAoAiDB technicalAoAiDB)
		{
			_technicalAoAiDb = technicalAoAiDB;
		}
		public List<TechnicalAoAi> GetList()
		{
			return _technicalAoAiDb.GetList();
		}

		public async Task<bool> AddTechnicalAoAi(TechnicalAoAi technicalAoAi)
		{
			try
			{

				if (technicalAoAi.TechnicalAoAiFile != null && technicalAoAi.TechnicalAoAiFile.Length > 0)
				{
					string uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "technicalAoAi");
					string filePath = Path.Combine(uploadsFolder, technicalAoAi.TechnicalAoAiFile.FileName);

					if (!Directory.Exists(uploadsFolder))
					{
						Directory.CreateDirectory(uploadsFolder);
					}

					technicalAoAi.FileName = technicalAoAi.TechnicalAoAiFile.FileName;
					technicalAoAi.FilePath = technicalAoAi.FileName;

					using (var fileStream = new FileStream(filePath, FileMode.Create, FileAccess.Write, FileShare.None))
					{
						await technicalAoAi.TechnicalAoAiFile.CopyToAsync(fileStream);
					}
				}

				return _technicalAoAiDb.AddTechnicalAoAi(technicalAoAi);
			}
			catch (Exception ex)
			{
				
				throw new Exception("Error while adding the technicalAoAiModel data.", ex);
			}
		}


		public async Task<bool> UpdateTechnicalAoAi(TechnicalAoAi technicalAoAi)
		{
			try
			{
				if (technicalAoAi.TechnicalAoAiFile != null && technicalAoAi.TechnicalAoAiFile.Length > 0)
				{
					string uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "technicalAoAi");
					string filePath = Path.Combine(uploadsFolder, technicalAoAi.TechnicalAoAiFile.FileName);


					if (!Directory.Exists(uploadsFolder))
					{
						Directory.CreateDirectory(uploadsFolder);
					}

					technicalAoAi.FileName = technicalAoAi.TechnicalAoAiFile.FileName;
					technicalAoAi.FilePath = technicalAoAi.FileName;

					using (var fileStream = new FileStream(filePath, FileMode.Create, FileAccess.Write, FileShare.None))
					{
						await technicalAoAi.TechnicalAoAiFile.CopyToAsync(fileStream);
					}
				}

				bool result = await _technicalAoAiDb.UpdateTechnicalAoAi(technicalAoAi);
				return result;
			}
			catch (Exception ex)
			{
				
				throw new Exception("Error while updating EmerModel data.", ex);
			}
		}


	}


}
