using Angular5.Models.Domain;
using SendGrid;
using SendGrid.Helpers.Mail;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Angular5.Services
{
    // This class is used by the application to send email for account confirmation and password reset.
    // For more details see https://go.microsoft.com/fwlink/?LinkID=532713
    public class EmailSender : IEmailSender
    {
        public Task SendEmailAsync(string email, string subject, string callbackUrl, string apiKey)
        {
            EmailDom sendModel = new EmailDom();
            sendModel.To = new EmailAddress(email);
            sendModel.From = new EmailAddress("Jeff@FinalFinish.com", "me");
            sendModel.Subject = "Reset your password";

            sendModel.HtmlTemplate = System.IO.File.ReadAllText("Models/EmailModels/ForgotPass.txt");
            sendModel.HtmlTemplate = sendModel.HtmlTemplate.Replace("{{ConfirmUrl}}", callbackUrl);
            sendModel.PlainTemplate = System.IO.File.ReadAllText("Models/EmailModels/ResetPassPlain.txt");
            sendModel.PlainTemplate = sendModel.HtmlTemplate.Replace("{{ConfirmUrl}}", callbackUrl);

            SendGridClient client = new SendGridClient(apiKey);
            SendGridMessage msg = MailHelper.CreateSingleEmail(sendModel.From, sendModel.To, sendModel.Subject, sendModel.PlainTemplate, sendModel.HtmlTemplate);
            return client.SendEmailAsync(msg);
        }
    }
}
