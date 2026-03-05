import React, { useState } from 'react';
import { Search, ChevronDown, Filter, Edit2, Trash2, Moon, UploadCloud, X } from 'lucide-react';

const EMPLOYEES = [
  { id: '#EMP-001', name: 'Sarah Connor', email: 'sarah.c@company.com', phone: '+1 555-010-9283', role: 'Admin', hireDate: 'Jan 12, 2022', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: '#EMP-002', name: 'Michael Chen', email: 'm.chen@company.com', phone: '+1 555-010-9284', role: 'Manager', hireDate: 'Mar 05, 2022', avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: '#EMP-003', name: 'Lindsay Walton', email: 'l.walton@company.com', phone: '+1 555-010-9285', role: 'Developer', hireDate: 'Jun 15, 2022', avatar: 'https://i.pravatar.cc/150?u=3' },
  { id: '#EMP-004', name: 'Courtney Henry', email: 'c.henry@company.com', phone: '+1 555-010-9286', role: 'Developer', hireDate: 'Aug 22, 2022', avatar: 'https://i.pravatar.cc/150?u=4' },
  { id: '#EMP-005', name: 'Tom Cook', email: 't.cook@company.com', phone: '+1 555-010-9287', role: 'Developer', hireDate: 'Oct 01, 2022', avatar: 'https://i.pravatar.cc/150?u=5' },
  { id: '#EMP-006', name: 'Whitney Francis', email: 'w.francis@company.com', phone: '+1 555-010-9288', role: 'Manager', hireDate: 'Nov 18, 2022', avatar: 'https://i.pravatar.cc/150?u=6' },
  { id: '#EMP-007', name: 'Leonard Krasner', email: 'l.krasner@company.com', phone: '+1 555-010-9289', role: 'Developer', hireDate: 'Jan 05, 2023', avatar: 'https://i.pravatar.cc/150?u=7' },
  { id: '#EMP-008', name: 'Floyd Miles', email: 'f.miles@company.com', phone: '+1 555-010-9290', role: 'Developer', hireDate: 'Feb 14, 2023', avatar: 'https://i.pravatar.cc/150?u=8' },
];

