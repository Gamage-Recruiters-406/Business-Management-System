import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import EmployeeManagement from "./pages/EmployeeManagement";
import TaskManagement from "./pages/TaskManagement";
import Dashboard from "./pages/Dashboard";
import "./App.css";
import LeadManagement from "./pages/LeadManagement";
import SignInPage from "./pages/login/SignInPage";
import SignUpPage from "./pages/login/SignUpPage";
import ProfilePage from "./pages/Profile";
import Reports from "./pages/admin_Reports/ReportsDashboard";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employees" element={<EmployeeManagement />} />
        <Route path="/tasks" element={<TaskManagement />} />
        <Route path="/leads" element={<LeadManagement />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/profile" element={<ProfilePage />} />
         <Route path="/reports" element={<Reports />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
