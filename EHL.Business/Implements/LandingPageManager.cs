using EHL.Business.Interfaces;
using EHL.Common.Helpers;
using EHL.Common.Models;
using EHL.DB.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static EHL.Common.Enum.Enum;

namespace EHL.Business.Implements
{
	public class LandingPageManager : ILandingPageManager
	{
		private readonly ILandingPageDB _landingPageDb;
		public LandingPageManager(ILandingPageDB landingPageDb)
		{
			_landingPageDb = landingPageDb;
		}
		public bool Deactivate(DeactivateModel item)
		{
			return _landingPageDb.Deactivate(item);
		}
		public async Task<bool> AddDroneOrIcsc(DroneIcsc item)
		{
			try
			{

				if (item.DroneIcscFile != null && item.DroneIcscFile.Length > 0)
				{
					string uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "droneandicsc");
					string filePath = Path.Combine(uploadsFolder, item.DroneIcscFile.FileName);

					if (!Directory.Exists(uploadsFolder))
					{
						Directory.CreateDirectory(uploadsFolder);
					}

					item.FileName = item.DroneIcscFile.FileName;
					item.FilePath = item.FileName;

					using (var fileStream = new FileStream(filePath, FileMode.Create, FileAccess.Write, FileShare.None))
					{
						await item.DroneIcscFile.CopyToAsync(fileStream);
					}
				}

				return await _landingPageDb.AddDroneOrIcsc(item);
			}
			catch (Exception ex)
			{
				EHLLogger.Error(ex, "Class=LandingManager,method=AddDroneOrIcsc Error while adding the DroneOrIcsc data");
				throw new Exception("Error while adding the AddDroneOrIcsc data.", ex);
			}
		}
		public async Task<bool> UpdateDroneOrIcsc(DroneIcsc item)
		{
			try
			{
				if (item.DroneIcscFile != null && item.DroneIcscFile.Length > 0)
				{
					string uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "item");
					string filePath = Path.Combine(uploadsFolder, item.DroneIcscFile.FileName);


					if (!Directory.Exists(uploadsFolder))
					{
						Directory.CreateDirectory(uploadsFolder);
					}

					item.FileName = item.DroneIcscFile.FileName;
					item.FilePath = item.FileName;

					using (var fileStream = new FileStream(filePath, FileMode.Create, FileAccess.Write, FileShare.None))
					{
						await item.DroneIcscFile.CopyToAsync(fileStream);
					}
				}
				return await _landingPageDb.UpdateDroneOrIcsc(item);
			}
			catch (Exception ex)
			{
				EHLLogger.Error(ex, "Class=itemManager,method=Updateitem Error while adding the itemModel data");
				throw new Exception("Error while updating itemModel data.", ex);
			}

		}
		public List<DroneIcsc> GetByDroneOrIcscType(long wingId, string type)
		{
			return _landingPageDb.GetByDroneOrIcscType(wingId, type);
		}
		public Task<bool> AddUserFeedback(Feedback item)
		{
			return _landingPageDb.AddUserFeedback(item);
		}
        public List<Feedback> GetAllFeedback()
        {
            return _landingPageDb.GetAllFeedback();
        }
    }
}
