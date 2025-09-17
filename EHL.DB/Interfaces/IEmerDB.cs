using EHL.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EHL.DB.Interfaces
{
	public interface IEmerDB
	{
		public List<EmerModel> GetAllEmer(long wingId);
		public bool AddEmer(EmerModel emer);
        public Task<bool> UpdateEmer(EmerModel emer);
		public List<EmerModel> GetAllMasterSheet();
		public List<EmerModel> GetLatestEmer();
        public bool AddEmerIndex(EmerIndex emer);
        public Task<bool> UpdateEmerIndex(EmerIndex emer);
        public List<EmerIndex> GetEmerIndex(int wingId);
		public List<Policy> GetLatestTwoPoliciesPerType();
		public bool AddMasterSheet(EmerModel emer);


    }
}
