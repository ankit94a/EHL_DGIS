using EHL.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EHL.DB.Infrastructure
{
	public interface IUserDB
	{
        public bool UpdatePassword(long id, string plainPassword);
        public UserDetails GetUserByEmail(string userName);
        public bool updateLoggedIn(int isLoggedIn, string userName);
    }
}
