import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Filter, Edit2, Trash2, X, UploadCloud, ChevronLeft, ChevronRight, Moon } from 'lucide-react';
import Swal from 'sweetalert2';

const API_BASE_URL = 'http://localhost:8085/api/v1/employees';

const RoleBadge = ({ role }) => {
  const roleLower = role?.toLowerCase() || '';
  const styles = {
    manager: 'bg-blue-100 text-blue-700',
    developer: 'bg-green-100 text-green-700',
    sales: 'bg-yellow-100 text-yellow-700',
    support: 'bg-purple-100 text-purple-700',
    hr: 'bg-pink-100 text-pink-700',
    other: 'bg-gray-100 text-gray-700',
  };
  
  const displayRole = role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Other';

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[roleLower] || styles.other}`}>
      {displayRole}
    </span>
  );
};

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [statusFilter, setStatusFilter] = useState('All Status');

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  // Form State
  const initialFormState = {
    name: '',
    role: '',
    email: '',
    phone: '',
    hireDate: '',
    avatarPreview: null
  };
  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({});

  // Fetch from backend
  const fetchEmployees = async () => {
    try {
      const response = await fetch(API_BASE_URL, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // pass token
        }
      });
      const data = await response.json();
      if (data.success) {
        const mappedEmployees = data.data.map(emp => ({
           id: emp._id,
           name: `${emp.firstName} ${emp.lastName}`,
           email: emp.email,
           phone: emp.contactNumber,
           role: emp.role, // store enum directly
           hireDateRaw: emp.createdAt ? new Date(emp.createdAt).toISOString().split('T')[0] : '',
           hireDate: emp.createdAt ? new Date(emp.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : '',
           status: 'Active', // Mocked, no status in backend model currently
           avatar: `https://ui-avatars.com/api/?name=${emp.firstName}+${emp.lastName}&background=random`
        }));
        setEmployees(mappedEmployees);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...employees];

    if (searchQuery) {
      filtered = filtered.filter(emp => 
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (emp.id && emp.id.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (roleFilter !== 'All Roles') {
      filtered = filtered.filter(emp => emp.role === roleFilter);
    }

    if (statusFilter !== 'All Status') {
      filtered = filtered.filter(emp => emp.status === statusFilter);
    }

    setFilteredEmployees(filtered);
    setCurrentPage(1);
  }, [searchQuery, roleFilter, statusFilter, employees]);

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire('Error', 'File size should not exceed 5MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatarPreview: reader.result, avatarFile: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    if (!formData.role) errors.role = 'Role is required';
    if (!formData.phone.trim()) errors.phone = 'Phone is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  };

  const handleAddEmployee = async () => {
    if (!validateForm()) return;

    const [firstName, ...lastNameParts] = formData.name.split(' ');
    const lastName = lastNameParts.length > 0 ? lastNameParts.join(' ') : formData.name;

    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email: formData.email,
          role: formData.role,
          contactNumber: formData.phone
        })
      });
      const data = await response.json();
      if (data.success) {
        Swal.fire('Success', 'Employee created successfully', 'success');
        fetchEmployees();
        closeModal();
      } else {
        Swal.fire('Error', data.message || 'Error creating employee', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Server error', 'error');
    }
  };

  const handleEditClick = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      role: employee.role,
      email: employee.email,
      phone: employee.phone,
      hireDate: employee.hireDateRaw || '',
      avatarPreview: employee.avatar || null
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleUpdateEmployee = async () => {
    if (!validateForm()) return;

    const [firstName, ...lastNameParts] = formData.name.split(' ');
    const lastName = lastNameParts.length > 0 ? lastNameParts.join(' ') : formData.name;

    try {
      const response = await fetch(`${API_BASE_URL}/${editingEmployee.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email: formData.email,
          role: formData.role,
          contactNumber: formData.phone
        })
      });
      const data = await response.json();
      if (data.success) {
        Swal.fire('Success', 'Employee updated successfully', 'success');
        fetchEmployees();
        closeModal();
      } else {
        Swal.fire('Error', data.message || 'Error updating employee', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Server error', 'error');
    }
  };

  const handleDeleteEmployee = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          const data = await response.json();
          if (data.success) {
            Swal.fire('Deleted!', 'Employee has been deleted.', 'success');
            fetchEmployees();
          } else {
            Swal.fire('Error', data.message || 'Error deleting employee', 'error');
          }
        } catch (error) {
          Swal.fire('Error', 'Server error', 'error');
        }
      }
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingEmployee(null);
    setFormData(initialFormState);
    setFormErrors({});
  };

  const clearFilters = () => {
    setSearchQuery('');
    setRoleFilter('All Roles');
    setStatusFilter('All Status');
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-[1600px] mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          
          {/* Header with Moon Icon */}
          <div className="p-4 md:p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900">Employee Management</h1>
              <p className="text-slate-500 mt-1 text-sm">Manage your workforce and organizational roles.</p>
            </div>
            <div className="flex items-center gap-3">
            
              
              <button
                onClick={() => {
                  setIsEditMode(false);
                  setFormData(initialFormState);
                  setIsModalOpen(true);
                }}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center justify-center transition-colors shadow-sm cursor-pointer"
              >
                <span className="mr-2 text-lg">+</span> Add New Employee
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="p-4 md:p-6 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, email or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative min-w-[140px]">
                <select 
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full appearance-none bg-white border border-slate-300 rounded-lg pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700 cursor-pointer"
                >
                  <option value="All Roles">All Roles</option>
                  <option value="manager">Manager</option>
                  <option value="sales">Sales</option>
                  <option value="support">Support</option>
                  <option value="developer">Developer</option>
                  <option value="hr">HR</option>
                  <option value="other">Other</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
              </div>
              
              <div className="relative min-w-[140px]">
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full appearance-none bg-white border border-slate-300 rounded-lg pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700 cursor-pointer"
                >
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
              </div>
              
              <button 
                onClick={clearFilters}
                className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 text-sm font-medium hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <Filter className="h-4 w-4" />
                Clear Filters
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                  <th className="px-4 md:px-6 py-4 font-semibold">ID</th>
                  <th className="px-4 md:px-6 py-4 font-semibold">EMPLOYEE</th>
                  <th className="px-4 md:px-6 py-4 font-semibold">EMAIL</th>
                  <th className="px-4 md:px-6 py-4 font-semibold">PHONE</th>
                  <th className="px-4 md:px-6 py-4 font-semibold">ROLE</th>
                  <th className="px-4 md:px-6 py-4 font-semibold">HIRE DATE</th>
                  <th className="px-4 md:px-6 py-4 font-semibold text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentItems.length > 0 ? (
                  currentItems.map((emp) => (
                    <tr key={emp.id} className={`hover:bg-slate-50 transition-colors ${emp.status === 'Inactive' ? 'opacity-60' : ''}`}>
                      <td className="px-4 md:px-6 py-4 text-sm font-medium text-slate-700" title={emp.id}>
                        {emp.id ? emp.id.substring(0, 8) : 'N/A'}...
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={emp.avatar} alt={emp.name} className="h-8 w-8 rounded-full bg-slate-200 object-cover" />
                          <div>
                            <span className="text-sm font-medium text-slate-900">{emp.name}</span>
                            {emp.status === 'Inactive' && (
                              <span className="ml-2 text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded">Inactive</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4 text-sm text-slate-500">{emp.email}</td>
                      <td className="px-4 md:px-6 py-4 text-sm text-slate-500">{emp.phone}</td>
                      <td className="px-4 md:px-6 py-4">
                        <RoleBadge role={emp.role} />
                      </td>
                      <td className="px-4 md:px-6 py-4 text-sm text-slate-500">{emp.hireDate}</td>
                      <td className="px-4 md:px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3 text-slate-400">
                          <button 
                            onClick={() => handleEditClick(emp)}
                            className="hover:text-emerald-600 transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteEmployee(emp.id)} 
                            className="hover:text-red-600 transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                      No employees found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Pagination */}
          <div className="p-4 md:p-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-slate-500">
              Showing <span className="font-medium text-slate-900">
                {filteredEmployees.length > 0 ? indexOfFirstItem + 1 : 0}
              </span> to{' '}
              <span className="font-medium text-slate-900">
                {Math.min(indexOfLastItem, filteredEmployees.length)}
              </span> of{' '}
              <span className="font-medium text-slate-900">{filteredEmployees.length}</span> employees
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-slate-300 rounded-md text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 border rounded-md text-sm font-medium cursor-pointer ${
                        currentPage === pageNum
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-600'
                          : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                  return <span key={pageNum} className="px-2 text-slate-400">...</span>;
                }
                return null;
              })}

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-1 border border-slate-300 rounded-md text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Employee Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4" onClick={closeModal}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-start sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {isEditMode ? 'Edit Employee' : 'Add New Employee'}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {isEditMode ? 'Update employee information.' : 'Create a new profile for a team member.'}
                </p>
              </div>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-800">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    type="text" 
                    placeholder="John Doe" 
                    className={`w-full px-4 py-2.5 rounded-lg border ${
                      formErrors.name ? 'border-red-500' : 'border-slate-200'
                    } focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm`}
                  />
                  {formErrors.name && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-800">
                    Department Role <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select 
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className={`w-full appearance-none px-4 py-2.5 rounded-lg border ${
                        formErrors.role ? 'border-red-500' : 'border-slate-200'
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm cursor-pointer`}
                    >
                      <option value="" disabled>Select a role</option>
                      <option value="manager">Manager</option>
                      <option value="sales">Sales</option>
                      <option value="support">Support</option>
                      <option value="developer">Developer</option>
                      <option value="hr">HR</option>
                      <option value="other">Other</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                  {formErrors.role && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.role}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-800">
                    Work Email <span className="text-red-500">*</span>
                  </label>
                  <input 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    type="email" 
                    placeholder="john.doe@company.com" 
                    className={`w-full px-4 py-2.5 rounded-lg border ${
                      formErrors.email ? 'border-red-500' : 'border-slate-200'
                    } focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm`}
                  />
                  {formErrors.email && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-800">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    type="tel" 
                    placeholder="+1 (555) 000-0000" 
                    className={`w-full px-4 py-2.5 rounded-lg border ${
                      formErrors.phone ? 'border-red-500' : 'border-slate-200'
                    } focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm`}
                  />
                  {formErrors.phone && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.phone}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-800">Hire Date</label>
                  <input 
                    name="hireDate"
                    value={formData.hireDate}
                    onChange={handleInputChange}
                    type="date" 
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-semibold text-slate-800">Profile Photo</label>
                  <div className="relative border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer overflow-hidden">
                    <input 
                      type="file" 
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                      accept=".png, .jpg, .jpeg"
                    />
                    {formData.avatarPreview ? (
                      <div className="flex flex-col items-center">
                        <img src={formData.avatarPreview} alt="Preview" className="h-20 w-20 rounded-full object-cover mb-2 border border-slate-200 shadow-sm" />
                        <span className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">Change photo</span>
                      </div>
                    ) : (
                      <>
                        <div className="bg-slate-100 p-2 rounded-full mb-2">
                          <UploadCloud className="h-5 w-5 text-slate-500" />
                        </div>
                        <div>
                          <span className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">Upload a file</span>
                          <span className="text-slate-500 text-sm"> or drag and drop</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 5MB</p>
                      </>
                    )}
                  </div>
                </div>

              </div>
            </div>

            <div className="px-6 py-4 flex justify-end gap-3 border-t border-slate-100 sticky bottom-0 bg-white">
              <button
                onClick={closeModal}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={isEditMode ? handleUpdateEmployee : handleAddEmployee}
                disabled={!formData.name || !formData.email || !formData.role || !formData.phone}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 transition-colors shadow-sm cursor-pointer"
              >
                {isEditMode ? 'Update Employee' : 'Add Employee'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}