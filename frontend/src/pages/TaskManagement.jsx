import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Search,
  Download,
  Plus,
  SlidersHorizontal,
  User,
  ChevronDown,
  Pencil,
  Trash2,
  X,
  ClipboardList,
  Loader2,
  AlertCircle,
  Briefcase,
} from "lucide-react";
import StatusBadge from "../components/tasks/StatusBadge";
import Pagination from "../components/tasks/Pagination";
import CreateTaskModal from "../components/tasks/CreateTaskModal";
import DeleteConfirmModal from "../components/tasks/DeleteConfirmModal";
import Toast from "../components/tasks/Toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getPageSize = () => {
  const w = window.innerWidth;
  if (w < 640) return 5; // mobile
  if (w < 1024) return 8; // tablet
  return 7; // desktop
};

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("userToken") || ""}`,
});

const formatDisplayDate = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const shortId = (id) => (id ? `#${id.slice(-6).toUpperCase()}` : "");

// ─── Component ────────────────────────────────────────────────────────────────

export default function TaskManagement() {
  const [tasks, setTasks] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const isAdmin = localStorage.getItem("userRole") === "admin";

  const [itemsPerPage, setItemsPerPage] = useState(getPageSize);

  // Re-calculate page size on window resize
  useEffect(() => {
    const handleResize = () => {
      const next = getPageSize();
      setItemsPerPage((prev) => {
        if (prev !== next) {
          setCurrentPage(1);
          return next;
        }
        return prev;
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ── Fetch tasks from API ──────────────────────────────────────────────────

  const fetchTasks = useCallback(async (page = 1, status = "all", limit) => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        page,
        limit: limit ?? getPageSize(),
      });
      if (status && status !== "all") params.set("status", status);

      const res = await fetch(`${API_BASE_URL}/tasks?${params}`, {
        headers: authHeaders(),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to fetch tasks");
        return;
      }

      setTasks(data.tasks || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks(currentPage, statusFilter, itemsPerPage);
  }, [currentPage, statusFilter, itemsPerPage, fetchTasks]);

  // ── Local search + assignee filter over the loaded page ──────────────────

  const uniqueAssignees = useMemo(() => {
    const names = tasks
      .filter((t) => t.assignedTo?.firstName)
      .map((t) => `${t.assignedTo.firstName} ${t.assignedTo.lastName}`);
    return [...new Set(names)].sort();
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    const q = search.toLowerCase();
    return tasks.filter((t) => {
      const matchSearch =
        !q ||
        t.title.toLowerCase().includes(q) ||
        (t.description || "").toLowerCase().includes(q) ||
        shortId(t._id).toLowerCase().includes(q);
      const matchAssignee =
        assigneeFilter === "All" ||
        `${t.assignedTo?.firstName} ${t.assignedTo?.lastName}` ===
          assigneeFilter;
      return matchSearch && matchAssignee;
    });
  }, [tasks, search, assigneeFilter]);

  const hasFilters =
    search || statusFilter !== "all" || assigneeFilter !== "All";

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleStatusFilter = (v) => {
    setStatusFilter(v);
    setCurrentPage(1);
    setAssigneeFilter("All");
  };

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setAssigneeFilter("All");
    setCurrentPage(1);
  };

  const openCreate = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEdit = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleTaskSubmit = async (form) => {
    setSaving(true);
    try {
      const body = {
        title: form.title,
        description: form.description || undefined,
        status: form.status,
        dueDate: form.dueDate || undefined,
        assignedTo: form.assignedTo || undefined,
        leadId: form.leadId || undefined,
      };

      const url = editingTask
        ? `${API_BASE_URL}/tasks/${editingTask._id}`
        : `${API_BASE_URL}/tasks`;
      const method = editingTask ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: authHeaders(),
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        setToast({
          type: "error",
          message: "Operation failed",
          subMessage: data.message || "Something went wrong.",
        });
        return;
      }

      setToast({
        message: editingTask ? "Task updated" : "Task created",
        subMessage: editingTask
          ? "Task has been updated successfully."
          : "New task has been created.",
      });
      closeModal();
      fetchTasks(currentPage, statusFilter);
    } catch {
      setToast({
        type: "error",
        message: "Network error",
        subMessage: "Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (task) => setDeletingTask(task);

  const confirmDelete = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/tasks/${deletingTask._id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      const data = await res.json();

      if (!res.ok) {
        setToast({
          type: "error",
          message: "Delete failed",
          subMessage: data.message || "Something went wrong.",
        });
        return;
      }

      setToast({
        message: "Task deleted",
        subMessage: "The task has been permanently removed.",
      });
      setDeletingTask(null);
      const newTotalPages = Math.max(1, Math.ceil((total - 1) / itemsPerPage));
      const safePage = Math.min(currentPage, newTotalPages);
      if (safePage !== currentPage) {
        setCurrentPage(safePage);
      } else {
        fetchTasks(currentPage, statusFilter);
      }
    } catch {
      setToast({
        type: "error",
        message: "Network error",
        subMessage: "Please try again.",
      });
    }
  };

  const cancelDelete = () => setDeletingTask(null);

  const handleExport = () => {
    const headers = [
      "Task ID",
      "Title",
      "Description",
      "Assignee",
      "Assignee Email",
      "Status",
      "Due Date",
      "Related Lead",
      "Lead Email",
    ];
    const rows = filteredTasks.map((t) => [
      t._id,
      t.title,
      t.description || "",
      t.assignedTo
        ? `${t.assignedTo.firstName} ${t.assignedTo.lastName}`
        : "Unassigned",
      t.assignedTo?.email || "",
      t.status,
      formatDisplayDate(t.dueDate),
      t.leadId?.name || "",
      t.leadId?.email || "",
    ]);
    const csv = [headers, ...rows]
      .map((row) =>
        row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tasks-export.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ── Render ────────────────────────────────────────────────────────────────

  const colSpan = isAdmin ? 7 : 6;

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* ── Page Header ── */}
          <div className="p-5 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Task Management
              </h1>
              <p className="text-slate-500 mt-1 text-sm">
                {loading
                  ? "Loading…"
                  : total > 0
                    ? `${total} task${total !== 1 ? "s" : ""} total`
                    : "Organize, track, and manage your team tasks efficiently."}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              <button
                onClick={handleExport}
                disabled={loading || filteredTasks.length === 0}
                className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
              {isAdmin && (
                <button
                  onClick={openCreate}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                  Create New Task
                </button>
              )}
            </div>
          </div>

          {/* ── Filters ── */}
          <div className="px-5 sm:px-6 py-4 border-b border-slate-200 bg-slate-50/50">
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 min-w-50 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search tasks by ID, title, or description…"
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-slate-700 placeholder:text-slate-400"
                />
              </div>

              {/* Status filter (server-side) */}
              <div className="relative">
                <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <select
                  value={statusFilter}
                  onChange={(e) => handleStatusFilter(e.target.value)}
                  className="appearance-none pl-9 pr-8 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-700 cursor-pointer"
                >
                  <option value="all">Status: All</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>

              {/* Assignee filter (derived from loaded page) */}
              {uniqueAssignees.length > 0 && (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <select
                    value={assigneeFilter}
                    onChange={(e) => setAssigneeFilter(e.target.value)}
                    className="appearance-none pl-9 pr-8 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-700 cursor-pointer"
                  >
                    <option value="All">Assignee: All</option>
                    {uniqueAssignees.map((name) => (
                      <option key={name}>{name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              )}

              {/* Clear filters */}
              {hasFilters && (
                <button
                  onClick={handleClearFilters}
                  className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* ── Error banner ── */}
          {error && (
            <div className="px-6 py-3 bg-red-50 border-b border-red-100 flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {/* ── Table ── */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                  <th className="px-4 sm:px-6 py-4 font-semibold">Task ID</th>
                  <th className="px-4 sm:px-6 py-4 font-semibold">
                    Title &amp; Description
                  </th>
                  <th className="px-4 sm:px-6 py-4 font-semibold hidden sm:table-cell">
                    Assignee
                  </th>
                  <th className="px-4 sm:px-6 py-4 font-semibold">Status</th>
                  <th className="px-4 sm:px-6 py-4 font-semibold hidden md:table-cell">
                    Due Date
                  </th>
                  <th className="px-4 sm:px-6 py-4 font-semibold hidden lg:table-cell">
                    Related Lead
                  </th>
                  {isAdmin && (
                    <th className="px-4 sm:px-6 py-4 font-semibold text-right">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={colSpan} className="px-6 py-16 text-center">
                      <Loader2 className="h-8 w-8 mx-auto text-blue-500 animate-spin mb-3" />
                      <p className="text-sm text-slate-500">Loading tasks…</p>
                    </td>
                  </tr>
                ) : filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={colSpan} className="px-6 py-16 text-center">
                      <ClipboardList className="h-10 w-10 mx-auto text-slate-300 mb-3" />
                      <p className="text-sm font-medium text-slate-500">
                        No tasks found
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {hasFilters
                          ? "Try adjusting your search or filters."
                          : isAdmin
                            ? "Create your first task to get started."
                            : "No tasks have been assigned yet."}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task) => (
                    <tr
                      key={task._id}
                      className="hover:bg-slate-50/60 transition-colors group"
                    >
                      {/* Task ID */}
                      <td className="px-4 sm:px-6 py-4">
                        <span className="text-sm font-semibold text-blue-600 whitespace-nowrap font-mono">
                          {shortId(task._id)}
                        </span>
                      </td>

                      {/* Title & Description */}
                      <td className="px-4 sm:px-6 py-4 max-w-55 sm:max-w-xs lg:max-w-sm">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-xs text-slate-400 mt-0.5 truncate hidden sm:block">
                            {task.description}
                          </p>
                        )}
                      </td>

                      {/* Assignee */}
                      <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                        {task.assignedTo ? (
                          <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                              <span className="text-xs font-bold text-blue-600">
                                {task.assignedTo.firstName
                                  ?.charAt(0)
                                  .toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm text-slate-700 whitespace-nowrap">
                                {task.assignedTo.firstName}{" "}
                                {task.assignedTo.lastName}
                              </p>
                              <p className="text-xs text-slate-400 truncate max-w-35">
                                {task.assignedTo.email}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400 italic">
                            Unassigned
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 sm:px-6 py-4">
                        <StatusBadge status={task.status} />
                      </td>

                      {/* Due Date */}
                      <td className="px-4 sm:px-6 py-4 hidden md:table-cell">
                        <span className="text-sm text-slate-500 whitespace-nowrap">
                          {formatDisplayDate(task.dueDate)}
                        </span>
                      </td>

                      {/* Related Lead */}
                      <td className="px-4 sm:px-6 py-4 hidden lg:table-cell">
                        {task.leadId ? (
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                              <Briefcase className="h-3.5 w-3.5 text-purple-600" />
                            </div>
                            <div>
                              <p className="text-sm text-slate-700 whitespace-nowrap">
                                {task.leadId.name}
                              </p>
                              {task.leadId.email && (
                                <p className="text-xs text-slate-400 truncate max-w-35">
                                  {task.leadId.email}
                                </p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400 italic">
                            None
                          </span>
                        )}
                      </td>

                      {/* Actions (admin only) */}
                      {isAdmin && (
                        <td className="px-4 sm:px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1 text-slate-400">
                            <button
                              onClick={() => openEdit(task)}
                              title="Edit task"
                              className="p-1.5 rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(task)}
                              title="Delete task"
                              className="p-1.5 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ── Pagination ── */}
          {total > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={total}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>

      {/* ── Modals ── */}
      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleTaskSubmit}
        editTask={editingTask}
        saving={saving}
      />

      <DeleteConfirmModal
        task={deletingTask}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      {toast && (
        <Toast
          message={toast.message}
          subMessage={toast.subMessage}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
