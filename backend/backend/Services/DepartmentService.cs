using backend.Models;
using Microsoft.Data.SqlClient;
using System.Globalization;

namespace backend.Services
{
    public class DepartmentService
    {
        private readonly string _connectionString;

        public DepartmentService(string connectionString)
        {
            _connectionString = connectionString ?? throw new ArgumentNullException(nameof(connectionString));
        }

        public void AddDepartment(Department department)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    SqlCommand getNextID = new SqlCommand("SELECT ISNULL(MAX(CAST(departmentCode AS INT)), 0) FROM Department", connection);
                    connection.Open();

                    int maxDepartmentCode = (int)getNextID.ExecuteScalar();

                    int newDepartmentCode = maxDepartmentCode + 1;

                    string formattedDepartmentCode = newDepartmentCode.ToString("D3");

                    string query = "INSERT INTO Department (departmentCode, departmentName) VALUES (@departmentCode, @departmentName)";
                    SqlCommand command = new SqlCommand(query, connection);
                    command.Parameters.AddWithValue("@departmentCode", formattedDepartmentCode);
                    command.Parameters.AddWithValue("@departmentName", department.departmentName);

                    command.ExecuteNonQuery();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error adding department: {ex.Message}");
                throw;
            }
        }

        public List<Department> GetDepartments()
        {
            var departments = new List<Department>();
            try
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    connection.Open();

                    string query = "SELECT * FROM Department;";
                    SqlCommand command = new SqlCommand(query, connection);

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            departments.Add(new Department
                            {
                                departmentCode = reader["departmentCode"].ToString(),
                                departmentName = reader["departmentName"].ToString()
                            });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting departments: {ex.Message}");
                throw;
            }
            return departments;
        }

    public Department GetDepartmentByCode(int departmentCode)
        {
            Department department = null;
            try
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    string query = "SELECT * FROM Department WHERE departmentCode = @departmentCode";
                    SqlCommand command = new SqlCommand(query, connection);
                    command.Parameters.AddWithValue("@departmentCode", departmentCode);

                    connection.Open();
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            department = new Department
                            {
                                departmentCode = reader["departmentCode"].ToString(),
                                departmentName = reader["departmentName"].ToString()
                            };
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting department by code: {ex.Message}");
                throw;
            }
            return department;
        }

        public void UpdateDepartment(Department department)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    string query = "UPDATE Department SET departmentName = @departmentName WHERE departmentCode = @departmentCode";
                    SqlCommand command = new SqlCommand(query, connection);
                    command.Parameters.AddWithValue("@departmentCode", department.departmentCode);
                    command.Parameters.AddWithValue("@departmentName", department.departmentName);

                    connection.Open();
                    command.ExecuteNonQuery();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating department: {ex.Message}");
                throw;
            }
        }

        public void DeleteDepartment(string departmentCode)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    string query = "DELETE FROM Department WHERE departmentCode = @departmentCode";
                    SqlCommand command = new SqlCommand(query, connection);
                    command.Parameters.AddWithValue("@departmentCode", departmentCode);

                    connection.Open();
                    command.ExecuteNonQuery();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting department: {ex.Message}");
                throw;
            }
        }
    }
}
