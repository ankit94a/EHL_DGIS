using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace EHL.Common.Models
{
    public class TechnicalAoAi : Base
    {

        public string Subject { get; set; }
        public string Type { get; set; }
        public string Reference { get; set; }
        public string FileName { get; set; }
        public IFormFile TechnicalAoAiFile { get; set; }
        public string FilePath { get; set; }
        public long FileId { get; set; }
        public byte[] FileBytes { get; set; }
        public long FileSize { get; set; }
    }
}
