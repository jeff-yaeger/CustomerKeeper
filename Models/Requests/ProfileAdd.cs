using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Angular5.Models.Requests
{
    public class ProfileAdd
    {
        public string UserId { get; set; }
        public string CompName { get; set; }
        public string FName { get; set; }
        public string LName { get; set; }
        public string Street { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public int Zip { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string ModifiedBy { get; set; }
    }
}
