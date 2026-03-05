import React, { useState, useMemo } from "react";
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
} from "lucide-react";
import StatusBadge from "../components/tasks/StatusBadge";
import Pagination from "../components/tasks/Pagination";
import CreateTaskModal from "../components/tasks/CreateTaskModal";

// ─── Static seed data ────────────────────────────────────────────────────────

const AVATARS = {
  "John Doe": "https://i.pravatar.cc/150?u=20",
  "Sarah Williams": "https://i.pravatar.cc/150?u=21",
  "Mark Stevenson": "https://i.pravatar.cc/150?u=22",
  "Emma Davis": "https://i.pravatar.cc/150?u=23",
  "Alex Thompson": "https://i.pravatar.cc/150?u=24",
  "Ryan Parker": "https://i.pravatar.cc/150?u=25",
  "Olivia Chen": "https://i.pravatar.cc/150?u=26",
};

const ASSIGNEES_LIST = [
  { name: "John Doe", avatar: AVATARS["John Doe"] },
  { name: "Sarah Williams", avatar: AVATARS["Sarah Williams"] },
  { name: "Mark Stevenson", avatar: AVATARS["Mark Stevenson"] },
  { name: "Emma Davis", avatar: AVATARS["Emma Davis"] },
  { name: "Alex Thompson", avatar: AVATARS["Alex Thompson"] },
  { name: "Ryan Parker", avatar: AVATARS["Ryan Parker"] },
];

const TEMPLATES = [
  {
    title: "Prepare client report",
    description: "Compile financial results and Q4 projections for Smith & Co.",
  },
  {
    title: "Update documentation",
    description:
      "Revise the API integration guides for the upcoming v2.0 release.",
  },
  {
    title: "Fix login bug",
    description:
      "Users are unable to reset passwords on Safari mobile browser.",
  },
  {
    title: "Design system audit",
    description:
      "Check all color tokens for accessibility compliance (WCAG 2.1).",
  },
  {
    title: "Q4 Planning meeting",
    description:
      "Coordinate agenda and participants for next week's leadership offsite.",
  },
  {
    title: "Onboard new developer",
    description:
      "Set up workstation and access for the incoming backend engineer.",
  },
  {
    title: "Performance review",
    description:
      "Complete Q3 performance evaluations for the engineering team.",
  },
  {
    title: "Database optimisation",
    description:
      "Optimise slow queries identified in the production monitoring dashboard.",
  },
  {
    title: "Write unit tests",
    description:
      "Achieve 80 % code coverage for the new payment processing module.",
  },
  {
    title: "Deploy v2.1 release",
    description:
      "Coordinate with DevOps for the production deployment of version 2.1.",
  },
  {
    title: "Security audit",
    description:
      "Review access controls and identify potential vulnerabilities in the API.",
  },
  {
    title: "Mobile app testing",
    description:
      "Conduct cross-device testing for the new mobile application features.",
  },
  {
    title: "Customer feedback analysis",
    description: "Analyse survey responses from the latest product release.",
  },
  {
    title: "Infrastructure upgrade",
    description:
      "Migrate services to the new cloud infrastructure environment.",
  },
  {
    title: "Code refactoring",
    description: "Refactor legacy authentication module to modern standards.",
  },
  {
    title: "Sprint retrospective",
    description:
      "Facilitate the team retrospective for the completed sprint cycle.",
  },
  {
    title: "API rate limiting",
    description: "Implement rate limiting on public-facing API endpoints.",
  },
  {
    title: "UI component library",
    description: "Build reusable UI components for the design system.",
  },
  {
    title: "Data migration script",
    description:
      "Write and test migration scripts for the new database schema.",
  },
  {
    title: "CI/CD pipeline setup",
    description:
      "Configure automated testing and deployment pipeline for the new service.",
  },
  {
    title: "User acceptance testing",
    description:
      "Coordinate UAT sessions with key stakeholders for the new features.",
  },
];

