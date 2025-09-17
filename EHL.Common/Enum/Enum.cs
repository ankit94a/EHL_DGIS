using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace EHL.Common.Enum
{
	public class Enum
	{
		[JsonConverter(typeof(StringEnumConverter))]
		public enum NewStatus
		{
			New = 1,
			Old
		}
		[JsonConverter(typeof(StringEnumConverter))]
		public enum DocType
		{
			Pdf = 1,
			doc,
			xlms
		}
		[JsonConverter(typeof(StringEnumConverter))]
		public enum PermissionItem
		{
			AdminDashboard = 1,
			Emer,
			Policy,
			Query,
			Attribute
		}
		[JsonConverter(typeof(StringEnumConverter))]
		public enum PermissionAction
		{
			Read = 1,
			Create,
			Update,
			ReadAll,
			Delete
		}
		[JsonConverter(typeof(StringEnumConverter))]
		public enum RoleType
		{
			Admin = 1,
			Officer,
			User 
		}
		[JsonConverter(typeof(StringEnumConverter))]
		public enum DownloadFileType
		{
			Emer = 1,
			Policy,
			Index,
			TechnicalAoAI,
			DroneInduction
		}
	}
}
