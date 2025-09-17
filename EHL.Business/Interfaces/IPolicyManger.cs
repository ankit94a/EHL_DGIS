using EHL.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EHL.Business.Interfaces
{
	public interface IPolicyManger
	{
		public Task<bool> AddPolicy(Policy policy);
        public Task<bool> UpdatePolicy(Policy policy);
        public List<Policy> GetTechManualsAdvisioriesAndMiscByWing(long wingId);
		public List<Policy> GetByPolicyType(long wingId, string type);
        public List<Policy> GetPoliciesAndAdvisiories();
    }
}
