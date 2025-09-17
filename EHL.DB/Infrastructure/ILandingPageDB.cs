using EHL.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EHL.DB.Infrastructure
{
	public interface ILandingPageDB
	{
		public bool Deactivate(DeactivateModel item);
		public Task<bool> AddDroneOrIcsc(DroneIcsc item);

		public Task<bool> UpdateDroneOrIcsc(DroneIcsc item);
		public List<DroneIcsc> GetByDroneOrIcscType(long wingId, string type);
        public Task<bool> AddUserFeedback(Feedback item);
        public List<Feedback> GetAllFeedback();
    }
}