const RoleBadge = ({ role }) => {
  const styles = {
    Admin: 'bg-purple-100 text-purple-700',
    Manager: 'bg-blue-100 text-blue-700',
    Developer: 'bg-green-100 text-green-700',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[role] || 'bg-gray-100 text-gray-700'}`}>
      {role}
    </span>
  );
};

export default function EmployeeManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 p-8 flex items-start justify-center font-sans">
      <div className="w-full max-w-7xl">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-slate-200 flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Employee Management</h1>
              <p className="text-slate-500 mt-1 text-sm">Manage your workforce and organizational roles.</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center transition-colors shadow-sm"
            >
              <span className="mr-2">+</span> Add New Employee
            </button>
          </div>

          {/* Controls */}
          <div className="p-6 border-b border-slate-200 flex gap-4 bg-slate-50/50">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, email or ID..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
              />
            </div>
            <div className="relative">
              <select className="appearance-none bg-white border border-slate-300 rounded-lg pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700">
                <option>All Roles</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
            </div>
            <div className="relative">
              <select className="appearance-none bg-white border border-slate-300 rounded-lg pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700">
                <option>All Status</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-700 text-sm font-medium hover:bg-slate-100 transition-colors">
              <Filter className="h-4 w-4" />
              More Filters
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                  <th className="px-6 py-4 font-semibold">ID</th>
                  <th className="px-6 py-4 font-semibold">EMPLOYEE</th>
                  <th className="px-6 py-4 font-semibold">EMAIL</th>
                  <th className="px-6 py-4 font-semibold">PHONE</th>
                  <th className="px-6 py-4 font-semibold">ROLE</th>
                  <th className="px-6 py-4 font-semibold">HIRE DATE</th>
                  <th className="px-6 py-4 font-semibold text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {EMPLOYEES.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 text-sm font-medium text-slate-700">{emp.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={emp.avatar} alt={emp.name} className="h-10 w-10 rounded-full bg-slate-200 object-cover" />
                        <span className="text-sm font-bold text-slate-900">{emp.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{emp.email}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{emp.phone}</td>
                    <td className="px-6 py-4">
                      <RoleBadge role={emp.role} />
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{emp.hireDate}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3 text-slate-400">
                        <button className="hover:text-emerald-600 transition-colors"><Edit2 className="h-4 w-4" /></button>
                        <button className="hover:text-red-600 transition-colors"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Pagination */}
          <div className="p-6 border-t border-slate-200 flex items-center justify-between">
            <div className="text-sm text-slate-500">
              Showing <span className="font-medium text-slate-900">1</span> to <span className="font-medium text-slate-900">8</span> of <span className="font-medium text-slate-900">25</span> employees
            </div>
            <div className="flex items-center gap-1">
              <button className="px-3 py-1 border border-slate-300 rounded-md text-slate-500 hover:bg-slate-50">&lt;</button>
              <button className="px-3 py-1 border border-emerald-600 bg-emerald-50 text-emerald-600 rounded-md font-medium">1</button>
              <button className="px-3 py-1 border border-slate-300 rounded-md text-slate-600 hover:bg-slate-50">2</button>
              <button className="px-3 py-1 border border-slate-300 rounded-md text-slate-600 hover:bg-slate-50">3</button>
              <span className="px-2 text-slate-400">...</span>
              <button className="px-3 py-1 border border-slate-300 rounded-md text-slate-600 hover:bg-slate-50">4</button>
              <button className="px-3 py-1 border border-slate-300 rounded-md text-slate-500 hover:bg-slate-50">&gt;</button>
            </div>
          </div>
        </div>

        {/* Floating actions */}
        <div className="fixed bottom-8 right-8">
          <button className="h-12 w-12 bg-white border border-slate-200 rounded-full shadow-sm flex items-center justify-center text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition-colors">
            <Moon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Add New Employee</h2>
                <p className="text-sm text-slate-500 mt-1">Create a new profile for a team member.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-800">Full Name</label>
                  <input type="text" placeholder="John Doe" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm transition-all text-slate-700 placeholder:text-slate-400" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-800">Department Role</label>
                  <div className="relative">
                    <select className="w-full appearance-none px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm transition-all text-slate-700">
                      <option value="" disabled selected>Select a role</option>
                      <option>Admin</option>
                      <option>Manager</option>
                      <option>Developer</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-800">Work Email</label>
                  <input type="email" placeholder="john.doe@company.com" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm transition-all text-slate-700 placeholder:text-slate-400" />
                </div>

                <div className="space-y-1.5 flex flex-col justify-center">
                  <label className="text-sm font-semibold text-slate-800 mb-2">Employment Status</label>
                  <div className="flex items-center gap-3 mt-1">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                    <span className="text-sm text-slate-600 font-medium">Active Account</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-800">Phone Number</label>
                  <input type="tel" placeholder="+1 (555) 000-0000" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm transition-all text-slate-700 placeholder:text-slate-400" />
                </div>

                <div className="space-y-1.5 row-span-2">
                  <label className="text-sm font-semibold text-slate-800">Profile Photo</label>
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer group h-[116px]">
                    <div className="bg-slate-100 p-2 rounded-full mb-2 group-hover:scale-110 transition-transform">
                      <UploadCloud className="h-5 w-5 text-slate-500" />
                    </div>
                    <div>
                      <span className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">Upload a file</span>
                      <span className="text-slate-500 text-sm"> or drag and drop</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 5MB</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-800">Hire Date</label>
                  <input type="date" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm transition-all text-slate-700 text-slate-400" />
                </div>

              </div>
            </div>

            <div className="px-6 py-4 flex justify-end gap-3 border-t border-slate-50">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-2">
                <span className="h-4 w-4 rounded-full border border-white opacity-70"></span>
                Add Employee
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
