using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EHL.Common.Models
{
    public class RoleOfMag : Base
    {
        [Required]
        [RegularExpression(@"^[A-Za-z0-9\s,.-]{1,}", ErrorMessage = "Name should only contain letters and spaces.")]
        public string Name { get; set; }
        public string Wing { get; set; }
        public int WingId { get; set; }
        [Required]
        [RegularExpression(@"^[A-Za-z0-9\s,.-]{1,}", ErrorMessage = "Name Of Officer should only contain letters and spaces.")]
        public string NameOfOfficer { get; set; }
        public string Appointment { get; set; }
        public string MilitaryNo { get; set; }
        public string Mobile { get; set; }
        public string CivilNo { get; set; }
        public string EqptDealing { get; set; }
    }

}
