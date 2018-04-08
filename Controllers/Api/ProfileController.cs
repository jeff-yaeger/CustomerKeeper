using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Angular5.Models;
using Angular5.Models.Domain;
using Angular5.Models.Requests;
using Angular5.Models.Response;
using Angular5.Services;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Angular5.Controllers.Api
{
    [Route("api/[controller]")]
    public class ProfileController : Controller
    {
        private readonly UserManager<ApplicationUser> _manager;
        public IProfileService _svc;

        public ProfileController(UserManager<ApplicationUser> manager, IProfileService Service)
        {
            _manager = manager;
            _svc = Service;
        }

        private async Task<ApplicationUser> GetCurrentUser()
        {
            return await _manager.GetUserAsync(HttpContext.User);
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var user = await GetCurrentUser();
                DataListResponse<ProfileDom> resp = new DataListResponse<ProfileDom>();
                resp.DataList = _svc.Get(user.Id);
                if (resp == null)
                {
                    return NotFound();
                }

                return Ok(resp);
            }
            catch (System.Exception ex)
            {
                return StatusCode(416, ex);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody]ProfileAdd model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                
                var user = await GetCurrentUser();
                model.UserId = user.Id;
                DataResponse<int> resp = new DataResponse<int>();
                resp.Data = _svc.Post(model);
                return Ok(resp);
            }
            catch (Exception ex)
            {
                return StatusCode(404, ex);
            }

        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody]ProfileUpt model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (id != model.Id)
            {
                return BadRequest();
            }

            try
            {
                var user = await GetCurrentUser();
                model.UserId = user.Id;
                _svc.Put(id, model);
            }
            catch (System.Exception ex)
            {
                return StatusCode(420, ex);
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                _svc.Delete(id);
            }
            catch (System.Exception ex)
            {
                return StatusCode(419, ex);
            }
            return NoContent();
        }
    }
}
