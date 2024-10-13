using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Department
    {
        [Key]
        public string departmentCode { get; set; }
        public string departmentName { get; set;}
    }
}
