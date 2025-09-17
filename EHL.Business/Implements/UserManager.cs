using EHL.Business.Interfaces;
using EHL.Common.Models;
using EHL.DB.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EHL.Business.Implements
{
	public class UserManager : IUserManager
	{
		private readonly IUserDB _userDB;

		public UserManager(IUserDB userDB)
		{
			_userDB = userDB;
		}
        public UserDetails GetUserByEmail(string userName)
        {
            return _userDB.GetUserByEmail(userName);

        }
        public bool UpdatePassword(long id, string plainPassword)
        {
            if (string.IsNullOrWhiteSpace(plainPassword)) return false;


            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(plainPassword, workFactor: 12);

            return _userDB.UpdatePassword(id, hashedPassword);
        }
        public bool updateLoggedIn(int isLoggedIn, string userName)
        {
            return _userDB.updateLoggedIn(isLoggedIn,userName);
        }
    }
}
