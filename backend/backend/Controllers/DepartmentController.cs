using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentController : ControllerBase
    {
        private readonly DepartmentService _departmentService;

        public DepartmentController(DepartmentService departmentService)
        {
            _departmentService = departmentService ?? throw new ArgumentNullException(nameof(departmentService));
        }

        [HttpGet]
        public ActionResult<List<Department>> GetAllDepartments()
        {
            var departments = _departmentService.GetDepartments();
            return Ok(departments);
        }

        [HttpGet("{departmentCode}")]
        public ActionResult<Department> GetDepartmentByCode(int departmentCode)
        {
            var department = _departmentService.GetDepartmentByCode(departmentCode);
            if (department == null)
                return NotFound(new { message = "Department not found." });

            return Ok(department);
        }


        [HttpPost]
        public IActionResult AddDepartment([FromBody] Department department)
        {
            _departmentService.AddDepartment(department);
            return Ok(new { message = "Department added successfully." });
        }

        [HttpPut("{departmentCode}")]
        public IActionResult UpdateDepartment(string departmentCode, [FromBody] Department department)
        {
            department.departmentCode = departmentCode;
            _departmentService.UpdateDepartment(department);
            return Ok(new { message = "Department updated successfully." });
        }

        [HttpDelete("{departmentCode}")]
        public IActionResult DeleteDepartment(string departmentCode)
        {
            _departmentService.DeleteDepartment(departmentCode);
            return Ok(new { message = "Department deleted successfully." });
        }
    }
}
