import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/HomePage';
import Department from './components/Department';
import Employee from './components/Employee';
import Navbar from './components/Navbar';
import EmployeeSummary from './components/EmployeeSummary'

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/departments" element={<Department />} />
          <Route path="/employees" element={<Employee />} />
          <Route path="/employeeSummary" element={<EmployeeSummary/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
