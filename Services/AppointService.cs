using Angular5.Models;
using Angular5.Models.Domain;
using Angular5.Models.Requests;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using SendGrid;
using SendGrid.Helpers.Mail;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace Angular5.Services
{
    public class AppointService : BaseService, IAppointService
    {
        public List<AppointDom> Get(string id)
        {
            cmd.CommandText = "Appointment_Selectbyuserid";
            List<AppointDom> result = new List<AppointDom>();
            cmd.Parameters.AddWithValue("@UserId", id);

            conn.Open();
            SqlDataReader reader = cmd.ExecuteReader();
            while (reader.Read())
            {
                AppointDom model = Mapper(reader);
                result.Add(model);
            }
            conn.Close();
            return result;
        }

        public List<AppointDom> GetPast(string id)
        {
            cmd.CommandText = "Appointment_SelectbyuseridPast";
            List<AppointDom> result = new List<AppointDom>();
            cmd.Parameters.AddWithValue("@UserId", id);

            conn.Open();
            SqlDataReader reader = cmd.ExecuteReader();
            while (reader.Read())
            {
                AppointDom model = Mapper(reader);
                result.Add(model);
            }
            conn.Close();
            return result;
        }

        public AppointView GetSoonestAppoints(AppointPaging model)
        {
            AppointView returnModel = new AppointView();
            returnModel.appointList = new List<AppointDom>();
            cmd.CommandText = "Appointment_Selectbyuserid";

            cmd.Parameters.AddWithValue("@PageSize", model.PageSize);
            cmd.Parameters.AddWithValue("@PageNum", model.PageNum);
            cmd.Parameters.AddWithValue("@SortDir", model.SortDir);
            cmd.Parameters.AddWithValue("@SortCol", model.SortCol);
            cmd.Parameters.AddWithValue("@UserId", model.UserId);
            cmd.Parameters.AddWithValue("@CustFNameFilter", model.CustFNameFilter);
            cmd.Parameters.AddWithValue("@CustLNameFilter", model.CustLNameFilter);
            cmd.Parameters.AddWithValue("@AppointFilter", model.AppointFilter);

            conn.Open();
            SqlDataReader reader = cmd.ExecuteReader();
            short set = new short();
            while (reader.Read())
            {
                switch (set)
                {
                    case 0:
                        AppointDom viewModel = Mapper(reader);
                        returnModel.appointList.Add(viewModel);
                        break;
                    case 1:
                        returnModel.appointTotal = reader.GetInt32(0);
                        break;
                }
            }
            conn.Close();
            return returnModel;
        }

        //Hangfire Method
        public async Task GetAppointments()
        {
            cmd.CommandText = "Appointment_HFSelectAll";
            conn.Open();
            SqlDataReader reader = cmd.ExecuteReader();
            var emails = new List<AppointDom>();

            while (reader.Read())
            {
                emails.Add(new AppointDom
                {
                    Id = Convert.ToInt32(reader["Id"]),
                    CustFName = Convert.ToString(reader["CustFName"]),
                    CustLName = Convert.ToString(reader["CustLName"]),
                    Email = Convert.ToString(reader["Email"]),
                    Appoint = Convert.ToDateTime(reader["Appoint"]),
                    IsCnfrmed = Convert.ToBoolean(reader["IsCnfrmed"]),
                    ReminderSent = Convert.ToBoolean(reader["ReminderSent"]),
                    CompName = Convert.ToString(reader["CompName"]),
                    CompEmail = Convert.ToString(reader["CompEmail"])
                });

            }
            conn.Close();

            //notify the database that a reminder email has been sent
            foreach (AppointDom email in emails)
            {
                UpdateReminder(email);
            }

            //Send appointment reminder to customers
            foreach (AppointDom email in emails)
            {
                //create link and convert appointment 
                string link = "http://localhost:51285/Account/CfrmAppoint/" + email.Id;
                string appoint = email.Appoint.ToString("hh:mm tt MM/dd/yyyy");

                //build email model
                EmailDom sendModel = new EmailDom();
                sendModel.To = new EmailAddress(email.Email);
                sendModel.From = new EmailAddress(email.CompEmail);
                sendModel.Subject = "Reminder for your upcoming appointment with " + email.CompName;

                //build template
                sendModel.HtmlTemplate = System.IO.File.ReadAllText("Models/EmailModels/ReminderEmail.txt");
                sendModel.HtmlTemplate = sendModel.HtmlTemplate.Replace("{CompName}", email.CompName);
                sendModel.HtmlTemplate = sendModel.HtmlTemplate.Replace("{Appoint}", appoint);
                if (email.IsCnfrmed == false) { sendModel.HtmlTemplate = sendModel.HtmlTemplate.Replace("<a class='hidden'></a>",
                    "<tr><td class='content-block'><p>Your Appointment is still unconfirmed</p><a href='" + link + "' class='btn-primary'>Confirm Now</a><td><tr>"); }
                sendModel.PlainTemplate = System.IO.File.ReadAllText("Models/EmailModels/ReminderEmailPlain.txt");
                sendModel.HtmlTemplate = sendModel.HtmlTemplate.Replace("{CompName}", email.CompName);
                sendModel.HtmlTemplate = sendModel.HtmlTemplate.Replace("{Appoint}", appoint);

                //send email
                await SendEmail(sendModel);
            }

            //reminder for business owner
            foreach (AppointDom email in emails)
            {
                string link = "http://localhost:51285/Account/CfrmAppoint/" + email.Id;
                string appoint = email.Appoint.ToString("hh:mm tt MM/dd/yyyy");
                EmailDom sendModel = new EmailDom();
                sendModel.To = new EmailAddress(email.CompEmail);
                sendModel.From = new EmailAddress("App@App.com");
                sendModel.Subject = "Reminder for your upcoming appointment with " + email.CustFName+" "+email.CustLName;

                sendModel.HtmlTemplate = System.IO.File.ReadAllText("Models/EmailModels/ReminderEmail.txt");
                sendModel.HtmlTemplate = sendModel.HtmlTemplate.Replace("{CompName}", email.CustFName);
                sendModel.HtmlTemplate = sendModel.HtmlTemplate.Replace("{Appoint}", appoint);
                sendModel.PlainTemplate = System.IO.File.ReadAllText("Models/EmailModels/ReminderEmailPlain.txt");
                sendModel.HtmlTemplate = sendModel.HtmlTemplate.Replace("{CompName}", email.CustFName);
                sendModel.HtmlTemplate = sendModel.HtmlTemplate.Replace("{Appoint}", appoint);

                await SendEmail(sendModel);
            }
        }

        public void UpdateReminder(AppointDom model)
        {
            cmd.CommandText = "Appointment_UpdateReminderSent";
            cmd.Parameters.AddWithValue("@Id", model.Id);
            cmd.Parameters.AddWithValue("@ReminderSent", model.ReminderSent = true);

            conn.Open();
            cmd.ExecuteNonQuery();
            conn.Close();
        }

        public AppointDom GetById(int id)
        {
            AppointDom model = null;
            cmd.CommandText = "Appointment_Selectbyid";
            cmd.Parameters.AddWithValue("@Id", id);

            conn.Open();
            SqlDataReader reader = cmd.ExecuteReader();
            while (reader.Read())
            {
                model = Mapper(reader);
            }
            conn.Close();
            return model;
        }

        public async Task<int> Post(AppointAdd model)
        {
            cmd.CommandText = "Appointment_Insert";
            SqlParameter param = new SqlParameter();
            param.ParameterName = "@Id";
            param.SqlDbType = System.Data.SqlDbType.Int;
            param.Direction = System.Data.ParameterDirection.Output;

            cmd.Parameters.Add(param);
            cmd.Parameters.AddWithValue("@UserId", model.UserId);
            cmd.Parameters.AddWithValue("@CustFName", model.CustFName);
            cmd.Parameters.AddWithValue("@CustLName", model.CustLName);
            cmd.Parameters.AddWithValue("@Street", model.Street);
            cmd.Parameters.AddWithValue("@City", model.City);
            cmd.Parameters.AddWithValue("@State", model.State);
            cmd.Parameters.AddWithValue("@Zip", model.Zip);
            cmd.Parameters.AddWithValue("@Email", model.Email);
            cmd.Parameters.AddWithValue("@Phone", model.Phone);
            cmd.Parameters.AddWithValue("@Appoint", model.Appoint);
            cmd.Parameters.AddWithValue("@ModifiedBy", model.ModifiedBy);
            cmd.Parameters.AddWithValue("@IsCnfrmed", model.IsCnfrmed = false);
            cmd.Parameters.AddWithValue("@ReminderSent", model.ReminderSent = false);
            cmd.Parameters.AddWithValue("@CompName", model.CompName);
            cmd.Parameters.AddWithValue("@CompEmail", model.CompEmail);

            conn.Open();
            cmd.ExecuteNonQuery();
            conn.Close();
            int id = (int)cmd.Parameters["@Id"].Value;
            
            await SendEmail(model, id);
            return id;
        }

        public async Task SendEmail(AppointAdd model, int id)
        {
            string EmailToken = Guid.NewGuid().ToString();

            //Create the send model and assign the data
            EmailDom sendModel = new EmailDom();
            sendModel.To = new EmailAddress(model.Email, model.CustFName + " " + model.CustLName);
            sendModel.From = new EmailAddress(model.CompEmail, model.CompName);

            //assign links and change formats of zip and appoinment date and time to appear correctly in the email
            string link = "http://localhost:51285/Account/CfrmAppoint/" + id;
            string editlink = "http://localhost:51285/Account/CustomerEdit/" + id;
            string zip = (model.Zip).ToString();
            string appoint = model.Appoint.ToString("MM/dd/yyyy hh:mm tt");

            sendModel.Subject = "Your Appointment with " + model.CompName;

            //build email and input correct information
            sendModel.HtmlTemplate = System.IO.File.ReadAllText("Models/EmailModels/ConfirmTemp.txt");
            sendModel.HtmlTemplate = sendModel.HtmlTemplate.Replace("{appoint}", appoint);
            sendModel.HtmlTemplate = sendModel.HtmlTemplate.Replace("{firName}", model.CustFName);
            sendModel.HtmlTemplate = sendModel.HtmlTemplate.Replace("{lasName}", model.CustLName);
            sendModel.HtmlTemplate = sendModel.HtmlTemplate.Replace("{street}", model.Street);
            sendModel.HtmlTemplate = sendModel.HtmlTemplate.Replace("{city}", model.City);
            sendModel.HtmlTemplate = sendModel.HtmlTemplate.Replace("{state}", model.State);
            sendModel.HtmlTemplate = sendModel.HtmlTemplate.Replace("{zip}", zip);
            sendModel.HtmlTemplate = sendModel.HtmlTemplate.Replace("{email}", model.Email);
            sendModel.HtmlTemplate = sendModel.HtmlTemplate.Replace("{phone}", model.Phone);
            sendModel.HtmlTemplate = sendModel.HtmlTemplate.Replace("{{ConfirmUrl}}", link);
            sendModel.HtmlTemplate = sendModel.HtmlTemplate.Replace("{{EditUrl}}", editlink);

            //plain email for emails that cannot accept the HtmlTemplate
            sendModel.PlainTemplate = System.IO.File.ReadAllText("Models/EmailModels/ConfirmTempPlain.txt");
            sendModel.PlainTemplate = sendModel.PlainTemplate.Replace("{appoint}", appoint);
            sendModel.PlainTemplate = sendModel.PlainTemplate.Replace("{firName}", model.CustFName);
            sendModel.PlainTemplate = sendModel.PlainTemplate.Replace("{lasName}", model.CustLName);
            sendModel.PlainTemplate = sendModel.PlainTemplate.Replace("{street}", model.Street);
            sendModel.PlainTemplate = sendModel.PlainTemplate.Replace("{city}", model.City);
            sendModel.PlainTemplate = sendModel.PlainTemplate.Replace("{state}", model.State);
            sendModel.PlainTemplate = sendModel.PlainTemplate.Replace("{zip}", zip);
            sendModel.PlainTemplate = sendModel.PlainTemplate.Replace("{email}", model.Email);
            sendModel.PlainTemplate = sendModel.PlainTemplate.Replace("{phone}", model.Phone);
            sendModel.PlainTemplate = sendModel.PlainTemplate.Replace("{{ConfirmUrl}}", link);
            sendModel.PlainTemplate = sendModel.PlainTemplate.Replace("{{EditUrl}}", editlink);

            //Send the email
            await SendEmail(sendModel);
        }

        public async Task SendEmail(EmailDom emailModel)
        {
            string apiKey = Configuration["APIKEY"];
            SendGridClient client = new SendGridClient(apiKey);
            SendGridMessage msg = MailHelper.CreateSingleEmail(emailModel.From, emailModel.To, emailModel.Subject, emailModel.PlainTemplate, emailModel.HtmlTemplate);
            await client.SendEmailAsync(msg);
        }

        public int Put(int id, AppointUpt model)
        {
            cmd.CommandText = "Appointment_Update";
            cmd.Parameters.AddWithValue("@Id", model.Id);
            cmd.Parameters.AddWithValue("@UserId", model.UserId);
            cmd.Parameters.AddWithValue("@CustFName", model.CustFName);
            cmd.Parameters.AddWithValue("@CustLName", model.CustLName);
            cmd.Parameters.AddWithValue("@Street", model.Street);
            cmd.Parameters.AddWithValue("@City", model.City);
            cmd.Parameters.AddWithValue("@State", model.State);
            cmd.Parameters.AddWithValue("@Zip", model.Zip);
            cmd.Parameters.AddWithValue("@Email", model.Email);
            cmd.Parameters.AddWithValue("@Phone", model.Phone);
            cmd.Parameters.AddWithValue("@Appoint", model.Appoint);
            cmd.Parameters.AddWithValue("@ModifiedBy", model.ModifiedBy);
            cmd.Parameters.AddWithValue("@IsCnfrmed", model.IsCnfrmed);
            cmd.Parameters.AddWithValue("@ReminderSent", model.ReminderSent);
            cmd.Parameters.AddWithValue("@CompName", model.CompName);
            cmd.Parameters.AddWithValue("@CompEmail", model.CompEmail);

            conn.Open();
            cmd.ExecuteNonQuery();
            conn.Close();
            return 0;
        }

        public void UpdateConfrimation(int id, AppCustCnfrm model)
        {
            cmd.CommandText = "Appointment_UpdateIsCnfmd";
            cmd.Parameters.AddWithValue("@Id", model.Id);
            cmd.Parameters.AddWithValue("@IsCnfrmed", model.IsCnfrmed);
            conn.Open();
            cmd.ExecuteNonQuery();
            conn.Close();
        }

        public void Delete(int id)
        {
            cmd.CommandText = "Appointment_Delete";
            cmd.Parameters.AddWithValue("@Id", id);
            conn.Open();
            cmd.ExecuteNonQuery();
            conn.Close();
        }

        private AppointDom Mapper(SqlDataReader reader)
        {
            AppointDom model = new AppointDom();
            int index = 0;
            model.Id = reader.GetInt32(index++);
            model.UserId = reader.GetString(index++);
            model.CustFName = reader.GetString(index++);
            model.CustLName = reader.GetString(index++);
            model.Street = reader.GetString(index++);
            model.City = reader.GetString(index++);
            model.State = reader.GetString(index++);
            model.Zip = reader.GetInt32(index++);
            model.Email = reader.GetString(index++);
            model.Phone = reader.GetString(index++);
            model.Appoint = reader.GetDateTime(index++);
            model.CreatedDate = reader.GetDateTime(index++);
            model.ModifiedDate = reader.GetDateTime(index++);
            model.ModifiedBy = reader.GetString(index++);
            model.IsCnfrmed = reader.GetBoolean(index++);
            model.ReminderSent = reader.GetBoolean(index++);
            model.CompName = reader.GetString(index++);
            model.CompEmail = reader.GetString(index++);
            return model;
        }
       
    }
}