const STATUSES = [
  "In Progress",
  "Review",
  "Completed",
  "Todo",
  "In Progress",
  "Todo",
];
const PRIORITIES = ["Medium", "High", "Low", "Critical", "Medium", "High"];
const DUE_DATES = [
  "Oct 24, 2023",
  "Oct 25, 2023",
  "Oct 22, 2023",
  "Oct 28, 2023",
  "Nov 02, 2023",
  "Nov 05, 2023",
  "Nov 08, 2023",
  "Nov 10, 2023",
  "Nov 12, 2023",
  "Nov 15, 2023",
  "Nov 18, 2023",
  "Nov 20, 2023",
  "Nov 22, 2023",
  "Nov 25, 2023",
  "Nov 28, 2023",
  "Dec 01, 2023",
  "Dec 03, 2023",
  "Dec 05, 2023",
  "Dec 08, 2023",
  "Dec 10, 2023",
  "Dec 12, 2023",
];

const generateInitialTasks = () =>
  Array.from({ length: 42 }, (_, i) => ({
    id: `TASK-${1024 + i}`,
    ...TEMPLATES[i % TEMPLATES.length],
    assignee: ASSIGNEES_LIST[i % ASSIGNEES_LIST.length],
    status: STATUSES[i % STATUSES.length],
    priority: PRIORITIES[i % PRIORITIES.length],
    dueDate: DUE_DATES[i % DUE_DATES.length],
    dueDateRaw: "",
  }));

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 5;

