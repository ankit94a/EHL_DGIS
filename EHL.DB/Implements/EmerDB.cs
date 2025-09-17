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
	public class EmerDB : BaseDB, IEmerDB
	{
		public EmerDB(IConfiguration configuration) : base(configuration)
		{

		}

		public List<EmerModel> GetAllEmer(long wingId)
		{
			try
			{
				string query = string.Format(@"select * from emer  where wingid = @wingid and isactive = 1 order by id desc");
				var result = connection.Query<EmerModel>(query, new { wingid = wingId }).ToList();
				return result;
			}
			catch (Exception ex)
			{
				EHLLogger.Error(ex, "Class=EmerDB,method=GetAllEmer");
				throw;
			}

		}
		public List<EmerModel> GetAllMasterSheet()
		{
			try
			{
				string query = string.Format(@"select * from mastersheet  where isactive = 1 order by id desc");
				var result = connection.Query<EmerModel>(query).ToList();
				return result;
			}
			catch (Exception ex)
			{
				EHLLogger.Error(ex, "Class=EmerDB,method=GetAllMasterSheet");
				throw;
			}

		}
		public List<EmerModel> GetLatestEmer()
		{
			try
			{
				string query = string.Format(@"select * from emer where isactive=1 order by id desc OFFSET 10 ROWS FETCH NEXT 10 ROWS ONLY;");
				var result = connection.Query<EmerModel>(query).ToList();
				return result;
			}
			catch (Exception ex)
			{
				EHLLogger.Error(ex, "Class=EmerDB,method=GetLatestEmer");
				throw;
			}

		}
		public List<Policy> GetLatestTwoPoliciesPerType()
		{
			try
			{
				string query = @"WITH ranked_policies AS (SELECT *, ROW_NUMBER() OVER (PARTITION BY type ORDER BY id DESC) AS rn FROM policy WHERE type IN ('Technical Manuals', 'Policy Compendium', 'Advisories', 'ISPL', 'Misc','EP Contract') AND isactive = 1)
								SELECT * FROM ranked_policies WHERE rn <= 2 ORDER BY type, id DESC;";

				var result = connection.Query<Policy>(query).ToList();
				return result;
			}
			catch (Exception ex)
			{
				EHLLogger.Error(ex, "Class=EmerDB,method=GetLatestTwoPoliciesPerType");
				throw;
			}
		}

		public List<EmerIndex> GetEmerIndex(int wingId)
		{
			try
			{
				string query = string.Format(@"select * from emerindex where isactive=1 and wingid=@wingid order by id desc;");
				var result = connection.Query<EmerIndex>(query, new { wingid = wingId }).ToList();
				return result;
			}
			catch (Exception ex)
			{
				EHLLogger.Error(ex, "Class=EmerDB,method=GetEmerIndex");
				throw;
			}
		}
		public bool AddEmer(EmerModel emer)
		{
			try
			{
				string query = @"insert into emer (emernumber, subject, subfunction, category, subcategory, categoryid, subcategoryid, eqpt, remarks, createdby, createdon, isactive,wing,wingid,subfunctioncategory,subfunctiontype,filename,filepath) values  (@emernumber, @subject, @subfunction, @category, @subcategory, @categoryid, @subcategoryid, @eqpt, @remarks, @createdby, @createdon, @isactive,@wing,@wingid,@subfunctioncategory,@subfunctiontype,@filename,@filepath)";
				var result = connection.Execute(query, emer);
				return result > 0;
			}
			catch (Exception ex)
			{
				EHLLogger.Error(ex, "Class=EmerDB,method=AddEmer");
				throw;
			}
		}

        public bool AddMasterSheet(EmerModel emer)
        {
            try
            {
				string query;

                if (emer.Id > 0)
				{
                   query= @"UPDATE mastersheet SET emernumber = @emernumber,subfunction = @subfunction,category = @category,categoryid = @categoryid,eqpt = @eqpt,updatedby = @updatedby,updatedOn = @updatedOn,isactive = @isactive,wingid = @wingid WHERE emernumber = ( SELECT emernumber FROM emer WHERE id = @Id)";
                }
                else
				{
                    query = @"insert into mastersheet (emernumber, subfunction, category, categoryid, eqpt, createdby, createdon, isactive,wing,wingid) values  (@emernumber, @subfunction, @category, @categoryid, @eqpt, @createdby, @createdon, @isactive,@wing,@wingid)";

                }
                var result = connection.Execute(query, emer);
                return result > 0;
            }
            catch (Exception ex)
            {
                EHLLogger.Error(ex, "Class=EmerDB,method=AddMasterSheet");
                throw;
            }
        }
        public bool AddEmerIndex(EmerIndex emer)
        {
            try
            {
                if (emer.CreatedOn == default)
                    emer.CreatedOn = DateTime.Now;

                string query = @"insert into emerindex (emernumber, subject,  category, categoryid,  createdby, createdon, isactive,wing,wingid,filename,filepath) values (@emernumber, @subject, @category, @categoryid,  @createdby, @createdon, @isactive,@wing,@wingid,@filename,@filepath)";
                var result = connection.Execute(query, emer);
                return result > 0;
            }
            catch (Exception ex)
            {
				EHLLogger.Error(ex, "Class=EmerDB,method=AddEmerIndex");
				throw;
            }
        }

        public async Task<bool> UpdateEmerIndex(EmerIndex emer)
        {
            try
            {
               string query = @"UPDATE emerIndex SET emernumber = @EmerNumber,subject = @Subject,category = @Category,categoryid = @CategoryId,filename = @FileName,filepath=@FilePath,updatedby=@updatedby,updatedon=@updatedon WHERE id = @Id";
                var result = await connection.ExecuteAsync(query, emer);
                return result > 0;
            }
            catch (Exception ex)
            {
				EHLLogger.Error(ex, "Class=EmerDB,method=UpdateEmerIndex");
				throw ;
            }
        }
        public async Task<bool> UpdateEmer(EmerModel emer)
        {
            try
            {
			 string query = @"UPDATE emer SET emernumber = @EmerNumber, subject = @Subject,subfunction = @SubFunction,wingid = @WingId,category = @Category,categoryid = @CategoryId,subcategory = @SubCategory,
                         subcategoryid = @SubCategoryId,eqpt = @Eqpt,remarks = @Remarks,updatedby = @UpdatedBy,updatedon = @UpdatedOn,subfunctioncategory = @SubFunctionCategory,
                         subfunctiontype = @SubFunctionType,filename = @FileName,filepath=@FilePath WHERE id = @Id";

                var result = await connection.ExecuteAsync(query, emer);
                return result > 0;
            }
            catch (Exception ex)
            {
				EHLLogger.Error(ex, "Class=EmerDB,method=UpdateEmer");
				throw;
            }
        }
	}
}
