using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Angular5.Services
{
    public class BaseService : IDisposable
    {
        public IConfiguration Configuration { get; set; }
        
        protected SqlConnection conn = new SqlConnection();
        protected SqlCommand cmd = new SqlCommand();

        public BaseService()
        {
            var builder = new ConfigurationBuilder();
            builder.AddUserSecrets<BaseService>();
            Configuration = builder.Build();
            
            conn.ConnectionString = Configuration["DefaultConnection"];
            cmd.Connection = conn;
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
        }

        #region IDisposable Support
        private bool disposedValue = false; // To detect redundant calls
        protected virtual void Dispose(bool disposing)

        {
            if (!disposedValue)
            {
                if (disposing)
                {
                    if(conn.State == System.Data.ConnectionState.Open)
                    {
                        conn.Close();
                    }
                    // TODO: dispose managed state (managed objects).
                }
                cmd.Dispose();
                conn.Dispose();

                // TODO: free unmanaged resources (unmanaged objects) and override a finalizer below.
                // TODO: set large fields to null.

                disposedValue = true;
            }
        }

        // TODO: override a finalizer only if Dispose(bool disposing) above has code to free unmanaged resources.
        // ~BaseClass() {
        //   // Do not change this code. Put cleanup code in Dispose(bool disposing) above.
        //   Dispose(false);
        // }

        // This code added to correctly implement the disposable pattern.
        public void Dispose()
        {
            // Do not change this code. Put cleanup code in Dispose(bool disposing) above.
            Dispose(true);
            // TODO: uncomment the following line if the finalizer is overridden above.
            // GC.SuppressFinalize(this);
        }
        #endregion
    }
}
