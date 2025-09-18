using System;
using System.Collections.Generic;
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
		public string EmerNumber { get; set; }
		public string Subject { get; set; }
		public string SubFunction { get; set; }
		public string SubFunctionCategory { get; set; }
		public string SubFunctionType { get; set; }
		public long CategoryId { get; set; }
		public long SubCategoryId { get; set; }
		public string Category { get; set; }
		public string SubCategory { get; set; }
		public string Eqpt { get; set; }
        [AllowedFileTypes(new string[] { ".pdf", ".xls", ".xlsx" },new string[] { "application/pdf", "application/vnd.ms-excel","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })]
        public IFormFile EmerFile { get; set; }
		public string Remarks { get; set; }
		public long FileId { get; set; }
		public byte[] FileBytes { get; set; }
		public string FileName { get; set; }
		public string FilePath { get; set; }
		public long FileSize { get; set; }
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
		public string EmerNumber { get; set; }
		public string Category { get; set; }
		public string Wing { get; set; }
		public int WingId { get; set; }
		public int CategoryId { get; set; }
		public string Subject { get; set; }
		public string FileName { get; set; }
		public string FilePath { get; set; }
        [AllowedFileTypes(new string[] { ".pdf", ".xls", ".xlsx" }, new string[] { "application/pdf", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })]
        public IFormFile EmerFile { get; set; }
		public byte[] FileBytes { get; set; }
	}

}