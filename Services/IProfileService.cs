using System;
using System.Collections.Generic;
using Angular5.Models.Domain;
using Angular5.Models.Requests;
using Microsoft.Extensions.Configuration;

namespace Angular5.Services
{
    public interface IProfileService : IDisposable
    {
        IConfiguration Configuration { get; }

        void Delete(int id);
        List<ProfileDom> Get(string id);
        int Post(ProfileAdd model);
        void Put(int id, ProfileUpt model);
    }
}