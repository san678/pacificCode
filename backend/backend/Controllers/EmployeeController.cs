using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly EmployeeService _employeeService;

        public EmployeeController(EmployeeService employeeService)
        {
            _employeeService = employeeService;
        }

        [HttpGet]
        public ActionResult<List<Employee>> GetAllEmployees()
        {
            var employees = _employeeService.GetEmployees();
            return Ok(employees);
        }

        [HttpGet("{employeeID}")]
        public ActionResult<Employee> GetEmployeeByID(string employeeID)
        {
            var employee = _employeeService.GetEmployeeByID(employeeID);
            if (employee == null)
                return NotFound(new { message = "Employee not found." });

            return Ok(employee);
        }

        [HttpPost]
        public IActionResult AddEmployee([FromBody] Employee employee)
        {
            _employeeService.AddEmployee(employee);
            return Ok(new { message = "Employee added successfully." });
        }

        [HttpPut("{employeeID}")]
        public IActionResult UpdateEmployee(string employeeID, [FromBody] Employee employee)
        {
            employee.employeeID = employeeID;
            _employeeService.UpdateEmployee(employee);
            return Ok(new { message = "Employee updated successfully." });
        }

        [HttpDelete("{employeeID}")]
        public IActionResult DeleteEmployee(string employeeID)
        {
            _employeeService.DeleteEmployee(employeeID);
            return Ok(new { message = "Employee deleted successfully." });
        }
    }
}
