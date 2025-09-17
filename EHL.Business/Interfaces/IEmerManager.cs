using EHL.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EHL.Business.Interfaces
{
	public interface IEmerManager
	{
		public List<EmerModel> GetAllEmer(long wingId);
		public Task<bool> AddEmer(EmerModel emer);
		public Task<bool> UpdateEmer(EmerModel emer);		
        public Task<bool> AddEmerIndex(EmerIndex emer);
        public Task<bool> UpdateEmerIndex(EmerIndex emer);
        public List<EmerIndex> GetEmerIndex(int wingId);
        public List<Policy> GetLatestTwoPoliciesPerType();
        public List<EmerModel> GetLatestEmer();
        public List<EmerModel> GetAllMasterSheet();
    }
}
