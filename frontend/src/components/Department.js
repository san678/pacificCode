import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Swal from 'sweetalert2';

const DepartmentTable = () => {
  const [departments, setDepartments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [departmentName, setDepartmentName] = useState('');
  const [departmentCode, setDepartmentCode] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('name');
  const [errorMessage, setErrorMessage] = useState(''); 
  const inputRef = useRef(null); 

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = () => {
    axios.get('https://localhost:7091/api/Department')
      .then((response) => {
        setDepartments(response.data);
      })
      .catch((error) => {
        console.error('Error fetching departments:', error);
      });
  };

  const openModal = (department = null) => {
    if (department) {
      setSelectedDepartment(department);
      setDepartmentName(department.departmentName); 
      setIsEditing(true);
    } else {
      setSelectedDepartment(null);
      setDepartmentName('');
      setIsEditing(false);
      setErrorMessage('');
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDepartment(null);
    setDepartmentName('');
    setErrorMessage(''); 
  };

  const handleDepartmentNameChange = (e) => {
    setDepartmentName(e.target.value);
    if (errorMessage) {
      setErrorMessage(''); 
    }
  };

  const handleSave = () => {
    if (!departmentName) {
      Swal.fire("Error", "Department name is required.", "error"); 
      return; 
    } else {
      setErrorMessage(''); 
    }

    if (isEditing) {
      axios.put(`https://localhost:7091/api/Department/${selectedDepartment.departmentCode}`, {
        departmentCode: selectedDepartment.departmentCode,
        departmentName: departmentName
      })
        .then(() => {
          fetchDepartments(); 
          Swal.fire("Success", "Department updated successfully", "success");
        })
        .catch((error) => {
          console.error('Error updating department:', error);
          Swal.fire("Error", "Failed to update department. Check console for details.", "error"); 
        });
    } else {
      const newDepartment = {
        departmentCode,
        departmentName
      };

      axios.post("https://localhost:7091/api/Department", newDepartment)
        .then(() => {
          Swal.fire("Success", "Department added successfully", "success"); 
          fetchDepartments(); 
        })
        .catch((err) => {
          console.error("Error adding department:", err.response ? err.response.data : err.message);
          Swal.fire("Error", "Failed to add department. Check console for details.", "error"); 
        });
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`https://localhost:7091/api/Department/${id}`)
          .then(() => {
            fetchDepartments(); 
            Swal.fire("Deleted!", "Department has been deleted.", "success"); 
          })
          .catch((error) => {
            console.error('Error deleting department:', error);
            Swal.fire("Error", "Failed to delete department. Check console for details.", "error"); 
          });
      }
    });
  };

  const filteredDepartments = departments.filter((department) => {
    if (filterBy === 'name') {
      return department.departmentName.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (filterBy === 'id') {
      return department.departmentCode.toString().includes(searchTerm);
    }
    return false;
  });

  const downloadPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Department Code", "Department Name"];
    const tableRows = [];

    filteredDepartments.forEach(department => {
      const departmentData = [
        department.departmentCode,
        department.departmentName,
      ];
      tableRows.push(departmentData);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.text("Department Details", 14, 15);
    doc.save("departments.pdf");
  };

  useEffect(() => {
    if (isModalOpen && inputRef.current) {
      inputRef.current.focus(); 
    }
  }, [isModalOpen]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <div className="container py-8 mx-auto">
      <h1 className="mb-6 text-2xl font-bold text-center">Departments</h1>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Department Name</h2>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => openModal()}
            className="px-4 py-2 text-white bg-green-500 rounded-md shadow-md hover:bg-green-600"
          >
            + Add New Department
          </button>
          <button
            onClick={downloadPDF}
            className="px-4 py-2 text-white bg-blue-500 rounded-md shadow-md hover:bg-blue-600"
          >
            Download PDF
          </button>
        </div>
      </div>

      {errorMessage && <p className="text-red-500">{errorMessage}</p>} 

      <div className="flex items-center mb-4 space-x-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={`Search by ${filterBy === 'name' ? 'name' : 'ID'}...`}
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
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDepartments.map((department) => (
              <tr key={department.departmentCode} className="border-b">
                <td className="px-4 py-2">{department.departmentCode}</td>
                <td className="px-4 py-2">{department.departmentName}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => openModal(department)}
                    className="px-3 py-2 mr-4 text-sm text-white rounded-lg bg-cyan-400 hover:bg-cyan-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(department.departmentCode)}
                    className="px-3 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 mx-auto bg-white rounded shadow-md">
            <h2 className="mb-4 text-xl font-bold text-center">{isEditing ? 'Edit Department' : 'Add Department'}</h2>
            <input
              ref={inputRef}
              type="text"
              value={departmentName}
              onChange={handleDepartmentNameChange}
              onKeyDown={handleKeyDown} 
              placeholder="Department Name"
              className="block w-full p-2 mb-4 border border-gray-300 rounded-md"
            />
            {errorMessage && <p className="text-red-500">{errorMessage}</p>} 

            <div className="flex justify-between">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-white bg-gray-500 rounded-md shadow-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-white bg-blue-500 rounded-md shadow-md hover:bg-blue-600"
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

export default DepartmentTable;
