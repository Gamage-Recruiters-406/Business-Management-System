import React, { useState, useEffect } from "react";
import {
  X,
  ChevronDown,
  Plus,
  Clock,
  RefreshCw,
  XCircle,
  CheckCircle2,
  User,
  Briefcase,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending", Icon: Clock },
  { value: "in-progress", label: "In Progress", Icon: RefreshCw },
  { value: "completed", label: "Completed", Icon: CheckCircle2 },
  { value: "cancelled", label: "Cancelled", Icon: XCircle },
];

const EMPTY_FORM = {
  title: "",
  description: "",
  status: "pending",
  dueDate: "",
  assignedTo: "",
  leadId: "",
};

export default function CreateTaskModal({
  isOpen,
  onClose,
  onSubmit,
  editTask = null,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [users, setUsers] = useState([]);
  const [leads, setLeads] = useState([]);

  // Fetch employees for the assignee dropdown
  useEffect(() => {
    if (!isOpen) return;
    fetch(`${API_BASE_URL}/employees`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken") || ""}`,
      },
    })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.data)) setUsers(data.data);
        else if (Array.isArray(data)) setUsers(data);
      })
      .catch(() => {});

    // Fetch leads for the lead dropdown
    fetch(`${API_BASE_URL}/leads/all`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken") || ""}`,
      },
    })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.data)) setLeads(data.data);
        else if (Array.isArray(data)) setLeads(data);
      })
      .catch(() => {});
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setErrors({});
      setForm(
        editTask
          ? {
              title: editTask.title,
              description: editTask.description || "",
              status: editTask.status,
              dueDate: editTask.dueDate ? editTask.dueDate.split("T")[0] : "",
              assignedTo: editTask.assignedTo?._id || "",
              leadId: editTask.leadId?._id || editTask.leadId || "",
            }
          : EMPTY_FORM,
      );
    }
  }, [isOpen, editTask]);

  if (!isOpen) return null;

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = "Task title is required.";
    if (form.title.trim().length > 200)
      next.title = "Task title cannot exceed 200 characters.";
    if (form.description.length > 1000)
      next.description = "Description cannot exceed 1000 characters.";
    return next;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    onSubmit(form);
  };

  const field = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg my-4">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {editTask ? "Edit Task" : "Create New Task"}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {editTask
                ? "Update the task details below."
                : "Fill in the details to create a new task."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-full hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 pt-5 pb-2 space-y-5">
          {/* Task Title */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-800">
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter task headline"
              value={form.title}
              onChange={(e) => field("title", e.target.value)}
              maxLength={200}
              className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.title
                  ? "border-red-400 bg-red-50"
                  : "border-slate-200 bg-slate-50 hover:border-slate-300"
              }`}
            />
            {errors.title && (
              <p className="text-xs text-red-500">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-800">
              Description
            </label>
            <textarea
              placeholder="Provide detailed instructions..."
              value={form.description}
              onChange={(e) => field("description", e.target.value)}
              rows={4}
              maxLength={1000}
              className={`w-full px-4 py-3 rounded-xl border bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-slate-700 placeholder:text-slate-400 resize-none transition-colors ${
                errors.description ? "border-red-400" : "border-slate-200"
              }`}
            />
            <div className="flex justify-between">
              {errors.description ? (
                <p className="text-xs text-red-500">{errors.description}</p>
              ) : (
                <span />
              )}
              <p className="text-xs text-slate-400 text-right">
                {form.description.length}/1000
              </p>
            </div>
          </div>

          {/* Assignee + Due Date */}
          <div className="grid grid-cols-2 gap-4">
            {/* Assignee */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-800">
                Assign To
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <select
                  value={form.assignedTo}
                  onChange={(e) => field("assignedTo", e.target.value)}
                  className="w-full appearance-none pl-9 pr-8 py-3 rounded-xl border border-slate-200 bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-700 transition-colors"
                >
                  <option value="">Unassigned</option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.firstName} {u.lastName}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Due Date */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-800">
                Due Date
              </label>
              <input
                type="date"
                value={form.dueDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => field("dueDate", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-700 transition-colors"
              />
            </div>
          </div>

          {/* Lead */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-800">
              Related Lead
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <select
                value={form.leadId}
                onChange={(e) => field("leadId", e.target.value)}
                className="w-full appearance-none pl-9 pr-8 py-3 rounded-xl border border-slate-200 bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-700 transition-colors"
              >
                <option value="">No lead</option>
                {leads.map((l) => (
                  <option key={l._id} value={l._id}>
                    {l.name} — {l.email}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Status toggle buttons */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-800">
              Status
            </label>
            <div className="flex gap-2">
              {STATUS_OPTIONS.map(({ value, label, Icon }) => {
                const isSelected = form.status === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => field("status", value)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                      isSelected
                        ? "border-blue-500 text-blue-600 bg-white shadow-sm"
                        : "border-slate-200 text-slate-500 bg-white hover:border-slate-300 hover:text-slate-700"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 mt-2 flex justify-end gap-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            {editTask ? "Save Changes" : "Create Task"}
          </button>
        </div>
      </div>
    </div>
  );
}
