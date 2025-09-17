using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EHL.Common.Models
{
	public class Login : CaptchaRequest
	{
		public string UserName { get; set; }
		public string Password { get; set; }

	
	}
    public class ValidatePinRequest
    {
        public string pin { get; set; }


    }
}
