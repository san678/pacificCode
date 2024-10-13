import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeID, setEmployeeID] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [DOB, setDOB] = useState(''); 
  const [salary, setSalary] = useState('');
  const [salaryError, setSalaryError] = useState('');
  const [departmentCode, setDepartmentCode] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('name');
  const inputRef = useRef(null); 

  const navigate = useNavigate(); 

  useEffect(() => {
    fetchEmployees();
    fetchDepartments(); 
  }, []);

  const fetchEmployees = () => {
    axios.get('https://localhost:7091/api/Employee')
      .then((response) => {
        setEmployees(response.data);
      })
      .catch((error) => {
        console.error('Error fetching employees:', error);
      });
  };

  const fetchDepartments = () => {
    axios.get('https://localhost:7091/api/Department')
      .then((response) => {
        setDepartments(response.data);
      })
      .catch((error) => {
        console.error('Error fetching departments:', error);
      });
  };

  const openModal = (employee = null) => {
    if (employee) {
      setSelectedEmployee(employee);
      setFirstName(employee.firstName);
      setLastName(employee.lastName);
      setEmail(employee.email);

      // Format DOB to YYYY-MM-DD
      if (employee.DOB) {
        const formattedDOB = new Date(employee.DOB).toISOString().split('T')[0];
        setDOB(formattedDOB);
      } else {
        setDOB('');
      }

      setSalary(employee.salary);
      setDepartmentCode(employee.departmentCode);
      setIsEditing(true);
    } else {
      setSelectedEmployee(null);
      setEmployeeID('');
      setFirstName('');
      setLastName('');
      setEmail('');
      setDOB(''); 
      setSalary('');
      setDepartmentCode('');
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
    setFirstName('');
    setLastName('');
    setEmail('');
    setDOB('');
    setSalary('');
    setDepartmentCode('');
    setSalaryError('');
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  
  const handleSave = () => {
    if (!firstName || !lastName || !email ||!salary || !departmentCode) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Please fill all required fields.',
      });
      return;
    }
  
    if (parseFloat(salary) < 0) {
      setSalaryError('Salary cannot be a negative value.');
      return;
    } else {
      setSalaryError(''); // Clear error if valid
    }
    
    if (isEditing) {
      axios.put(`https://localhost:7091/api/Employee/${selectedEmployee.employeeID}`, {
        employeeID: selectedEmployee.employeeID,
        firstName,
        lastName,
        email,
        DOB,
        salary,
        departmentCode
      })
        .then(() => {
          fetchEmployees();
          Swal.fire('Success!', 'Employee updated successfully.', 'success');
        })
        .catch((error) => {
          console.error('Error updating employee:', error);
          Swal.fire('Error!', 'Failed to update employee. Please check the console for details.', 'error');
        });
    } else {
      const newEmployee = {
        employeeID,
        firstName,
        lastName,
        email,
        DOB,
        salary,
        departmentCode
      };
  
      axios.post("https://localhost:7091/api/Employee", newEmployee)
        .then(() => {
          Swal.fire('Success!', 'Employee added successfully.', 'success');
          fetchEmployees();
        })
        .catch((err) => {
          console.error("Error adding employee:", err.response ? err.response.data : err.message);
          Swal.fire('Error!', 'Failed to add employee. Check the console for details.', 'error');
        });
    }
    handleCloseModal();
  };
  

  const handleDelete = (id) => {
    axios.delete(`https://localhost:7091/api/Employee/${id}`)
      .then(() => {
        fetchEmployees();
        Swal.fire('Deleted!', 'Employee has been deleted.', 'success');
      })
      .catch((error) => {
        console.error('Error deleting employee:', error);
        Swal.fire('Error!', 'Failed to delete employee. Please check the console for details.', 'error');
      });
  };

  const filteredEmployees = employees.filter((employee) => {
    if (filterBy === 'name') {
      return employee.firstName.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (filterBy === 'id') {
      return employee.employeeID.toString().includes(searchTerm);
    }
    return false;
  });

  useEffect(() => {
    if (isModalOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isModalOpen]);

  const downloadPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Employee ID", "First Name", "Last Name", "Email", "Salary", "Age", "Department Name"];
    const tableRows = [];

    filteredEmployees.forEach(employee => {
      const employeeData = [
        employee.employeeID,
        employee.firstName,
        employee.lastName,
        employee.email,
        employee.salary,
        calculateAge(employee.dob),
        departments.find(department => department.departmentCode === employee.departmentCode)?.departmentName || 'N/A'
      ];
      tableRows.push(employeeData);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.text("Employee Details", 14, 15);
    doc.save("employees.pdf");
  };
  
  return (
    <div className="container py-8 mx-auto">
      <h1 className="mb-6 text-2xl font-bold text-center">Employees</h1>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Employee Name</h2>
        <div className='flex items-center space-x-2'>
        <button
          onClick={() => openModal()}
          className="px-4 py-2 text-white bg-green-500 rounded-md shadow-md hover:bg-green-600"
        >
          + Add New Employee
        </button>
        <button
            onClick={downloadPDF}
            className="px-4 py-2 text-white bg-blue-500 rounded-md shadow-md hover:bg-blue-600"
          >
            Download PDF
          </button>
          <button
            onClick={()=> navigate('/employeeSummary')}
            className="px-4 py-2 text-white bg-orange-400 rounded-md shadow-md hover:bg-orange-500"
          >
            Summary
          </button>
        </div>      
      </div>

      <div className="flex items-center mb-4 space-x-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={`Search by ${filterBy === 'name' ? 'Name' : 'ID'}...`}
          className="block w-full p-2 border border-gray-300 rounded-md"
        />
        <select
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="name">Name</option>
          <option value="id">ID</option>
        </select>
      </div>

      <div className="max-h-screen overflow-x-auto overflow-y-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md table-auto">
          <thead>
            <tr className="text-left bg-gray-100">
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">First Name</th>
              <th className="px-4 py-2">Last Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Salary</th>
              <th className='px-4 py-2'>Age</th> 
              <th className="px-4 py-2">Department Name</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <tr key={employee.employeeID} className="border-b">
                <td className="px-4 py-2">{employee.employeeID}</td>
                <td className="px-4 py-2">{employee.firstName}</td>
                <td className="px-4 py-2">{employee.lastName}</td>
                <td className="px-4 py-2">{employee.email}</td>
                <td className="px-4 py-2">{employee.salary}</td>
                <td className="px-4 py-2">{calculateAge(employee.dob)}</td> 
                <td className="px-4 py-2">
                  {
                    departments.find(department => department.departmentCode === employee.departmentCode)?.departmentName || 'N/A'
                  }
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => openModal(employee)}
                    className="px-3 py-2 mr-4 text-sm text-white rounded-lg bg-cyan-400 hover:bg-cyan-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(employee.employeeID)}
                    className="px-3 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="w-1/3 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="mb-4 text-xl font-bold">
              {isEditing ? 'Edit Employee' : 'Add New Employee'}
            </h2>
            <div className="mb-4">
              {isEditing && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Employee ID</label>
                  <input
                    type="text"
                    value={selectedEmployee.employeeID}
                    disabled
                    className="block w-full p-2 mt-1 bg-gray-200 border border-gray-300 rounded-md"
                  />
                </div>
              )}

              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                ref={inputRef}
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter first name"
                className="block w-full p-2 mt-1 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter last name"
                className="block w-full p-2 mt-1 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                className="block w-full p-2 mt-1 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input
                type="date"
                value={DOB}
                onChange={(e) => setDOB(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="block w-full p-2 mt-1 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Salary</label>
              <input
                type="number"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="Enter salary"
                className="block w-full p-2 mt-1 border border-gray-300 rounded-md"
                
              />
              {salaryError && <p className="text-red-500">{salaryError}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Department</label>
              <select
                value={departmentCode}
                onChange={(e) => setDepartmentCode(e.target.value)}
                className="block w-full p-2 mt-1 border border-gray-300 rounded-md"
              >
                <option value="">Select Department</option>
                {departments.map(department => (
                  <option key={department.departmentCode} value={department.departmentCode}>
                    {department.departmentName}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeTable;
