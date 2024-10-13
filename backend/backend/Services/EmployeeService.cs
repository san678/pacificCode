using backend.Models;
using Microsoft.Data.SqlClient;

namespace backend.Services
{
    public class EmployeeService
    {
        private readonly string _connectionString;

        public EmployeeService(string connectionString)
        {
            _connectionString = connectionString;
        }
        public void AddEmployee(Employee employee)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    SqlCommand getNextID = new SqlCommand("SELECT ISNULL(MAX(CAST(employeeID AS INT)), 0) FROM Employee", connection);
                    connection.Open();

                    int maxEmployeeID = (int)getNextID.ExecuteScalar();

                    int newEmployeeID = maxEmployeeID + 1;

                    string formattedEmployeeID = newEmployeeID.ToString("D4");

                    string query = "INSERT INTO Employee (employeeID, firstName, lastName, email, DOB, salary, departmentCode) VALUES (@employeeID, @firstName, @lastName, @email, @DOB, @salary, @departmentCode)";
                    SqlCommand command = new SqlCommand(query, connection);
                    command.Parameters.AddWithValue("@employeeID", formattedEmployeeID);
                    command.Parameters.AddWithValue("@firstName", employee.firstName);
                    command.Parameters.AddWithValue("@lastName", employee.lastName);
                    command.Parameters.AddWithValue("@email", employee.email);
                    command.Parameters.AddWithValue("@DOB", employee.DOB);
                    command.Parameters.AddWithValue("@salary", employee.salary);
                    command.Parameters.AddWithValue("@departmentCode", employee.departmentCode);

                    command.ExecuteNonQuery();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error adding employee: {ex.Message}");
                throw;
            }
        }
        public List<Employee> GetEmployees()
        {
            var employees = new List<Employee>();
            try
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    connection.Open();

                    string query = "SELECT * FROM Employee;";
                    SqlCommand command = new SqlCommand(query, connection);

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            employees.Add(new Employee
                            {
                                employeeID = reader["employeeID"].ToString(),
                                firstName = reader["firstName"].ToString(),
                                lastName = reader["lastName"].ToString(),
                                email = reader["email"].ToString(),
                                DOB = DateTime.Parse(reader["DOB"].ToString()).ToString("yyyy-MM-dd"),
                                salary = (decimal)reader["salary"],
                                departmentCode = reader["departmentCode"].ToString()
                            });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting employees: {ex.Message}");
                throw;
            }
            return employees;
        }

        public Employee GetEmployeeByID(string employeeID)
        {
            Employee employee = null;
            try
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    string query = "SELECT * FROM Employee WHERE employeeID = @employeeID";
                    SqlCommand command = new SqlCommand(query, connection);
                    command.Parameters.AddWithValue("@employeeID", employeeID);

                    connection.Open();
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            employee = new Employee
                            {
                                employeeID = reader["employeeID"].ToString(),
                                firstName = reader["firstName"].ToString(),
                                lastName = reader["lastName"].ToString(),
                                email = reader["email"].ToString(),
                                DOB = DateTime.Parse(reader["DOB"].ToString()).ToString("yyyy-MM-dd"),
                                salary = (decimal)reader["salary"],
                                departmentCode = reader["departmentCode"].ToString()
                            };
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting employee by code: {ex.Message}");
                throw;
            }
            return employee;
        }
     
        public void UpdateEmployee(Employee employee)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    string query = "UPDATE Employee SET firstName = @firstName, lastName = @lastName, email = @email, DOB = @DOB, salary = @salary, departmentCode = @departmentCode WHERE employeeID = @employeeID";
                    SqlCommand command = new SqlCommand(query, connection);
                    command.Parameters.AddWithValue("@employeeID", employee.employeeID);
                    command.Parameters.AddWithValue("@firstName", employee.firstName);
                    command.Parameters.AddWithValue("@lastName", employee.lastName);
                    command.Parameters.AddWithValue("@email", employee.email);
                    command.Parameters.AddWithValue("@DOB", employee.DOB);
                    command.Parameters.AddWithValue("@salary", employee.salary);
                    command.Parameters.AddWithValue("@departmentCode", employee.departmentCode);

                    connection.Open();
                    command.ExecuteNonQuery();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating employee: {ex.Message}");
                throw;
            }
        }
       
        public void DeleteEmployee(string employeeID)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    string query = "DELETE FROM Employee WHERE employeeID = @employeeID";
                    SqlCommand command = new SqlCommand(query, connection);
                    command.Parameters.AddWithValue("@employeeID", employeeID);

                    connection.Open();
                    command.ExecuteNonQuery();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting employee: {ex.Message}");
                throw;
            }
        }
    }
}
