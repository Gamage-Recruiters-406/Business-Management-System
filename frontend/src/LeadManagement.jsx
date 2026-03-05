import React, { useState, useMemo } from 'react';
import { Edit2, Trash2 } from 'lucide-react';

const LeadManagement = () => {
  const [leads, setLeads] = useState([
    { id: 1, name: 'John Doe', email: 'john@test.com', phone: '+1 234 567', created: '2023-01-10', status: 'New' },
    { id: 2, name: 'Jane Smith', email: 'jane@global.com', phone: '+1 987 321', created: '2023-01-18', status: 'Contacted' },
    { id: 3, name: 'Robert Brown', email: 'robert@stat.com', phone: '+1 555 444', created: '2023-02-11', status: 'Converted' },
    { id: 4, name: 'Emily Davis', email: 'emily@flow.net', phone: '+1 333 999', created: '2023-02-20', status: 'New' },
    { id: 5, name: 'Michael Wilson', email: 'michael@locale.com', phone: '+1 777 222', created: '2023-03-05', status: 'Contacted' },
    { id: 6, name: 'Sarah Wilson', email: 'sarah@novate.com', phone: '+1 456 789', created: '2023-10-10', status: 'Contacted' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const statusOptions = ['All', 'New', 'Contacted', 'Converted'];

  const filteredLeads = useMemo(() => {
    let filtered = leads.filter(lead =>
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (statusFilter !== 'All') {
      filtered = filtered.filter(lead => lead.status === statusFilter);
    }

    return filtered;
  }, [leads, searchTerm, statusFilter]);

  const sortedLeads = useMemo(() => {
    if (!sortConfig.key) return filteredLeads;

    return [...filteredLeads].sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      if (sortConfig.key === 'created') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredLeads, sortConfig]);

  const paginatedLeads = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedLeads.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedLeads, currentPage]);

  const totalPages = Math.ceil(sortedLeads.length / itemsPerPage);

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  const getStatusBadgeClass = (status) => {
    const base = 'px-3 py-1 rounded-full text-sm font-semibold shadow-sm';
    switch (status) {
      case 'New': return `${base} bg-blue-100 text-blue-800`;
      case 'Contacted': return `${base} bg-yellow-100 text-yellow-800`;
      case 'Converted': return `${base} bg-green-100 text-green-800`;
      default: return base;
    }
  };

  const getAvatarStyleByStatus = (status) => {
    switch (status) {
        case 'New':
            return { bg: 'bg-blue-100', text: 'text-blue-800' };
        case 'Contacted':
            return { bg: 'bg-yellow-100', text: 'text-yellow-800' };
        case 'Converted':
            return { bg: 'bg-green-100', text: 'text-green-800' };
        default:
            return { bg: 'bg-gray-100', text: 'text-gray-800' };
    }
  };

  
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const getInitials = (name) => {
    const words = name.split(' ');
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-md md:text-3xl font-bold text-gray-900">Lead Management</h1>
            <p className="text-xs md:text-lg text-gray-600 mt-1">Manage your sales pipeline prospects</p>
          </div>
        </div>
        <div className="flex items-center justify-end mb-8">
            <button className="bg-blue-600 text-white px-4 py-1 sm:px-6 sm:py-2.5 rounded-lg font-small md:font-medium hover:bg-blue-700 transition-colors w-xl sm:w-auto text-center">
                + New Lead
            </button>
        </div>

        {/* Filters Row */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1 max-w-md w-full">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search leads by name or email"
                  className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-1 md:gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span>Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="w-px h-6 bg-gray-200" />
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <span>Sort:</span>
                <span className="font-medium text-gray-900">{sortedLeads.length} results</span>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto -mx-6 sm:-mx-8 px-6 sm:px-8">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2 cursor-pointer group" onClick={() => handleSort('name')}>
                      Lead Name
                      <svg className={`h-4 w-4 transition-transform ${sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? 'rotate-180' : '') : ''} group-hover:opacity-75`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th className="px-16 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-16 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="hidden sm:table-cell px-16 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2 cursor-pointer group" onClick={() => handleSort('created')}>
                      Created Date
                      <svg className={`h-4 w-4 transition-transform ${sortConfig.key === 'created' ? (sortConfig.direction === 'asc' ? 'rotate-180' : '') : ''} group-hover:opacity-75`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th className="px-16 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2 cursor-pointer group" onClick={() => handleSort('status')}>
                      Status
                      <svg className={`h-4 w-4 transition-transform ${sortConfig.key === 'status' ? (sortConfig.direction === 'asc' ? 'rotate-180' : '') : ''} group-hover:opacity-75`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedLeads.map((lead) => {
                    const avatarStyle = getAvatarStyleByStatus(lead.status);
                    return (
                        <tr key={lead.id} className="hover:bg-gray-50 transition-colors duration-200">
                            <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap">
                            <div className="flex items-center">
                                <div className={`shrink-0 h-8 w-8 sm:h-10 sm:w-10 ${avatarStyle.bg} rounded-full flex items-center justify-center`}>
                                <span className={`font-medium text-xs sm:text-sm ${avatarStyle.text}`}>{getInitials(lead.name)}</span>
                                </div>
                                <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                                </div>
                            </div>
                            </td>
                            <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-900">{lead.email}</td>
                            <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-900">{lead.phone}</td>
                            <td className="hidden sm:table-cell px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-900">{lead.created}</td>
                            <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap">
                            <span className={getStatusBadgeClass(lead.status)}>{lead.status}</span>
                            </td>
                            <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center gap-4">
                                <button className="text-blue-600 hover:text-blue-900 p-2 rounded">
                                    <Edit2 size={18} />
                                </button>
                                <button className="text-red-400 hover:text-red-800 p-2 rounded">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                            </td>
                        </tr>
                    );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-gray-50 px-6 py-4 flex flex-col md:flex-row items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                <span className="font-medium">{Math.min(currentPage * itemsPerPage, sortedLeads.length)}</span> of{' '}
                <span className="font-medium">{sortedLeads.length}</span> results
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium border transition-colors ${
                        currentPage === i + 1
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadManagement;
