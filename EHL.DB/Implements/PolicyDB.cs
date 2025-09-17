using Dapper;
using EHL.Common.Helpers;
using EHL.Common.Models;
using EHL.DB.Interfaces;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EHL.DB.Implements
{
	public class PolicyDB : BaseDB, IPolicyDB
	{
		public PolicyDB(IConfiguration configuration) : base(configuration)
		{

		}

		public List<Policy> GetTechManualsAdvisioriesAndMiscByWing(long wingId)
		{
			try
			{
				string query = string.Format(@"select * from policy where  isactive = 1 and type in ('Technical Manuals', 'Misc') order by id desc");
				return connection.Query<Policy>(query, new { wingid = wingId }).ToList();
			}
			catch (Exception ex)
			{
				EHLLogger.Error(ex, "Class=PolicyDB,method=GetAllPolicyByWing");
				throw;
			}

		}

		public bool AddPolicy(Policy policy)
		{
			try
			{
				policy.FileName = policy.PolicyFile.FileName;
				string query = string.Format(@"insert into policy (type,contractType,wingid,categoryid,wing,category,subcategory,subcategoryid,eqpt,filename,remarks,filepath,createdby,createdon,isactive,isdeleted) values (@type,@contractType,@wingid,@categoryid,@wing,@category,@subcategory,@subcategoryid,@eqpt,@fileName,@remarks,@filepath,@createdby,@createdon,@isactive,@isdeleted)");
				return connection.Execute(query, policy) > 0;
			}
			catch (Exception ex)
			{
				EHLLogger.Error(ex, "Class=PolicyDB,method=AddPolicy");
				throw;
			}

		}
		public bool UpdatePolicy(Policy policy)
		{
			try
			{
				if (policy.PolicyFile != null)
				{
					policy.FileName = policy.PolicyFile.FileName;
				}
				string query = @"UPDATE policy SET type = @Type,wingid = @WingId,categoryid = @CategoryId,wing = @Wing,subcategory = @subcategory,subcategoryid = @subcategoryid,updatedby=@updatedby,updatedon=@updatedon,contractType=@contractType,
						eqpt = @eqpt,category = @Category,filename = @FileName,remarks = @Remarks,filepath = @FilePath WHERE id = @Id";
				return connection.Execute(query, policy) > 0;
			}
			catch (Exception ex)
			{
				EHLLogger.Error(ex, "Class=PolicyDB,method=UpdatePolicy");
				throw;
			}


		}

        public List<Policy> GetPoliciesAndAdvisiories()
        {
            try
            {
                string query = string.Format(@"select * from policy where type in ('Policy Compendium', 'Advisories') and isactive = 1 order by id desc");
                return connection.Query<Policy>(query).ToList();
            }
            catch (Exception ex)
            {
                EHLLogger.Error(ex, "Class=PolicyDB,method=GetPoliciesAndAdvisiories");
                throw;
            }

        }
        public List<Policy> GetByPolicyType(long wingId, string Type)
		{
			try
			{
				string query = string.Format(@"select * from policy where wingid = @wingid and type=@type and isactive = 1 order by id desc");
				return connection.Query<Policy>(query, new { wingid = wingId, type = Type }).ToList();
			}
			catch (Exception ex)
			{
				EHLLogger.Error(ex, "Class=PolicyDB,method=GetAdvisioriesByWing");
				throw;
			}

		}
	}
}
