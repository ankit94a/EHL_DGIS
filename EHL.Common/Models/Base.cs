using EHL.Common.Helpers;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EHL.Common.Models
{
	public class Base
	{
        public long Id { get; set; }
        public int CreatedBy { get; set; }
        public int UpdatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime UpdatedOn { get; set; }
		public bool IsDeleted { get; set; } = false;
        public bool IsActive { get; set; }
	}

	public class DeactivateModel
	{
       public long Id { get; set; }
       public string TableName { get; set; }

       public string EmerNumber { get; set; }
	}

	public class DroneIcsc : Base
	{
       public int WingId { get; set; }

        [RegularExpression(@"^[A-Za-z0-9\s,.-]{1,}", ErrorMessage = "Wing should only contain letters and spaces.")]
        public string Wing { get; set; }
        [RegularExpression(@"^[A-Za-z0-9\s,.-]{1,}", ErrorMessage = "NomenClature should only contain letters and spaces.")]
        public string NomenClature { get; set; }
        [AllowedFileTypes(new string[] { ".pdf", ".xls", ".xlsx" }, new string[] { "application/pdf", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })]
        public IFormFile DroneIcscFile { get; set; }

        [RegularExpression(@"^[A-Za-z0-9\s,.-]{1,}", ErrorMessage = "Remarks should only contain letters and spaces.")]
        public string Remarks { get; set; }
        public long FileId { get; set; }
		public byte[] FileBytes { get; set; }
       public string FileName { get; set; }
        public string FilePath { get; set; }
        public long FileSize { get; set; }
        public string Type { get; set; }
	}
	public class Feedback : Base
	{
        [RegularExpression(@"^[A-Za-z0-9\s,.-]{1,}", ErrorMessage = "Name should only contain letters and spaces.")]
        public string Name { get; set; }

        [RegularExpression(@"^[A-Za-z0-9\s,.-]{1,}", ErrorMessage = "Rank should only contain letters and spaces.")]
        public string Rank { get; set; }

        [RegularExpression(@"^[A-Za-z0-9\s,.-]{1,}", ErrorMessage = "Unit should only contain letters and spaces.")]
        public string Unit { get; set; }

        [RegularExpression(@"^[A-Za-z0-9\s,.-]{1,}", ErrorMessage = "Army Number should only contain letters and spaces.")]
        public string Number { get; set; }

        [RegularExpression(@"^[A-Za-z0-9\s,.-]{1,}", ErrorMessage = "Message should only contain letters and spaces.")]
        public string Message { get; set; }
    }
}
