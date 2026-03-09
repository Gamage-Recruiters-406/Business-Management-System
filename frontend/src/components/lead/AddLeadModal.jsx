import { X } from "lucide-react";
import { useState } from "react";

export default function AddLeadModal({ isOpen, onClose, onAdd }) {

  const [lead, setLead] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    status: "New"
  });

  const handleChange = (e) => {
    setLead({
      ...lead,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onAdd) onAdd(lead); // call parent handler
    onClose();
    setLead({
      name: "",
      email: "",
      phone: "",
      date: "",
      status: "New",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">

      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Add New Lead</h2>

          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500 hover:text-gray-700"/>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name */}
          <div>
            <label className="text-sm text-gray-600">Lead Name</label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={lead.name}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-600">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="john@example.com"
              value={lead.email}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm text-gray-600">Phone Number</label>
            <input
              type="text"
              name="phone"
              placeholder="+94*********"
              value={lead.phone}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Date + Status */}
          <div className="grid grid-cols-2 gap-3">

            <div>
              <label className="text-sm text-gray-600">Date</label>
              <input
                type="date"
                name="date"
                value={lead.date}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Status</label>
              <select
                name="status"
                value={lead.status}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>New</option>
                <option>Contacted</option>
                <option>Converted</option>
              </select>
            </div>

          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-3">

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Lead
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}