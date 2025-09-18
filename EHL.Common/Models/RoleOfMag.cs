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

        [RegularExpression(@"^[A-Za-z0-9\s,.-]{1,}", ErrorMessage = "Wing should only contain letters and spaces.")]
        public string Wing { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Wing Id must be a positive number.")]
        public int WingId { get; set; }
        [Required]
        [RegularExpression(@"^[A-Za-z0-9\s,.-]{1,}", ErrorMessage = "Name Of Officer should only contain letters and spaces.")]
        public string NameOfOfficer { get; set; }

        [RegularExpression(@"^[A-Za-z0-9\s,.-]{1,}", ErrorMessage = "Name Of Officer should only contain letters and spaces.")]
        public string Appointment { get; set; }

        [Required]
        [RegularExpression(@"^[0-9]{12}$", ErrorMessage = "Military No must be exactly 12 digits.")]
        public string MilitaryNo { get; set; }

        [Required]
        [RegularExpression(@"^[0-9]{10}$", ErrorMessage = "Mobile No must be exactly 10 digits.")]
        public string Mobile { get; set; }

        [Required]
        [RegularExpression(@"^[0-9]{12}$", ErrorMessage = "Civil No must be exactly 12 digits.")]
        public string CivilNo { get; set; }

        [Required]
        [RegularExpression(@"^[A-Za-z0-9\s,.-]{1,}", ErrorMessage = "EqptDealing should only contain letters and spaces.")]
        public string EqptDealing { get; set; }
    }

}
