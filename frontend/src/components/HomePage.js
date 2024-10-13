import React from 'react'
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="space-x-4 space-y-4 ">
        <Link to="/departments">
          <button className="w-64 h-16 text-lg text-white transition duration-300 rounded-lg shadow-md bg-accent hover:bg-accent-hover">
            Department
          </button>
        </Link>
        <Link to="/employees">
          <button className="w-64 h-16 text-lg text-white transition duration-300 rounded-lg shadow-md bg-primary hover:bg-secondary">
            Employee
          </button>
        </Link>
      </div>
    </div>
  )
}

export default HomePage