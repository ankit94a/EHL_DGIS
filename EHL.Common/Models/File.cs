using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static EHL.Common.Enum.Enum;

namespace EHL.Common.Models
{
	public class AttachedFile : Base
	{
		public IFormFile EmerFile { get; set; }
		public long FileId { get; set; }
		public byte[] Document { get; set; }
		public string Name { get; set; }
		public long Size { get; set; }
		public DownloadFileType FileType { get; set; }
		public string FilePath { get; set; }
	}
    public class PdfDocuments : Base
    {
        public string FileType { get; set; }
        public byte[] FileStorage { get; set; }
        public IFormFile PdfFile { get; set; }
    }

}
