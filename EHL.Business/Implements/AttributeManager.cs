using EHL.Business.Interfaces;
using EHL.Common.Models;
using EHL.DB.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EHL.Business.Implements
{
	public class AttributeManager : IAttributeManager
	{
		private readonly IAttributeDB _attributeDb;
		public AttributeManager(IAttributeDB attributeDB)
		{
			_attributeDb = attributeDB;
		}
		public List<Wing> GetWing()
		{
			return _attributeDb.GetWing();
		}
		public bool AddWing(Wing wing)
		{
			return _attributeDb.AddWing(wing);
		}
        public bool UpdateWing(Wing wing)
        {
            return _attributeDb.UpdateWing(wing);
        }
        public bool AddCategory(Category category)
		{
			return _attributeDb.AddCategory(category);
		}
        public bool UpdateCategory(Category category)
        {
            return _attributeDb.UpdateCategory(category);
        }
        public List<Category> GetCategories(long wingId)
		{
			return _attributeDb.GetCategories(wingId);
		}
        public List<Category> GetAllCategories()
        {
            return _attributeDb.GetAllCategories();
        }
        public bool DeactivateCategory(long Id)
		{
			return _attributeDb.DeactivateCategory(Id);
		}
		public bool AddSubCategory(SubCategory subCategory)
		{
			return _attributeDb.AddSubCategory(subCategory);
		}
		public List<SubCategory> GetSubCategories(long categoryId)
		{
			return _attributeDb.GetSubCategories(categoryId);
		}
		public bool UpdateSubCategory(SubCategory subCategory)
		{
			return _attributeDb.UpdateSubCategory(subCategory);
		}

		public bool AddEqpt(Eqpt eqpt)
		{
			return _attributeDb.AddEqpt(eqpt);
		}
		public List<Eqpt> GetEqpt(long categoryId, long subCategoryId)
		{
			return _attributeDb.GetEqpt(categoryId, subCategoryId);
		}
		public bool UpdateEqpt(Eqpt eqpt)
		{
			return _attributeDb.UpdateEqpt(eqpt);
		}
        public bool DeleteDynamic(DeactivateModel data)
        {
			if(data.TableName == "emer")
			{
				var MastersheetModel = new DeactivateModel();
				var mastersheet = _attributeDb.GetMasterSheetByEmerNumber(data.EmerNumber);
				MastersheetModel.Id = mastersheet.Id;
				MastersheetModel.TableName = "mastersheet";
				_attributeDb.DeleteDynamic(MastersheetModel);
			}
            return _attributeDb.DeleteDynamic(data);
        }
    }
}