const formatDisplayDate = (raw) => {
  if (!raw) return "";
  const d = new Date(`${raw}T00:00:00`);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function TaskManagement() {
  const [tasks, setTasks] = useState(() => generateInitialTasks());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [assigneeFilter, setAssigneeFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Unique assignee names for the filter dropdown
  const uniqueAssignees = useMemo(
    () => [...new Set(tasks.map((t) => t.assignee.name))].sort(),
    [tasks],
  );

  // Filtered task list
  const filteredTasks = useMemo(() => {
    const q = search.toLowerCase();
    return tasks.filter((t) => {
      const matchSearch =
        !q ||
        t.id.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q);
      const matchStatus = statusFilter === "All" || t.status === statusFilter;
      const matchAssignee =
        assigneeFilter === "All" || t.assignee.name === assigneeFilter;
      return matchSearch && matchStatus && matchAssignee;
    });
  }, [tasks, search, statusFilter, assigneeFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTasks.length / ITEMS_PER_PAGE),
  );
  const safePage = Math.min(currentPage, totalPages);
  const paginatedTasks = filteredTasks.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE,
  );

  const hasFilters =
    search || statusFilter !== "All" || assigneeFilter !== "All";

  // ── Handlers ────────────────────────────────────────────────────────────────

  const resetPage = () => setCurrentPage(1);

  const handleSearch = (v) => {
    setSearch(v);
    resetPage();
  };
  const handleStatus = (v) => {
    setStatusFilter(v);
    resetPage();
  };
  const handleAssignee = (v) => {
    setAssigneeFilter(v);
    resetPage();
  };
  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setAssigneeFilter("All");
    resetPage();
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

  const handleTaskSubmit = (form) => {
    if (editingTask) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editingTask.id
            ? {
                ...t,
                title: form.title,
                description: form.description,
                assignee: {
                  name: form.assignee,
                  avatar:
                    AVATARS[form.assignee] ??
                    `https://i.pravatar.cc/150?u=${form.assignee.length}`,
                },
                status: form.status,
                priority: form.priority,
                dueDate: form.dueDate
                  ? formatDisplayDate(form.dueDate)
                  : t.dueDate,
                dueDateRaw: form.dueDate,
              }
            : t,
        ),
      );
    } else {
      const newTask = {
        id: `TASK-${Date.now()}`,
        title: form.title,
        description: form.description,
        assignee: {
          name: form.assignee || "Unassigned",
          avatar: AVATARS[form.assignee] ?? "https://i.pravatar.cc/150?u=99",
        },
        status: form.status,
        priority: form.priority,
        dueDate: form.dueDate ? formatDisplayDate(form.dueDate) : "—",
        dueDateRaw: form.dueDate,
      };
      setTasks((prev) => [newTask, ...prev]);
      resetPage();
    }
  };

  const handleDelete = (taskId) => {
    if (window.confirm("Delete this task? This action cannot be undone.")) {
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    }
  };

  const handleExport = () => {
    const headers = [
      "Task ID",
      "Title",
      "Description",
      "Assignee",
      "Status",
      "Priority",
      "Due Date",
    ];
    const rows = filteredTasks.map((t) => [
      t.id,
      t.title,
      t.description,
      t.assignee.name,
      t.status,
      t.priority,
      t.dueDate,
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

  // ── Render ──────────────────────────────────────────────────────────────────

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
                Organize, track, and manage your team tasks efficiently.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
              <button
                onClick={openCreate}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
              >
                <Plus className="h-4 w-4" />
                Create New Task
              </button>
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
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search tasks by ID, title, or keywords..."
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-slate-700 placeholder:text-slate-400"
                />
              </div>

              {/* Status filter */}
              <div className="relative">
                <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <select
                  value={statusFilter}
                  onChange={(e) => handleStatus(e.target.value)}
                  className="appearance-none pl-9 pr-8 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-700 cursor-pointer"
                >
                  <option value="All">Status: All</option>
                  <option>In Progress</option>
                  <option>Review</option>
                  <option>Completed</option>
                  <option>Todo</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>

              {/* Assignee filter */}
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <select
                  value={assigneeFilter}
                  onChange={(e) => handleAssignee(e.target.value)}
                  className="appearance-none pl-9 pr-8 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-700 cursor-pointer"
                >
                  <option value="All">Assignee: All</option>
                  {uniqueAssignees.map((name) => (
                    <option key={name}>{name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>

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
                  <th className="px-4 sm:px-6 py-4 font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {paginatedTasks.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <ClipboardList className="h-10 w-10 mx-auto text-slate-300 mb-3" />
                      <p className="text-sm font-medium text-slate-500">
                        No tasks found
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Try adjusting your search or filters.
                      </p>
                    </td>
                  </tr>
                ) : (
                  paginatedTasks.map((task) => (
                    <tr
                      key={task.id}
                      className="hover:bg-slate-50/60 transition-colors group"
                    >
                      {/* Task ID */}
                      <td className="px-4 sm:px-6 py-4">
                        <span className="text-sm font-semibold text-blue-600 whitespace-nowrap">
                          {task.id}
                        </span>
                      </td>

                      {/* Title & Description */}
                      <td className="px-4 sm:px-6 py-4 max-w-55 sm:max-w-xs lg:max-w-sm">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {task.title}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5 truncate hidden sm:block">
                          {task.description}
                        </p>
                      </td>

                      {/* Assignee (hidden on xs) */}
                      <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={task.assignee.avatar}
                            alt={task.assignee.name}
                            className="h-8 w-8 rounded-full object-cover bg-slate-200 shrink-0"
                          />
                          <span className="text-sm text-slate-700 whitespace-nowrap">
                            {task.assignee.name}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 sm:px-6 py-4">
                        <StatusBadge status={task.status} />
                      </td>

                      {/* Due Date (hidden on xs & sm) */}
                      <td className="px-4 sm:px-6 py-4 hidden md:table-cell">
                        <span className="text-sm text-slate-500 whitespace-nowrap">
                          {task.dueDate}
                        </span>
                      </td>

                      {/* Actions */}
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
                            onClick={() => handleDelete(task.id)}
                            title="Delete task"
                            className="p-1.5 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ── Pagination ── */}
          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            totalItems={filteredTasks.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* ── Modal ── */}
      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleTaskSubmit}
        editTask={editingTask}
      />
    </div>
  );
}
