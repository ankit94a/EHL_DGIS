using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EHL.Common.Helpers;
using Microsoft.AspNetCore.Http;
using static EHL.Common.Enum.Enum;
namespace EHL.Common.Models
{
	public class EmerModel : Base
	{
        [Required]
        [RegularExpression(@"^[A-Za-z0-9\s,.-]{1,}", ErrorMessage = " EmerNumber should only contain letters and spaces.")]
        public string EmerNumber { get; set; }
        [Required]
        [RegularExpression(@"^[A-Za-z0-9\s,.-]{1,}", ErrorMessage = " Subject should only contain letters and spaces.")]

        public string Subject { get; set; }
        [Required]
        [RegularExpression(@"^[A-Za-z0-9\s,.-]{1,}", ErrorMessage = " Subject function should only contain letters and spaces.")]
        public string SubFunction { get; set; }

        [RegularExpression(@"^[A-Za-z0-9\s,.-]{1,}", ErrorMessage = "Sub Function Category should only contain letters and spaces.")]
        public string SubFunctionCategory { get; set; }

        [RegularExpression(@"^[A-Za-z0-9\s,.-]{1,}", ErrorMessage = "Sub Function Type should only contain letters and spaces.")]
        public string SubFunctionType { get; set; }
        public long CategoryId { get; set; }
        public long SubCategoryId { get; set; }

        [RegularExpression(@"^[A-Za-z0-9\s,.-]{1,}", ErrorMessage = "Category should only contain letters and spaces.")]
        public string Category { get; set; }

        [RegularExpression(@"^[A-Za-z0-9\s,.-]{1,}", ErrorMessage = "Sub Category should only contain letters and spaces.")]
        public string SubCategory { get; set; }

        [Required]
        [RegularExpression(@"^[A-Za-z0-9\s,.-]{1,}", ErrorMessage = "Eqpt should only contain letters and spaces.")]

        public string Eqpt { get; set; }
        [AllowedFileTypes(new string[] { ".pdf", ".xls", ".xlsx" }, new string[] { "application/pdf", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })]
        public IFormFile EmerFile { get; set; }

        [RegularExpression(@"^[A-Za-z0-9\s,.-]{1,}", ErrorMessage = "Remarks should only contain letters and spaces.")]
        public string Remarks { get; set; }
        public long FileId { get; set; }

		public byte[] FileBytes { get; set; }
        public string FileName { get; set; }
        public string FilePath { get; set; }
        public long FileSize { get; set; }
        [RegularExpression(@"^[A-Za-z0-9\s,.-]{1,}", ErrorMessage = "Wing should only contain letters and spaces.")]
        public string Wing { get; set; }
        public int WingId { get; set; }

	}

	public class Documents
	{
       public long Id { get; set; }
		public byte[] Document { get; set; }
        public string Name { get; set; }
        public string FileType { get; set; }
       public long Size { get; set; }
        public int CreatedBy { get; set; }
         public int UpdatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime UpdatedOn { get; set; }
        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }
        public string FilePath { get; set; }
	}

	public class EmerIndex : Base
	{
        [Required]
        [RegularExpression(@"^[A-Za-z0-9\s,.-]{1,}", ErrorMessage = " EmerNumber should only contain letters and spaces.")]
        public string EmerNumber { get; set; }

        [RegularExpression(@"^[A-Za-z0-9\s,.-]{1,}", ErrorMessage = "Category should only contain letters and spaces.")]
        public string Category { get; set; }
        [RegularExpression(@"^[A-Za-z0-9\s,.-]{1,}", ErrorMessage = "Wing should only contain letters and spaces.")]
        public string Wing { get; set; }

        public int WingId { get; set; }
        public int CategoryId { get; set; }

        [Required]
        [RegularExpression(@"^[A-Za-z0-9\s,.-]{1,}", ErrorMessage = " Subject should only contain letters and spaces.")]
        public string Subject { get; set; }

        public string FileName { get; set;}

        public string FilePath { get; set; }
        [AllowedFileTypes(new string[] { ".pdf", ".xls", ".xlsx" }, new string[] { "application/pdf", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })]
        public IFormFile EmerFile { get; set; }
		public byte[] FileBytes { get; set; }
	}

}