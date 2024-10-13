import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import * as d3 from 'd3';

const EmployeeSummary = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const svgRef = useRef(null);

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (employees.length > 0 && departments.length > 0) {
      updatePieChart();
    }
  }, [employees, departments]);

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

  // Group employees by department
  const groupEmployeesByDepartment = () => {
    const departmentCount = employees.reduce((acc, employee) => {
      const department = departments.find(dep => dep.departmentCode === employee.departmentCode);
      const departmentName = department ? department.departmentName : 'Unknown';
      acc[departmentName] = (acc[departmentName] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(departmentCount).map((department) => ({
      name: department,
      value: departmentCount[department],
    }));
  };

  const updatePieChart = () => {
    const data = groupEmployeesByDepartment();
    const totalEmployees = employees.length;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); 

    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const pie = d3.pie().value(d => d.value);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    const chartGroup = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const arcs = chartGroup
      .selectAll('arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    arcs
      .append('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.name));

    arcs
      .append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', '#fff')
      .text(d => {
        const percentage = ((d.data.value / totalEmployees) * 100).toFixed(2); 
        return `${percentage}%`; 
      });

    arcs
      .append('text')
      .attr('transform', d => {
        const [x, y] = arc.centroid(d);
        return `translate(${x}, ${y + 15})`; 
      })
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', '#000')
      .text(d => d.data.name);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold text-center mb-6">Employee Summary by Department</h1>
      <div className="flex justify-center">
        <svg ref={svgRef}></svg>
      </div>
    </div>
  );
};

export default EmployeeSummary;
