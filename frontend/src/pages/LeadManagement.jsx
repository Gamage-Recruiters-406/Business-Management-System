import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Edit2, Trash2, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import Swal from "sweetalert2";
import AddLeadModal from '../components/lead/AddLeadModal';
import EditLeadModal from '../components/lead/EditLeadModal';

const LeadManagement = () => {
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);
  const itemsPerPage = 5;

  const statusOptions = ['All', 'New', 'Contacted', 'Converted'];
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const token = localStorage.getItem("userToken");

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

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

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

  const fetchLeads = useCallback (async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/leads/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      const mappedLeads = (res.data.data || []).map(lead => ({
        id: lead._id,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        created: new Date(lead.createdAt).toLocaleDateString(),
        status: lead.status,
      }));
      setLeads(mappedLeads);
      console.log("Response :", res.data.data);
    } catch (error) {
      console.error("Failed to fetch leads", error);
    }
  },[API_BASE_URL, token]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleUpdateLead = async (updatedLead) => {
    try {
      const res = await axios.put(
        `${API_BASE_URL}/leads/update/${updatedLead.id}`,
        {
          name: updatedLead.name,
          email: updatedLead.email,
          phone: updatedLead.phone,
          status: updatedLead.status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Update state locally
      // setLeads(leads.map(l => l.id === updatedLead.id ? {
      //   ...l,
      //   name: res.data.data.name,
      //   email: res.data.data.email,
      //   phone: res.data.data.phone,
      //   status: res.data.data.status,
      //   created: new Date(res.data.data.createdAt).toLocaleDateString()
      // } : l));
      fetchLeads();

      Toast.fire({
        icon: "success",
        title: "Lead updated successfully",
      });
  
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Failed to update lead",
      });
      console.error("Error updating lead:", error.response?.data || error);
    }
  };

  const handleDeleteLead = async (_id) => {
    try {
      await axios.delete(`${API_BASE_URL}/leads/delete/${_id}`, {
       
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      // setLeads(leads.filter((lead) => lead.id !== _id));
      fetchLeads();

      Toast.fire({
        icon: "success",
        title: "Lead deleted successfully",
      });

    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Failed to delete lead",
      });
      console.error("Error deleting lead:", error);
    }
  };

  const handleAddLead = async (newLead) => {
    try {
      const leadToSend = {
        name: newLead.name,
        email: newLead.email,
        phone: newLead.phone,
        status: newLead.status,
      };

      const res = await axios.post(`${API_BASE_URL}/leads/create`, leadToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      // // Add the returned lead to state
      // const addedLead = {
      //   id: res.data.data._id,
      //   name: res.data.data.name,
      //   email: res.data.data.email,
      //   phone: res.data.data.phone,
      //   created: new Date(res.data.data.createdAt).toLocaleDateString(),
      //   status: res.data.data.status,
      // };
      // setLeads([...leads, addedLead]);
      fetchLeads();

      Toast.fire({
        icon: "success",
        title: "Lead added successfully",
      });

    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Failed to add lead",
      });
      console.error("Error adding lead:", error.response?.data || error);
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
            <p className="text-xs md:text-lg text-gray-600 mt-1">Manage and track your sales pipeline prospects</p>
          </div>
        </div>
        <div className="flex items-center justify-end mb-8">
            <button
              onClick={() => setOpenModal(true)} 
              className="bg-blue-800 text-white px-4 py-1 sm:px-6 sm:py-2.5 rounded-lg font-small md:font-medium hover:bg-blue-950 transition-colors w-xl sm:w-auto text-center">
                + New Lead
            </button>
            <AddLeadModal
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
                onAdd={handleAddLead}
            />
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
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-800 bg-white"
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
                  <th className="px-10 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="hidden sm:table-cell px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2 cursor-pointer group" onClick={() => handleSort('created')}>
                      Created Date
                      <svg className={`h-4 w-4 transition-transform ${sortConfig.key === 'created' ? (sortConfig.direction === 'asc' ? 'rotate-180' : '') : ''} group-hover:opacity-75`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th className="px-10 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                                <button
                                  onClick={() => {
                                    setSelectedLead(lead);
                                    setEditOpen(true);
                                  }} 
                                  className="text-blue-800 hover:text-blue-950 p-2 rounded">
                                    <Edit2 size={18} />
                                </button>
                                <button 
                                  onClick={() => {
                                    setLeadToDelete(lead);
                                    setDeleteModalOpen(true);
                                  }}
                                  className="text-red-400 hover:text-red-800 p-2 rounded">
                                    <Trash2 size={18} />
                                </button>

                               
                            </div>
                            </td>
                        </tr>
                    );
                })}
              </tbody>
            </table>
            <EditLeadModal
              isOpen={editOpen}
              onClose={() => setEditOpen(false)}
              lead={selectedLead}
              onUpdate={handleUpdateLead}
            />
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
                          ? 'bg-blue-800 text-white border-blue-800'
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
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-red-200 p-2 rounded-full">
              <AlertTriangle className="text-white fill-red-600 w-6 h-6" />
            </div>

            <h2 className="text-lg font-semibold text-gray-900">
              Confirm Delete
            </h2>
          </div>
            <p className="mb-6">
              Are you sure you want to delete <span className="font-medium">{leadToDelete?.name}</span>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDeleteLead(leadToDelete.id);
                  setDeleteModalOpen(false);
                }}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadManagement;
