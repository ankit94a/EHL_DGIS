using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EHL.Common.Models
{
	public class Policy : Base
	{
        [Required]
        public string Type { get; set; }

        [RegularExpression(@"^[A-Za-z0-9\s,.-]+$", ErrorMessage = "Contract Type can only contain letters, numbers, spaces, commas, dots, or hyphens.")]
        public string ContractType { get; set; }

        [RegularExpression(@"^[A-Za-z0-9\s,.-]+$", ErrorMessage = "Wing can only contain letters, numbers, spaces, commas, dots, or hyphens.")]
        public string Wing { get; set; }

        [RegularExpression(@"^[A-Za-z0-9\s,.-]+$", ErrorMessage = "Category can only contain letters, numbers, spaces, commas, dots, or hyphens.")]
        public string Category { get; set; }

        [RegularExpression(@"^[1-9][0-9]*$", ErrorMessage = "Wing Id must be a positive number.")]
        public long WingId { get; set; }

        [Required]
        [RegularExpression(@"^[1-9][0-9]*$", ErrorMessage = "Category Id must be a positive number.")]
        public long CategoryId { get; set; }

        [RegularExpression(@"^[1-9][0-9]*$", ErrorMessage = "Sub Category Id must be a positive number.")]
        public long subCategoryId { get; set; }

        [Required(ErrorMessage = "SubCategory is required.")]
        [RegularExpression(@"^[A-Za-z0-9\s,.-]+$", ErrorMessage = "SubCategory can only contain letters, numbers, spaces, commas, dots, or hyphens.")]
        public string subCategory { get; set; }

        [Required]
        [RegularExpression(@"^[A-Za-z0-9\s,.-]+$", ErrorMessage = "Equipment can only contain letters, numbers, spaces, commas, dots, or hyphens.")]
        public string eqpt { get; set; }

        [RegularExpression(@"^[A-Za-z0-9\s,.-]+$", ErrorMessage = "Remarks can only contain letters, numbers, spaces, commas, dots, or hyphens.")]
        public string Remarks { get; set; }
        public string FileName { get; set; }

        public string FilePath { get; set; }

         public long FileSize { get; set; }

		public byte[] FileBytes { get; set; }
        public IFormFile PolicyFile { get; set; }
	}
}
