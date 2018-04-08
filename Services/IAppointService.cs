using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Angular5.Models.Domain;
using Angular5.Models.Requests;

namespace Angular5.Services
{
    public interface IAppointService : IDisposable
    {
        void Delete(int id);
        List<AppointDom> Get(string id);
        List<AppointDom> GetPast(string id);
        Task GetAppointments();
        AppointView GetSoonestAppoints(AppointPaging model);
        AppointDom GetById(int id);
        Task<int> Post(AppointAdd model);
        int Put(int id, AppointUpt model);
        Task SendEmail(AppointAdd model, int id);
        Task SendEmail(EmailDom emailModel);
        void UpdateConfrimation(int id, AppCustCnfrm model);
        void UpdateReminder(AppointDom model);
    }
}