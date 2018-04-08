using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using Angular5.Models.Domain;
using Angular5.Services;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace Angular5.Services
{
    public static class EmailSenderExtensions
    {
        public static Task SendEmailConfirmationAsync(this IEmailSender emailSender, string email, string link, string apiKey)
        {
            EmailDom sendModel = new EmailDom();
            sendModel.To = new EmailAddress(email);
            sendModel.From = new EmailAddress("Jeff@FinalFinish.com", "me");
            sendModel.Subject = "Welcome to App!";
            string cfrmLink = HtmlEncoder.Default.Encode(link);

            sendModel.HtmlTemplate = System.IO.File.ReadAllText("Models/EmailModels/ConfirmEmail.txt");
            sendModel.HtmlTemplate = sendModel.HtmlTemplate.Replace("{{ConfirmUrl}}", cfrmLink);
            sendModel.PlainTemplate = System.IO.File.ReadAllText("Models/EmailModels/ConfirmEmailPlain.txt");
            sendModel.PlainTemplate = sendModel.HtmlTemplate.Replace("{{ConfirmUrl}}", cfrmLink);

            SendGridClient client = new SendGridClient(apiKey);
            SendGridMessage msg = MailHelper.CreateSingleEmail(sendModel.From, sendModel.To, sendModel.Subject, sendModel.PlainTemplate, sendModel.HtmlTemplate);
            return client.SendEmailAsync(msg);
        }
    }
}
