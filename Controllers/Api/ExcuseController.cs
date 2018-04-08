using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Angular5.Models;
using Angular5.Models.Requests;
using Angular5.Models.Response;
using HtmlAgilityPack;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Angular5.Controllers.Api
{
    [Route("api/[controller]")]
    public class ExcuseController : Controller
    {
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                //load page
                string url = "http://www.getodd.com/raz/sickday/sickday.html";
                var webGet = new HtmlWeb();
                HtmlDocument doc = webGet.Load(url);
                //get node for excuse
                string res1 = doc.DocumentNode.SelectSingleNode("//body/script").InnerHtml;
                string[] res2 = res1.Split('"');
                //get random number for array of excuses
                Random rnd = new Random();
                int odd = (2 * rnd.Next(32))-1;
                //get random excuse string
                string res3 = res2[odd];
                //get second url
                string url2 = "https://www.bing.com/images/search?q=sorry%20meme%20puppy&qs=HS&form=QBIR&sp=1&pq=sorry%20meme%20pup&sc=2-14&sk=&cvid=2C337324864543DAA5485038589F0D4A";
                var webGet2 = new HtmlWeb();
                HtmlDocument doc2 = webGet2.Load(url2);
                //select node and get random number
                var resu1 = doc2.DocumentNode.SelectNodes("//a[@class='iusc']").ToArray();
                Random rnd2 = new Random();
                int numb = rnd2.Next(10);
                var resu2 = resu1[numb];
                //get the html needed and split until I have the url I need
                var resu3 = resu2.OuterHtml;
                string[] resu4 = resu3.Split("murl");
                string[] resu5 = resu4[1].Split("turl");
                string[] resu6 = resu5[0].Split(";");
                string[] resu7 = resu6[2].Split("&");
                string resu8 = resu7[0];
                //build objects and return
                ExcuseList excuse = new ExcuseList();
                excuse.Excuse = res3;
                excuse.Image = resu8;

                return Ok(excuse);
            }
            catch (Exception ex)
            {
                return StatusCode(416, ex);
            }
        }
    }   
}
