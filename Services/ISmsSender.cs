using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Angular5.Services
{
    public interface ISmsSender
    {
        Task SendSmsAsync(string number, string message);
    }
}
