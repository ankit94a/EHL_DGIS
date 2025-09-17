using EHL.Business.Interfaces;
using EHL.Common.Models;
using EHL.DB.Implements;
using EHL.DB.Interfaces;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EHL.Business.Implements
{
	public class PolicyManger : IPolicyManger
	{
		private readonly IPolicyDB _policyDB;
		private readonly IEmerDB _emerDB;
		public PolicyManger(IPolicyDB policyDB, IEmerDB emerDB)
		{
			_policyDB = policyDB;
			_emerDB = emerDB;
		}
		public async Task<bool> AddPolicy(Policy policy)
		{
			try
			{

				if (policy.PolicyFile != null && policy.PolicyFile.Length > 0)
				{
					string uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "policy");

					if (!Directory.Exists(uploadsFolder))
					{
						Directory.CreateDirectory(uploadsFolder);
					}
					string fullFilePath = Path.Combine(uploadsFolder, policy.PolicyFile.FileName);

					policy.FilePath = policy.PolicyFile.FileName;

					using (var fileStream = new FileStream(fullFilePath, FileMode.Create, FileAccess.Write, FileShare.None))
					{
						await policy.PolicyFile.CopyToAsync(fileStream);
					}

				}


				return _policyDB.AddPolicy(policy);
			}
			catch (Exception ex)
			{
				throw new Exception("Error while adding the EmerModel data.", ex);
			}

		}
		public async Task<bool> UpdatePolicy(Policy policy)
		{
			try
			{

				if (policy.PolicyFile != null && policy.PolicyFile.Length > 0)
				{
					string uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "policy");

					if (!Directory.Exists(uploadsFolder))
					{
						Directory.CreateDirectory(uploadsFolder);
					}
					string uniqueFileName = $"{Guid.NewGuid()}{Path.GetExtension(policy.PolicyFile.FileName)}";
					string fullFilePath = Path.Combine(uploadsFolder, policy.PolicyFile.FileName);


					policy.FilePath = policy.PolicyFile.FileName;
					using (var fileStream = new FileStream(fullFilePath, FileMode.Create, FileAccess.Write, FileShare.None))
					{
						await policy.PolicyFile.CopyToAsync(fileStream);
						policy.FilePath = fullFilePath;
					}

				}


				return _policyDB.UpdatePolicy(policy);
			}
			catch (Exception ex)
			{
				throw new Exception("Error while adding the EmerModel data.", ex);
			}

		}
		public List<Policy> GetTechManualsAdvisioriesAndMiscByWing(long wingId)
		{
			return _policyDB.GetTechManualsAdvisioriesAndMiscByWing(wingId);
		}
		public List<Policy> GetByPolicyType(long wingId, string type)
		{
			return _policyDB.GetByPolicyType(wingId, type);
		}
		public List<Policy> GetPoliciesAndAdvisiories()
		{
			return _policyDB.GetPoliciesAndAdvisiories();

		}

	}
}
