using Angular5.Models.Domain;
using Angular5.Models.Requests;
using System.Collections.Generic;
using System.Data.SqlClient;

namespace Angular5.Services
{
    public class ProfileService : BaseService, IProfileService
    {
        public List<ProfileDom> Get(string id)
        {
            cmd.CommandText = "Company_Selectbyuserid";
            List<ProfileDom> result = new List<ProfileDom>();
            cmd.Parameters.AddWithValue("@UserId", id);
            conn.Open();
            SqlDataReader reader = cmd.ExecuteReader();
            while (reader.Read())
            {
                ProfileDom model = Mapper(reader);
                result.Add(model);
            }
            conn.Close();
            return result;
        }

        public int Post(ProfileAdd model)
        {
            int id = 0;
            cmd.CommandText = "Company_Insert";
            SqlParameter param = new SqlParameter();
            param.ParameterName = "@Id";
            param.SqlDbType = System.Data.SqlDbType.Int;
            param.Direction = System.Data.ParameterDirection.Output;

            cmd.Parameters.Add(param);
            cmd.Parameters.AddWithValue("@UserId", model.UserId);
            cmd.Parameters.AddWithValue("@CompName", model.CompName);
            cmd.Parameters.AddWithValue("@FName", model.FName);
            cmd.Parameters.AddWithValue("@LName", model.LName);
            cmd.Parameters.AddWithValue("@Street", model.Street);
            cmd.Parameters.AddWithValue("@City", model.City);
            cmd.Parameters.AddWithValue("@State", model.State);
            cmd.Parameters.AddWithValue("@Zip", model.Zip);
            cmd.Parameters.AddWithValue("@Email", model.Email);
            cmd.Parameters.AddWithValue("@Phone", model.Phone);
            cmd.Parameters.AddWithValue("@ModifiedBy", model.ModifiedBy);

            conn.Open();
            cmd.ExecuteNonQuery();
            conn.Close();
            id = (int)cmd.Parameters["@Id"].Value;
              
            return id;
        }

        public void Put(int id, ProfileUpt model)
        {
            cmd.CommandText = "Company_Update";
            cmd.Parameters.AddWithValue("@Id", model.Id);
            cmd.Parameters.AddWithValue("@UserId", model.UserId);
            cmd.Parameters.AddWithValue("@CompName", model.CompName);
            cmd.Parameters.AddWithValue("@FName", model.FName);
            cmd.Parameters.AddWithValue("@LName", model.LName);
            cmd.Parameters.AddWithValue("@Street", model.Street);
            cmd.Parameters.AddWithValue("@City", model.City);
            cmd.Parameters.AddWithValue("@State", model.State);
            cmd.Parameters.AddWithValue("@Zip", model.Zip);
            cmd.Parameters.AddWithValue("@Email", model.Email);
            cmd.Parameters.AddWithValue("@Phone", model.Phone);
            cmd.Parameters.AddWithValue("@ModifiedBy", model.ModifiedBy);
            conn.Open();
            cmd.ExecuteNonQuery();
            conn.Close();
        }

        public void Delete(int id)
        {
            cmd.CommandText = "Company_Delete";
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Id", id);
            conn.Open();
            cmd.ExecuteNonQuery();
            conn.Close();
        }

        private ProfileDom Mapper(SqlDataReader reader)
        {
            ProfileDom model = new ProfileDom();
            int index = 0;
            model.Id = reader.GetInt32(index++);
            model.UserId = reader.GetString(index++);
            model.CompName = reader.GetString(index++);
            model.FName = reader.GetString(index++);
            model.LName = reader.GetString(index++);
            model.Street = reader.GetString(index++);
            model.City = reader.GetString(index++);
            model.State = reader.GetString(index++);
            model.Zip = reader.GetInt32(index++);
            model.Email = reader.GetString(index++);
            model.Phone = reader.GetString(index++);
            model.CreatedDate = reader.GetDateTime(index++);
            model.ModifiedDate = reader.GetDateTime(index++);
            model.ModifiedBy = reader.GetString(index++);
            return model;
        }
    }
}
