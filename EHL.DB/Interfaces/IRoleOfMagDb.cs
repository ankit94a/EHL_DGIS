using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EHL.Common.Models;

namespace EHL.DB.Interfaces
{
    public interface IRoleOfMagDb
    {
        public List<RoleOfMag> GetList();
        public bool AddRoleOfMag(RoleOfMag roleOfMag);
        public bool UpdateRoleOfMag(RoleOfMag roleOfMag);
    }
}
