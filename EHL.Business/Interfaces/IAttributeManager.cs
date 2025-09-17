using EHL.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EHL.Business.Interfaces
{
	public interface IAttributeManager
	{
		public List<Wing> GetWing();
		public bool AddWing(Wing wing);
        public bool UpdateWing(Wing wing);
        public bool AddCategory(Category category);
        public bool UpdateCategory(Category category);
        public List<Category> GetCategories(long wingId);
        public List<Category> GetAllCategories();
        public bool DeactivateCategory(long Id);
		public bool AddSubCategory(SubCategory subCategory);
		public List<SubCategory> GetSubCategories(long categoryId);
		public bool UpdateSubCategory(SubCategory subCategory);
		public bool AddEqpt(Eqpt eqpt);
		public List<Eqpt> GetEqpt(long categoryId, long subCategoryId);
		public bool UpdateEqpt(Eqpt eqpt);
        public bool DeleteDynamic(DeactivateModel data);
    }
}
