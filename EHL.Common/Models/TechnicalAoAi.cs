using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EHL.Common.Helpers;
using Microsoft.AspNetCore.Http;

namespace EHL.Common.Models
{
    public class TechnicalAoAi : Base
    {

        public string Subject { get; set; }
        public string Type { get; set; }
        public string Reference { get; set; }
        public string FileName { get; set; }
        [AllowedFileTypes(new string[] { ".pdf", ".xls", ".xlsx" }, new string[] { "application/pdf", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })]
        public IFormFile TechnicalAoAiFile { get; set; }
        public string FilePath { get; set; }
        public long FileId { get; set; }
        public byte[] FileBytes { get; set; }
        public long FileSize { get; set; }
    }
}
