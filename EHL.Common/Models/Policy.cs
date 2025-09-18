using EHL.Common.Helpers;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EHL.Common.Models
{
	public class Policy : Base
	{
		public string Type { get; set; }
        public string ContractType { get; set; }
        public string Wing { get; set; }
		public string Category { get; set; }
		public long WingId { get; set; }
		public long CategoryId { get; set; }
		public long subCategoryId { get; set; }
		public string subCategory { get; set; }
		public string eqpt { get; set; }
		public string Remarks { get; set; }
		public string FileName { get; set; }
		public string FilePath { get; set; }
		public long FileSize { get; set; }

		public byte[] FileBytes { get; set; }
        [AllowedFileTypes(new string[] { ".pdf", ".xls", ".xlsx" }, new string[] { "application/pdf", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })]
        public IFormFile PolicyFile { get; set; }
	}
}
