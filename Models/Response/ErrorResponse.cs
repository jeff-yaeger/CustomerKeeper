using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Angular5.Models.Response
{
    public class ErrorResponse : BaseResponse
    {
        public ErrorResponse()
        {
            this.IsSuccessful = false;
        }
    }
}
