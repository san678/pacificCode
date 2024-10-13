import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="p-4 bg-gray-800">
      <div className="container flex items-center justify-between mx-auto">
        <h1 className="text-xl font-bold text-white">My Application</h1>
        <button
          onClick={toggleMenu}
          className="text-white md:hidden focus:outline-none"
        >
          {isOpen ? '✖' : '☰'} {/* Hamburger Icon */}
        </button>
        <div className={`md:flex md:items-center md:space-x-4 ${isOpen ? 'block' : 'hidden'}`}>
          <Link to="/employees" className="px-3 py-2 text-white rounded hover:bg-gray-700">
            Employees
          </Link>
          <Link to="/departments" className="px-3 py-2 text-white rounded hover:bg-gray-700">
            Departments
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
