using Dapper;
using EHL.Common.Helpers;
using EHL.Common.Models;
using EHL.DB.Interfaces;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.NetworkInformation;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace EHL.DB.Implements
{
	public class AttributeDB : BaseDB, IAttributeDB
	{
		public AttributeDB(IConfiguration configuration) : base(configuration)
		{

		}
		public bool AddWing(Wing wing)
		{
			try
			{
				string query = string.Format(@"insert into wing (name,createdby,createdon,isactive) values(@name,@createdby,@createdon,@isactive)");
				return connection.Execute(query, wing) > 0;
			}
			catch (Exception ex)
			{
				EHLLogger.Error(ex, "Class=AttributeDB,method=AddWing");
				throw;
			}
		}
		public bool UpdateWing(Wing wing)
		{
			try
			{
				string query = "UPDATE wing SET name = @Name WHERE id = @Id";
				return connection.Execute(query, new { wing.Name, wing.Id }) > 0;
			}
			catch (Exception ex)
			{
				EHLLogger.Error(ex, "Class=AttributeDB,method=UpdateWing");
				throw;
			}

		}
		public bool AddCategory(Category category)
		{
			try
			{

				string query = string.Format(@"insert into category (name,createdby,createdon,isactive,wingid) values(@name,@createdby,@createdon,@isactive,@wingid)");
				return connection.Execute(query, category) > 0;
			}
			catch (Exception ex)
			{
				EHLLogger.Error(ex, "Class=AttributeDB,method=AddCategory");
				throw;
			}
		}
		public bool UpdateCategory(Category category)
		{
			try
			{
				string query = "UPDATE category SET name = @Name WHERE id = @Id AND wingId = @WingId";
				return connection.Execute(query, new { category.Name, category.Id, category.WingId }) > 0;
			}
			catch (Exception ex)
			{
				EHLLogger.Error(ex, "Class=AttributeDB,method=UpdateCategory");
				throw;
			}
		}

		public List<Wing> GetWing()
		{
			try
			{
				string query = string.Format(@"select * from wing where isactive=1");
				return connection.Query<Wing>(query).ToList();
			}
			catch (Exception ex)
			{
				EHLLogger.Error(ex, "Class=AttributeDB,method=GetWing");
				throw;
			}
		}
		public List<Category> GetCategories(long wingId)
		{
			try
			{
				string query = string.Format(@"select * from category where wingid=@wingid and isactive=1 order by id desc");
				return connection.Query<Category>(query, new { wingid = wingId }).ToList();
			}
			catch (Exception ex)
			{
				EHLLogger.Error(ex, "Class=AttributeDB,method=GetCategories");
				throw;
			}
		}
		public List<Category> GetAllCategories()
		{
			try
			{
				string query = string.Format(@"select * from category where isactive=1 order by id desc");
				return connection.Query<Category>(query).ToList();
			}
			catch (Exception ex)
			{
				EHLLogger.Error(ex, "Class=AttributeDB,method=GetCategories");
				throw;
			}
		}
		public bool DeactivateCategory(long Id)
		{
			try
			{
				string query = string.Format(@"update category set isactive=0 where id=@id");
				return connection.Execute(query, new { id = Id }) > 0;
			}
			catch (Exception ex)
			{
				EHLLogger.Error(ex, "Class=AttributeDB,method=DeactivateCategory");
				throw;
			}
		}

		public bool AddSubCategory(SubCategory subCategory)
		{
			try
			{
				string query = string.Format(@"insert into subcategory (name,createdby,createdon,isactive,categoryid) values(@name,@createdby,@createdon,@isactive,@categoryid)");
				return connection.Execute(query, subCategory) > 0;
			}
			catch (Exception ex)
			{
				EHLLogger.Error(ex, "Class=AttributeDB,method=AddSubCategory");
				throw;
			}
		}

		public List<SubCategory> GetSubCategories(long categoryId)
		{
			try
			{

				string query = string.Format(@"select * from subcategory where categoryid = @categoryid and isactive=1 order by id desc");
				return connection.Query<SubCategory>(query, new { categoryid = categoryId }).ToList();
			}
			catch (Exception ex)
			{
				EHLLogger.Error(ex, "Class=AttributeDB,method=GetSubCategories");
				throw;
			}
		}
		public bool UpdateSubCategory(SubCategory subCategory)
		{
			try
			{
				string query = @"UPDATE subcategory 
                         SET name = @name,
                             updatedby =@updatedby,
                             updatedon =@updatedon,
                             categoryid = @categoryid
                         WHERE id = @id";

				return connection.Execute(query, subCategory) > 0;

			}
			catch (Exception ex)
			{
				EHLLogger.Error(ex, "Class=AttributeDB,method=DeactivateSubCategory");
				throw;
			}
		}

		public bool AddEqpt(Eqpt eqpt)
		{
			try
			{
				string query = string.Format(@"insert into eqpt (name,createdby,createdon,isactive,categoryid,subcategoryid) values(@name,@createdby,@createdon,@isactive,@categoryid,@subcategoryid)");
				return connection.Execute(query, eqpt) > 0;
			}
			catch (Exception ex)
			{
				EHLLogger.Error(ex, "Class=AttributeDB,method=AddEqpt");
				throw;
			}
		}

		public List<Eqpt> GetEqpt(long categoryId, long subCategoryId)
		{
			try
			{
				string query = string.Format(@"select * from eqpt where categoryid = @categoryid and subcategoryid=@subcategoryid and isactive=1 order by id desc");
				return connection.Query<Eqpt>(query, new { categoryid = categoryId, subcategoryid = subCategoryId }).ToList();
			}
			catch (Exception ex)
			{
				EHLLogger.Error(ex, "Class=AttributeDB,method=GetEqpt");
				throw;
			}
		}
		public bool UpdateEqpt(Eqpt eqpt)
		{
			try
			{

				string query = @"UPDATE eqpt 
                         SET name = @Name,
                             updatedby =@Updatedby,
                             updatedon =@Updatedon,
                             categoryid = @CategoryId,
                             subCategoryid = @SubCategoryId
                         WHERE id = @Id";

				return connection.Execute(query, eqpt) > 0;
			}
			catch (Exception ex)
			{
				EHLLogger.Error(ex, "Class=AttributeDB,method=DeactivateEqpt");
				throw;
			}
		}
		public bool DeleteDynamic(DeactivateModel data)
		{
			try
			{
				string query = $"UPDATE {data.TableName} SET isactive = 0 WHERE id = @id";
				return connection.Execute(query, new { id = data.Id }) > 0;
			}
			catch (Exception ex)
			{
				EHLLogger.Error(ex, $"Class=AttributeDB,Delete from ,table = {data.TableName}");
				throw;
			}
		}
		public EmerModel GetMasterSheetByEmerNumber(string EmerNumber)
		{
			try
			{
				string query = "SELECT * FROM mastersheet WHERE emernumber = @emernumber";
				return connection.QueryFirstOrDefault<EmerModel>(query, new { emernumber = EmerNumber });
			}
			catch (Exception ex)
			{
				EHLLogger.Error(ex, $"Class=AttributeDB,GetEmerById from ,table = emer");
				throw;
			}
		}

	}
}
