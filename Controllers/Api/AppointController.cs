using System;
using System.Threading.Tasks;
using Angular5.Models;
using Angular5.Models.Domain;
using Angular5.Models.Requests;
using Angular5.Models.Response;
using Angular5.Services;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace Angular5.Controllers.Api
{
    [Route("api/[controller]")]
    public class AppointController : Controller
    {
        private readonly UserManager<ApplicationUser> _manager;
        public IAppointService _svc;
        public IProfileService _service;

        public AppointController(UserManager<ApplicationUser> manager, IAppointService Svc, IProfileService Service)
        {
            _manager = manager;
            _svc = Svc;
            _service = Service;
        }

        private async Task<ApplicationUser> GetCurrentUser()
        {
            return await _manager.GetUserAsync(HttpContext.User);
        }

        [HttpPost("userinfo")]
        public async Task<IActionResult> GetUserInfo([FromBody]AppointPaging model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                var user = await GetCurrentUser();
                model.UserId = user.Id;
                model.SortCol = "Id";
                UserInfoView userinfo = new UserInfoView();
                userinfo.appointView = _svc.GetSoonestAppoints(model);
                userinfo.profDom = _service.Get(user.Id);
                DataResponse<UserInfoView> info = new DataResponse<UserInfoView>();
                info.Data = userinfo;
                return Ok(info);
            }
            catch (Exception ex)
            {
                return StatusCode(404, ex);
            }
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
                DataListResponse<AppointDom> resp = new DataListResponse<AppointDom>();
                resp.DataList = _svc.Get(user.Id);

                if (resp == null)
                {
                    return NotFound();
                }

                return Ok(resp);
            }
            catch (Exception ex)
            {
                return StatusCode(416, ex);
            }
        }

        [HttpGet("past")]
        public async Task<IActionResult> GetPast()
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var user = await GetCurrentUser();
                DataListResponse<AppointDom> resp = new DataListResponse<AppointDom>();
                resp.DataList = _svc.GetPast(user.Id);

                if (resp == null)
                {
                    return NotFound();
                }

                return Ok(resp);
            }
            catch (Exception ex)
            {
                return StatusCode(416, ex);
            }
        }

        [HttpGet("byid/{id}")]
        public IActionResult GetById(int id)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                DataResponse<AppointDom> resp = new DataResponse<AppointDom>();
                resp.Data = _svc.GetById(id);

                if (resp == null)
                {
                    return NotFound();
                }
                return Ok(resp);
            }
            catch (System.Exception)
            {
                return StatusCode(417, "Bullshit");
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody]AppointAdd model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                var user = await GetCurrentUser();
                model.UserId = user.Id;
                model.ModifiedBy = user.UserName;
                DataResponse<int> resp = new DataResponse<int>();
                resp.Data = await _svc.Post(model);
                return Ok(resp);
            }
            catch (Exception ex)
            {
                return StatusCode(404, ex);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody]AppointUpt model)
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
                model.ModifiedBy = user.UserName;
                _svc.Put(id, model);
            }
            catch (System.Exception ex)
            {
                return StatusCode(420, ex);
            }
            return Ok();
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