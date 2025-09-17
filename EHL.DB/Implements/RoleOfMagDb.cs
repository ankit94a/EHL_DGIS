using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using EHL.Common.Helpers;
using EHL.Common.Models;
using EHL.DB.Interfaces;
using Microsoft.Extensions.Configuration;

namespace EHL.DB.Implements
{
    public  class RoleOfMagDb : BaseDB,IRoleOfMagDb
    {
        public RoleOfMagDb(IConfiguration configuration) : base(configuration)
        {

        }

        public List<RoleOfMag> GetList()
        {
            try
            {
                string query = string.Format("select * from roleofmag where isactive = 1 order by id desc");
                return connection.Query<RoleOfMag>(query).ToList();
            }
            catch (Exception ex)
            {
                EHLLogger.Error(ex, "Class=RoleOfMagDb,method=GetList");
                throw;
            }

        }

        public bool AddRoleOfMag(RoleOfMag roleOfMag)
        {
            try
            {
                if (roleOfMag.CreatedOn == default)
                    roleOfMag.CreatedOn = DateTime.Now;

                string query = string.Format(@"insert into roleofmag (name,wing,wingid,createdby,createdon,isactive,isDeleted,nameofofficer, appointment, militaryno, mobile, civilno, eqptdealing) values (@name,@wing,@wingid,@createdby,@createdon,@isactive,@isDeleted,@nameofofficer,@appointment, @militaryno, @mobile, @civilno, @eqptdealing)");
                var result = connection.Execute(query, roleOfMag);
                return result > 0;
            }
            catch (Exception ex)
            {
                EHLLogger.Error(ex, "Class=RoleOfMagDb,method=AddRoleOfMag");
                throw;
            }
        }

        public bool UpdateRoleOfMag(RoleOfMag roleOfMag)
        {
            try
            {
                if (roleOfMag.UpdatedOn == default)
                    roleOfMag.UpdatedOn = DateTime.Now;

                string query = @"
            UPDATE roleofmag
            SET 
                name = @Name,
                wing = @Wing,
                wingid = @WingId,
                updatedby = @UpdatedBy,
                updatedon = @UpdatedOn,
                isactive = @IsActive,
                isdeleted = @IsDeleted,
                nameofofficer = @NameOfOfficer,
                appointment = @Appointment,
                militaryno = @MilitaryNo,
                mobile = @Mobile,
                civilno = @CivilNo,
                eqptdealing = @EqptDealing
            WHERE id = @Id";

                var result = connection.Execute(query, roleOfMag);
                return result > 0;
            }
            catch (Exception ex)
            {
                EHLLogger.Error(ex, "Class=RoleOfMagDb, Method=UpdateRoleOfMag");
                throw;
            }
        }

    }
}
