using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EHL.Common.Models
{
	public class Login : CaptchaRequest
	{
		[Required]
		public string UserName { get; set; }
		[Required]
		public string Password { get; set; }
	}
    public class ValidatePinRequest
    {
        public string pin { get; set; }


    }
}
