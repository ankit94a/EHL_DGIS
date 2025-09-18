using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EHL.Common.Helpers
{
    public class AllowedFileTypesAttribute : ValidationAttribute
    {
        private readonly string[] _extensions;
        private readonly string[] _mimeTypes;

        public AllowedFileTypesAttribute(string[] extensions, string[] mimeTypes)
        {
            _extensions = extensions;
            _mimeTypes = mimeTypes;
        }

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            var file = value as IFormFile;

            if (file != null)
            {
                var extension = Path.GetExtension(file.FileName).ToLower();
                var mimeType = file.ContentType.ToLower();

                if (!_extensions.Contains(extension) || !_mimeTypes.Contains(mimeType))
                {
                    return new ValidationResult($"Invalid file Only PDF and Excel files are allowed.");
                }
            }

            return ValidationResult.Success;
        }
    }

}
