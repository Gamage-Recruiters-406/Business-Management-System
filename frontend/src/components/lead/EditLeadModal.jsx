import { X } from "lucide-react";
import { useState, useEffect } from "react";

export default function EditLeadModal({ isOpen, onClose, lead, onUpdate }) {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    status: "NEW"
  });

  useEffect(() => {
    if (lead) {
        setFormData({
            name: lead.name || "",
            email: lead.email || "",
            phone: lead.phone || "",
            date: lead.created || "",
            status: lead.status || "New"
            });
    }
  }, [lead]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({
        ...formData,
        created: formData.date
      });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">

      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Edit Lead</h2>

          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500 hover:text-gray-700"/>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name */}
          <div className="block w-full">
            <label className="block text-sm text-gray-600 mb-1">Lead Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="block w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col justify-start w-full">
            <label className="block text-sm text-gray-600">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Phone */}
          <div className="block w-full">
            <label className="block text-sm text-gray-600">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Date + Status */}
          <div className="grid grid-cols-2 gap-3">

            <div className="block w-full">
              <label className="block text-sm text-gray-600">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="block w-full">
              <label className="block text-sm text-gray-600">Status</label>
              <select
                name="status"
                value={formData.status}
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
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Update Lead
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}