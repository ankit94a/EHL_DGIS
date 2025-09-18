using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EHL.Common.Models
{
    public class ErrorResponse
    {
        public int StatusCode { get; set; }
        public string ErrorCode { get; set; } = "INTERNAL_ERROR";
        public string ErrorMessage { get; set; } = "An unexpected error occurred.";
        public string? Details { get; set; }
    }

}
