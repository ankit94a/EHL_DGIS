using EHL.DB.Implements;
using EHL.DB.Infrastructure;
using EHL.DB.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EHL.DB.IOC
{
	public static class Module
	{
		public static Dictionary<Type, Type> GetTypes()
		{
			var dic = new Dictionary<Type, Type>
			{
				{typeof(IUserDB), typeof(UserDB) },
				{typeof(ILandingPageDB), typeof(LandingPageDB) },
				{typeof(IAttributeDB), typeof(AttributeDB) },
				{typeof(IEmerDB), typeof(EmerDB) },
				{typeof(IPolicyDB), typeof(PolicyDB) },
				{typeof(IFileDB), typeof(FileDB) },
				{typeof(ItechnicalAoAiDB), typeof(TechnicalAoAiDB) },
				{typeof(IRoleOfMagDb), typeof(RoleOfMagDb) }

			};
			return dic;
		}
	}
}
