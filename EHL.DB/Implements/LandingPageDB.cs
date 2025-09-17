using Dapper;
using EHL.Common.Helpers;
using EHL.Common.Models;
using EHL.DB.Infrastructure;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EHL.DB.Implements
{
	public class LandingPageDB : BaseDB, ILandingPageDB
	{
		public LandingPageDB(IConfiguration configuration) : base(configuration) { }

		public bool Deactivate(DeactivateModel model)
		{
			try
			{
				string query = $"UPDATE {model.TableName} SET isactive = 0 WHERE id = @Id";
				var result = connection.Execute(query, new { model.Id });
				return result > 0;
			}
			catch (Exception ex)
			{
				EHLLogger.Error(ex, $"Deactivate method error for table = {model.TableName}, method is in LandingPageDB.Deactivate");
				throw;
			}
		}
		public async Task<bool> AddDroneOrIcsc(DroneIcsc item)
		{
			try
			{
				string query = string.Format(@"INSERT INTO DroneAndIcsc (wingId,wing,CreatedBy,CreatedOn,IsActive,IsDeleted,remarks,filename,filepath,NomenClature,type)
                                    VALUES(@wingId,@wing,@CreatedBy,@CreatedOn,@IsActive,@IsDeleted,@remarks,@filename,@filepath,@NomenClature,@type);");
				var result = await connection.ExecuteAsync(query, item);
				return result > 0;
			}
			catch (Exception ex)
			{
				EHLLogger.Error(ex, $"Deactivate method error for table = DroneAndIcsc, method is in LandingPageDB.AddDroneOrIcsc");
				throw;
			}
		}

		public async Task<bool> UpdateDroneOrIcsc(DroneIcsc item)
		{
			try
			{
				string query = string.Format(@"UPDATE DroneAndIcsc SET UpdatedBy = @UpdatedBy,UpdatedOn= @UpdatedOn,remarks= @remarks,
										filename = @filename,filepath = @filepath,NomenClature = @NomenClature,type = @type WHERE Id = @Id;");
				var result = await connection.ExecuteAsync(query, item);
				return result > 0;
			}
			catch (Exception ex)
			{
				EHLLogger.Error(ex, $"Deactivate method error for table = DroneAndIcsc, method is in LandingPageDB.AddDroneOrIcsc");
				throw;
			}
		}
		public List<DroneIcsc> GetByDroneOrIcscType(long wingId, string Type)
		{
			try
			{
				var types = new List<string>();
				if (Type == "Standard")
				{
					types = new List<string> { "Standard", "Induction" };
				}
				else
				{
				  types = new List<string> { "ISPPL", "RIPL" };
				}
				string query = string.Format(@"select * from DroneAndIcsc where wingid = @wingid and type in @type and isactive = 1 order by id desc");
				return connection.Query<DroneIcsc>(query, new { wingid = wingId, type = types }).ToList();
			}
			catch (Exception ex)
			{
				EHLLogger.Error(ex, "Class=PolicyDB,method=GetAdvisioriesByWing");
				throw;
			}

		}
        public async Task<bool> AddUserFeedback(Feedback item)
        {
            try
            {
                string query = string.Format(@"INSERT INTO Feedback (name,rank,unit,number, CreatedBy,CreatedOn,IsActive,IsDeleted,message)
                                    VALUES(@name,@rank,@unit,@number,@CreatedBy,@CreatedOn,@IsActive,@IsDeleted,@message);");
                var result = await connection.ExecuteAsync(query, item);
                return result > 0;
            }
            catch (Exception ex)
            {
                EHLLogger.Error(ex, $"AddUserFeedback method error for table = Feedback, method is in LandingPageDB.AddUserFeedback");
                throw;
            }
        }

        public List<Feedback> GetAllFeedback()
        {
            try
            {
                string query = string.Format(@"select * from feedback where isactive=1 order by id desc;");
                var result =  connection.Query<Feedback>(query).ToList();
                return result;
            }
            catch (Exception ex)
            {
                EHLLogger.Error(ex, $"GetAllFeedback method error for table = Feedback, method is in LandingPageDB.GetAllFeedback");
                throw;
            }
        }
    }
}
