import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LeadManagement from './LeadManagement'


function Home() {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md text-center">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">
        Tailwind CSS + React
      </h1>
    </div>
  );
}
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/leads" element={<LeadManagement />} />
      </Routes>
    </Router>

    
  )
}

export default App
