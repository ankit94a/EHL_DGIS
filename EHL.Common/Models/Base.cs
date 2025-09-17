using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
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
		public string Wing { get; set; }
		public string NomenClature { get; set; }
		public IFormFile DroneIcscFile { get; set; }
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
        public string Name { get; set; }
        public string Rank { get; set; }
        public string Unit { get; set; }
        public string Number { get; set; }
        public string Message { get; set; }
    }
}
