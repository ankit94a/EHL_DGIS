using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EHL.Common.Models
{
	public class Wing : Base
	{
        [Required]
        [RegularExpression(@"^[A-Za-z0-9\s,.-]{1,}", ErrorMessage = "Name should only contain letters and spaces.")]
        public string Name { get; set; }

        [RegularExpression(@"^[A-Za-z0-9\s,.-]{1,}", ErrorMessage = "Description should only contain letters and spaces.")]
        public string Description { get; set; }

        [RegularExpression(@"^(http(s?):)([/|.|\w|\s|-])*\.(jpg|jpeg|png|gif|bmp|webp)$",ErrorMessage = "Please enter a valid image URL (jpg, jpeg, png, gif, bmp, webp).")]
        public string ImageUrl { get; set; }
	}
	public class Category : Wing
	{

        [Required]
        [RegularExpression(@"^[1-9][0-9]*$", ErrorMessage = "Wing Id must be a positive number.")]
        public int WingId { get; set; }
	}
	public class SubCategory : Category
	{

        [Required]
        [RegularExpression(@"^[1-9][0-9]*$", ErrorMessage = "Category Id must be a positive number.")]
        public int CategoryId { get; set; }
	}
	public class Eqpt : SubCategory
	{
        [Required]
        [RegularExpression(@"^[1-9][0-9]*$", ErrorMessage = "Sub Category ID must be a positive number.")]
        public int SubCategoryId { get; set; }
	}
}
