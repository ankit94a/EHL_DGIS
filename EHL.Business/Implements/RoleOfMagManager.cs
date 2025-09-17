using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EHL.Business.Interfaces;
using EHL.Common.Models;
using EHL.DB.Interfaces;

namespace EHL.Business.Implements
{
    public class RoleOfMagManager : IRoleOfMagManager
    {
        private readonly IRoleOfMagDb _roleOfMagDb;
        public RoleOfMagManager(IRoleOfMagDb roleOfMagDb)
        {
            _roleOfMagDb = roleOfMagDb;
        }

        public List<RoleOfMag> GetList()
        {
            return _roleOfMagDb.GetList();
        }
        public bool AddRoleOfMag(RoleOfMag roleOfMag)
        {
            roleOfMag.CreatedOn = DateTime.Now;
            roleOfMag.IsActive = true;
            return _roleOfMagDb.AddRoleOfMag(roleOfMag);    
        }
        public bool UpdateRoleOfMag(RoleOfMag roleOfMag)
        {
            roleOfMag.UpdatedOn = DateTime.Now;
            roleOfMag.IsActive = true;
            return _roleOfMagDb.UpdateRoleOfMag(roleOfMag);
        }
    }
}
