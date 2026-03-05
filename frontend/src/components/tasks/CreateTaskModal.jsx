import React, { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";

const ASSIGNEE_OPTIONS = [
  "John Doe",
  "Sarah Williams",
  "Mark Stevenson",
  "Emma Davis",
  "Alex Thompson",
  "Ryan Parker",
  "Olivia Chen",
];
const STATUS_OPTIONS = ["Todo", "In Progress", "Review", "Completed"];
const PRIORITY_OPTIONS = ["Low", "Medium", "High", "Critical"];

const EMPTY_FORM = {
  title: "",
  description: "",
  assignee: "",
  status: "Todo",
  dueDate: "",
  priority: "Medium",
};

export default function CreateTaskModal({
  isOpen,
  onClose,
  onSubmit,
  editTask = null,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setErrors({});
      setForm(
        editTask
          ? {
              title: editTask.title,
              description: editTask.description,
              assignee: editTask.assignee.name,
              status: editTask.status,
              dueDate: editTask.dueDateRaw ?? "",
              priority: editTask.priority ?? "Medium",
            }
          : EMPTY_FORM,
      );
    }
  }, [isOpen, editTask]);

  if (!isOpen) return null;

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = "Task title is required.";
    return next;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    onSubmit(form);
    onClose();
  };

  const field = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl my-4">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {editTask ? "Edit Task" : "Create New Task"}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {editTask
                ? "Update the task details below."
                : "Add a new task to your project board."}
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
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Title */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-sm font-semibold text-slate-800">
                Task Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Fix login bug on Safari"
                value={form.title}
                onChange={(e) => field("title", e.target.value)}
                className={`w-full px-4 py-2.5 rounded-lg border text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.title ? "border-red-400 bg-red-50" : "border-slate-200"
                }`}
              />
              {errors.title && (
                <p className="text-xs text-red-500">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-sm font-semibold text-slate-800">
                Description
              </label>
              <textarea
                placeholder="Describe what needs to be done..."
                value={form.description}
                onChange={(e) => field("description", e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-slate-700 placeholder:text-slate-400 resize-none"
              />
            </div>

            {/* Assignee */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-800">
                Assignee
              </label>
              <div className="relative">
                <select
                  value={form.assignee}
                  onChange={(e) => field("assignee", e.target.value)}
                  className="w-full appearance-none px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-700 bg-white"
                >
                  <option value="">Select assignee</option>
                  {ASSIGNEE_OPTIONS.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-800">
                Status
              </label>
              <div className="relative">
                <select
                  value={form.status}
                  onChange={(e) => field("status", e.target.value)}
                  className="w-full appearance-none px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-700 bg-white"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s}>{s}</option>
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
                onChange={(e) => field("dueDate", e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-700"
              />
            </div>

            {/* Priority */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-800">
                Priority
              </label>
              <div className="relative">
                <select
                  value={form.priority}
                  onChange={(e) => field("priority", e.target.value)}
                  className="w-full appearance-none px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-700 bg-white"
                >
                  {PRIORITY_OPTIONS.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex justify-end gap-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
          >
            {editTask ? "Save Changes" : "Create Task"}
          </button>
        </div>
      </div>
    </div>
  );
}
