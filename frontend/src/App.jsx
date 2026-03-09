import React from "react";
<<<<<<< Updated upstream
import { BrowserRouter, Routes, Route } from "react-router-dom";
=======
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
>>>>>>> Stashed changes
import Header from "./components/Header"; 
import Home from "./pages/Home";
import EmployeeManagement from "./pages/EmployeeManagement";
import TaskManagement from "./pages/TaskManagement";
import Dashboard from "./pages/Dashboard";
import "./App.css";
import LeadManagement from "./pages/LeadManagement";
import SignInPage from "./pages/login/SignInPage";
import SignUpPage from "./pages/login/SignUpPage";
import Reports from "./pages/admin_Reports/ReportsDashboard";

<<<<<<< Updated upstream
function App() {
  return (
    <BrowserRouter>
      {/* Your finished Header is now integrated */}
      <Header />

      <main className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/employees" element={<EmployeeManagement />} />
          <Route path="/tasks" element={<TaskManagement />} />
          <Route path="/leads" element={<LeadManagement />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </main>
=======
function AppContent() {
  const location = useLocation();

  const hideHeaderPaths = ["/signin", "/signup"];

  const shouldShowHeader = !hideHeaderPaths.includes(location.pathname);

  return (
    <>
      {shouldShowHeader && <Header />}

      <main className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/employees" element={<EmployeeManagement />} />
          <Route path="/tasks" element={<TaskManagement />} />
          <Route path="/leads" element={<LeadManagement />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
>>>>>>> Stashed changes
    </BrowserRouter>
  );
}

export default App;