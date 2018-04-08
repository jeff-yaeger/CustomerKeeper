using SendGrid.Helpers.Mail;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Angular5.Models.Domain
{
    public class EmailDom
    {
        public EmailAddress From { get; set; }
        public EmailAddress To { get; set; }
        public string Subject { get; set; }
        public string PlainTemplate { get; set; }
        public string HtmlTemplate { get; set; }
    }
}
