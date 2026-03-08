import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoIcon from '../assets/logo-icon.jpeg'; 
import logoText from '../assets/logo-text.jpeg'; 

const Header = () => {
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Employees', path: '/employees' },
    { name: 'Tasks', path: '/tasks' },
    { name: 'Leads', path: '/leads' },
    { name: 'Reports', path: '/reports' },
  ];

  return (
    <header className="w-full bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-400 mx-auto px-6 h-32 flex justify-between items-center">
        
       
        <div className="flex items-center gap-4 shrink-0">
          <Link to="/" className="flex items-center gap-4">
            <img 
              src={logoText} 
              alt="Biz Manager" 
              className="h-24 w-auto object-contain" 
              style={{ minWidth: '200px' }}
            />
            
           
            <div className="flex flex-col justify-center border-l-2 pl-4 border-blue-600/20 py-1">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-tight">Smart</span>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest leading-tight">Structured</span>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-tight">Efficient</span>
            </div>
          </Link>
        </div>

        
        <nav className="hidden xl:flex items-center bg-gray-50/80 backdrop-blur-sm border border-gray-200 px-2 py-1.5 rounded-2xl shadow-inner">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                location.pathname === link.path
                  ? 'bg-white text-blue-600 shadow-md transform scale-105'
                  : 'text-gray-500 hover:text-blue-600'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-6 border-r pr-8 border-gray-100">
            <Link to="/signin" className="text-sm font-bold text-gray-600 hover:text-blue-600">
              Sign In
            </Link>
            <Link 
              to="/signup" 
              className="bg-blue-600 text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
              Get Started
            </Link>
          </div>

          
          <div className="shrink-0">
            <img 
              src={logoIcon} 
              alt="Brand Icon" 
              className="h-20 w-auto rounded-2xl shadow-lg border border-gray-50 transition-transform hover:scale-105" 
            />
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;