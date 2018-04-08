using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Angular5.Models.Requests
{
    public class AppointAdd
    {
        public string UserId { get; set; }
        public string CustFName { get; set; }
        public string CustLName { get; set; }
        public string Street { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public int Zip { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public DateTime Appoint { get; set; }
        public string ModifiedBy { get; set; }
        public bool IsCnfrmed { get; set; }
        public bool ReminderSent { get; set; }
        public string CompName { get; set; }
        public string CompEmail { get; set; }
    }
}
