using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Angular5.Models.AccountViewModels
{
    public class CustomerEditModel
    {
        public int Id { get; set; }
        public string UserId { get; set; }

        [Required]
        [Display(Name = "First Name")]
        public string CustFName { get; set; }

        [Required]
        [Display(Name = "Last Name")]
        public string CustLName { get; set; }

        [Required]
        [Display(Name = "Street")]
        public string Street { get; set; }

        [Required]
        [Display(Name = "City")]
        public string City { get; set; }

        [Required]
        [RegularExpression("^[a-zA-Z ]*$", ErrorMessage = "The state must be letters only")]
        [StringLength(2, ErrorMessage = "The state must be two characters long.", MinimumLength = 2)]
        [Display(Name = "State")]
        public string State { get; set; }

        [Required]
        [RegularExpression(@"(^\d{5}(-\d{4})?$)|(^[ABCEGHJKLMNPRSTVXYabceghjklmnprstvxy]{1}\d{1}[ABCEGHJKLMNPRSTVWXYZabceghjklmnprstv‌​xy]{1} *\d{1}[ABCEGHJKLMNPRSTVWXYZabceghjklmnprstvxy]{1}\d{1}$)", ErrorMessage = "That postal code is not a valid US or Canadian postal code.")]
        [Display(Name = "Zip")]
        public int Zip { get; set; }

        [Required]
        [EmailAddress]
        [Display(Name = "Email")]
        public string Email { get; set; }

        [Required]
        [RegularExpression(@"^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$", ErrorMessage = "Please enter valid phone number")]
        [Display(Name = "Phone Number")]
        public string Phone { get; set; }

        [Required]
        [Display(Name = "Appointment Date")]
        public string AppointDate { get; set; }

        [Required]
        [Display(Name = "Appointment Time")]
        public string AppointTime { get; set; }

        public string ModifiedBy { get; set; }
        public bool IsCnfrmed { get; set; }
        public bool ReminderSent { get; set; }
        public string CompName { get; set; }
        public string CompEmail { get; set; }
    }
}
