import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import EmployeeManagement from "./pages/EmployeeManagement";
import TaskManagement from "./pages/TaskManagement";
import Dashboard from "./pages/Dashboard";
import "./App.css";
import LeadManagement from "./pages/LeadManagement";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/employees" element={<EmployeeManagement />} />
        <Route path="/tasks" element={<TaskManagement />} />
        <Route path="/leads" element={<LeadManagement />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
