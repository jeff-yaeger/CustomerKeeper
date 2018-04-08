using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Angular5.Models.Response
{
    public class DataListResponse<T> : SuccessResponse
    {
        public List<T> DataList { get; set; }
    }
}
