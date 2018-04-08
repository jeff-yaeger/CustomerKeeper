using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Angular5.Models;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Angular5.Models.AccountViewModels;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Hosting;
using Angular5.Services;
using Angular5.Models.Requests;
using System;
using Angular5.Models.Domain;

namespace Angular5.Controllers
{
    public class HomeController : Controller
    {
        private readonly UserManager<ApplicationUser> _manager;

        public HomeController(UserManager<ApplicationUser> manager)
        {
            _manager = manager;
        }

        private async Task<ApplicationUser> GetCurrentUser()
        {
            return await _manager.GetUserAsync(HttpContext.User);
        }

        public async Task<IActionResult> Index()
        {
            var user = await GetCurrentUser();
            if(user == null)
            {
                return RedirectToAction("Login", "Account");
            }
            return RedirectToAction("Contact", "Home");
            //return View();
        }

        public IActionResult About()
        {
            return View();
        }

        public IActionResult Contact()
        {
            return View();
        }

        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
