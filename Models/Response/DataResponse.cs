using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Angular5.Models.Response
{
    public class DataResponse<T> : SuccessResponse
    {
        public T Data { get; set; }
    }
}
