using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EHL.Common.Models
{
	public class Wing : Base
	{
		public string Name { get; set; }
		public string Description { get; set; }
		public string ImageUrl { get; set; }
	}
	public class Category : Wing
	{
		public int WingId { get; set; }
	}
	public class SubCategory : Category
	{
		public int CategoryId { get; set; }
	}
	public class Eqpt : SubCategory
	{
		public int SubCategoryId { get; set; }
	}
}
