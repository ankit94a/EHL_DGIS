using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EHL.Common.Models
{
    public class TechnicalAoAi : Base
    {
        [Required]
        [RegularExpression(@"^[A-Za-z0-9\s,.-]{1,}", ErrorMessage = " Subject should only contain letters and spaces.")]
        public string Subject { get; set; }

        [Required]
        [RegularExpression(@"^[A-Za-z0-9\s,.-]+$", ErrorMessage = "Type can only contain letters, numbers, spaces, commas, dots, or hyphens.")]
        public string Type { get; set; }

        [Required]
        [RegularExpression(@"^[A-Za-z0-9\s,.-/]+$", ErrorMessage = "Reference can only contain letters, numbers, spaces, commas, dots, slashes, or hyphens.")]
        public string Reference { get; set; }

        public string FileName { get; set; }
        public IFormFile TechnicalAoAiFile { get; set; }
        public string FilePath { get; set; }
        public long FileId { get; set; }
        public byte[] FileBytes { get; set; }
        public long FileSize { get; set; }
    }
}
