using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static EHL.Common.Enum.Enum;

namespace EHL.Common.Models
{
	public class News : Base
	{
		public string Text { get; set; }
		public NewStatus Status { get; set; }
	}

	public class LandingProfile : Base
	{
		public string Title { get; set; }
		public string Description { get; set; }
		public string Profile { get; set; }
	}
	public class LandingCarousel : Base
	{
		public string image { get; set; }
		public List<string> images { get; set; }
	}
}
