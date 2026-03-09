import React, { useState, useEffect, useCallback } from 'react';
import {
  AlertTriangle,
  ArrowUpRight,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { EmployeeModal, OverdueModal } from './ReportModals';

axios.defaults.withCredentials = true;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Donut Chart Component
const DonutChart = ({ completed, inProgress, pending, total }) => {
  const r = 54;
  const cx = 70;
  const cy = 70;
  const circumference = 2 * Math.PI * r;

  const segments = [
    { pct: completed, color: '#2563eb' },
    { pct: inProgress, color: '#fbbf24' },
    { pct: pending, color: '#f87171' },
  ];

  let offset = 0;

  return (
    <svg
      width="140"
      height="140"
      viewBox="0 0 140 140"
      className="w-32 h-32 md:w-40 md:h-40"
    >
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth="14"
      />
      {segments.map((seg, i) => {
        const dash = (seg.pct / 100) * circumference;
        const gap = circumference - dash;
        const el = (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth="14"
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-offset}
            strokeLinecap="butt"
            style={{
              transform: 'rotate(-90deg)',
              transformOrigin: `${cx}px ${cy}px`,
              transition: 'stroke-dasharray .5s ease',
            }}
          />
        );
        offset += dash;
        return el;
      })}
      <text
        x={cx}
        y={cy - 6}
        textAnchor="middle"
        className="text-2xl md:text-3xl font-bold fill-gray-900"
      >
        {total}
      </text>
      <text
        x={cx}
        y={cy + 14}
        textAnchor="middle"
        className="text-[9px] md:text-xs fill-gray-400 tracking-wide"
      >
        TOTAL TASKS
      </text>
    </svg>
  );
};

// Bar Chart Component
const BarChart = ({ data }) => {
  const max = Math.max(...data.map((d) => d.count), 1);
  const yTicks = [0, 1000, 2000, 3000];

  return (
    <div className="flex gap-0 h-36 md:h-48 items-end relative pl-9 md:pl-10">
      <div className="absolute left-0 top-0 bottom-6 flex flex-col-reverse justify-between w-7 md:w-9">
        {yTicks.map((t) => (
          <span
            key={t}
            className="text-[9px] md:text-xs text-gray-400 leading-none"
          >
            {t === 0 ? '0' : `${t / 1000}k`}
          </span>
        ))}
      </div>

      {data.map((d, i) => {
        const heightPct = max > 0 ? (d.count / max) * 100 : 2;
        const isHighlighted = i === data.length - 2;

        return (
          <div
            key={d.label}
            className="flex-1 flex flex-col items-center justify-end h-full pb-6 md:pb-7"
          >
            <div
              title={`${d.count} leads`}
              className={`w-3/5 md:w-4/6 rounded-t transition-all duration-400 cursor-default ${
                isHighlighted ? 'bg-blue-700' : 'bg-blue-300'
              }`}
              style={{ height: `${Math.max(heightPct, 2)}%` }}
            />
            <span className="text-xs md:text-sm text-gray-500 mt-1.5 absolute bottom-0">
              {d.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// Main Component
const ReportsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [leads, setLeads] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [monthlyLeads, setMonthlyLeads] = useState([]);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isOverdueModalOpen, setIsOverdueModalOpen] = useState(false);

  const navigate = useNavigate();

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [leadsRes, tasksRes, employeesRes] = await Promise.allSettled([
        axios.get(`${API_BASE_URL}/leads/all`),
        axios.get(`${API_BASE_URL}/tasks`),
        axios.get(`${API_BASE_URL}/employees`),
      ]);

      const leadsData =
        leadsRes.status === 'fulfilled' && leadsRes.value.data?.success
          ? leadsRes.value.data.data || []
          : [];

      const tasksData =
        tasksRes.status === 'fulfilled' && tasksRes.value.data?.success
          ? tasksRes.value.data.tasks || []
          : tasksRes.status === 'fulfilled' && tasksRes.value.data?.data
            ? tasksRes.value.data.data
            : [];

      const employeesData =
        employeesRes.status === 'fulfilled' && employeesRes.value.data?.success
          ? employeesRes.value.data.data || []
          : employeesRes.status === 'fulfilled' &&
              employeesRes.value.data?.employees
            ? employeesRes.value.data.employees
            : [];

      setLeads(leadsData);
      setTasks(tasksData);
      setEmployees(employeesData);
      processMonthlyLeads(leadsData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load dashboard data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const processMonthlyLeads = (leadsData) => {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const cur = new Date().getMonth();
    const last6 = [];

    for (let i = 5; i >= 0; i--) {
      const idx = (cur - i + 12) % 12;
      last6.push({
        label: months[idx],
        count: 0,
        fullMonth: idx,
        year: new Date().getFullYear() - (idx > cur ? 1 : 0),
      });
    }

    leadsData.forEach((lead) => {
      if (!lead.createdAt) return;
      const d = new Date(lead.createdAt);
      const m = last6.find(
        (x) => x.fullMonth === d.getMonth() && x.year === d.getFullYear(),
      );
      if (m) m.count++;
    });

    setMonthlyLeads(last6);
  };

  const getTaskDistribution = () => {
    const total = tasks.length;
    if (!total) return { completed: 0, inProgress: 0, pending: 0 };

    const completed = tasks.filter((t) => t.status === 'completed').length;
    const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
    const pending = tasks.filter((t) => t.status === 'pending').length;
    const active = completed + inProgress + pending || 1;

    return {
      completed: Math.round((completed / active) * 100),
      inProgress: Math.round((inProgress / active) * 100),
      pending: Math.round((pending / active) * 100),
    };
  };

  const getEmployeePerformance = () => {
    if (!employees.length) return [];

    return employees
      .map((emp) => {
        const empTasks = tasks.filter((t) => {
          const assignedTo = t.assignedTo?._id ?? t.assignedTo;
          return assignedTo === emp._id;
        });
        const done = empTasks.filter((t) => t.status === 'completed').length;
        const perf = empTasks.length
          ? Math.round((done / empTasks.length) * 100)
          : 0;

        return {
          id: emp._id,
          name:
            `${emp.firstName || ''} ${emp.lastName || ''}`.trim() || 'Unknown',
          role: emp.role || 'employee',
          perf,
          tasks: empTasks.length,
          initials:
            `${emp.firstName?.[0] || ''}${emp.lastName?.[0] || ''}`.toUpperCase() ||
            '?',
        };
      })
      .sort((a, b) => b.perf - a.perf);
  };

  const getOverdueTasks = () => {
    if (!tasks.length) return [];

    return tasks
      .filter(
        (t) =>
          t.dueDate &&
          t.status !== 'completed' &&
          t.status !== 'cancelled' &&
          new Date(t.dueDate) < new Date(),
      )
      .map((task) => {
        const days = Math.floor(
          (Date.now() - new Date(task.dueDate)) / 86400000,
        );
        const emp =
          typeof task.assignedTo === 'object'
            ? task.assignedTo
            : employees.find((e) => e._id === task.assignedTo);

        return {
          id: task._id,
          title: task.title,
          due:
            days === 0
              ? 'Today'
              : days === 1
                ? '1 day ago'
                : `${days} days ago`,
          priority: days > 3 ? 'HIGH' : days > 1 ? 'MEDIUM' : 'LOW',
          assignee: emp
            ? `${emp.firstName || ''} ${emp.lastName || ''}`.trim()
            : 'Unassigned',
        };
      })
      .sort((a, b) => {
        const priorityWeight = { HIGH: 3, MEDIUM: 2, LOW: 1 };
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      });
  };

  const getLeadChange = () => {
    if (!leads.length) return '0';

    const now = new Date();
    const m1 = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const m2 = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    const last = leads.filter(
      (l) => l.createdAt && new Date(l.createdAt) >= m1,
    ).length;
    const prev = leads.filter(
      (l) =>
        l.createdAt &&
        new Date(l.createdAt) >= m2 &&
        new Date(l.createdAt) < m1,
    ).length;

    if (!prev && last) return '+100';
    if (!prev) return '0';
    return (((last - prev) / prev) * 100).toFixed(1);
  };

  const dist = getTaskDistribution();
  const empPerf = getEmployeePerformance();
  const overdue = getOverdueTasks();
  const critical = overdue.filter((t) => t.priority === 'HIGH').length;
  const leadChange = getLeadChange();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading dashboard data…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center bg-white p-6 md:p-8 rounded-xl shadow-sm w-full max-w-md">
          <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <p className="text-red-500 mb-4 text-sm">{error}</p>
          <button
            onClick={() => fetchDashboardData()}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Employee Modal */}
      <EmployeeModal
        isOpen={isEmployeeModalOpen}
        onClose={() => setIsEmployeeModalOpen(false)}
        employees={empPerf}
      />

      {/* Overdue Modal */}
      <OverdueModal
        isOpen={isOverdueModalOpen}
        onClose={() => setIsOverdueModalOpen(false)}
        tasks={overdue}
      />

      {/* Main Content */}
      <div className="p-3 md:p-10">
        {/* Header */}
        <div className="mb-4 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900">
            Admin Reports
          </h1>
          <p className="text-xs md:text-base text-gray-500 mt-1">
            Comprehensive overview of business performance and task metrics.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {/* Monthly Leads */}
          <div className="bg-white rounded-xl p-4 md:p-8 border border-gray-200 shadow-md">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-sm md:text-lg font-bold text-gray-900">
                  Monthly Leads Report
                </h3>
                <p className="text-[10px] md:text-sm text-gray-400 mt-0.5">
                  Lead acquisition performance
                </p>
              </div>
              <div className="text-right">
                <span className="text-xl md:text-3xl font-extrabold text-blue-600">
                  {leads.length.toLocaleString()}
                </span>
                <div className="flex items-center justify-end gap-0.5 mt-0.5">
                  <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4 text-green-500" />
                  <span className="text-[10px] md:text-sm text-green-500 font-semibold">
                    +{leadChange}%
                  </span>
                </div>
              </div>
            </div>
            <BarChart data={monthlyLeads} />
          </div>

          {/* Tasks Completed */}
          <div className="bg-white rounded-xl p-4 md:p-8 border border-gray-200 shadow-md">
            <h3 className="text-sm md:text-lg font-bold text-gray-900 mb-1">
              Tasks Completed Report
            </h3>
            <p className="text-[10px] md:text-sm text-gray-400 mb-3 md:mb-6">
              Distribution of current task status
            </p>
            <div className="flex items-center justify-between flex-col sm:flex-row gap-4 md:gap-6">
              <DonutChart
                completed={dist.completed}
                inProgress={dist.inProgress}
                pending={dist.pending}
                total={tasks.length}
              />
              <div className="flex flex-row sm:flex-col gap-3 md:gap-5 w-full sm:w-auto justify-center">
                {[
                  {
                    label: 'COMPLETED',
                    pct: dist.completed,
                    color: 'bg-blue-600',
                  },
                  {
                    label: 'IN PROGRESS',
                    pct: dist.inProgress,
                    color: 'bg-yellow-400',
                  },
                  { label: 'PENDING', pct: dist.pending, color: 'bg-red-400' },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="flex items-center gap-1 md:gap-2"
                  >
                    <div
                      className={`w-2 h-2 md:w-4 md:h-4 rounded-full ${s.color} flex-shrink-0`}
                    />
                    <div>
                      <div className="text-[8px] md:text-xs text-gray-400 tracking-wide">
                        {s.label}
                      </div>
                      <div className="text-sm md:text-xl font-bold text-gray-900 leading-tight">
                        {s.pct}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Employee Performance */}
          <div className="bg-white rounded-xl p-4 md:p-8 border border-gray-200 shadow-md">
            <div className="flex justify-between items-center mb-3 md:mb-6">
              <h3 className="text-sm md:text-lg font-bold text-gray-900">
                Employee Performance
              </h3>
              <button
                onClick={() => setIsEmployeeModalOpen(true)}
                className="text-xs md:text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-0.5"
              >
                View All <ChevronRight className="w-3 h-3 md:w-5 md:h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-3 md:gap-5">
              {empPerf.length > 0 ? (
                empPerf.slice(0, 5).map((emp) => (
                  <div
                    key={emp.id}
                    className="flex items-center gap-2 md:gap-4"
                  >
                    <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-gray-200 flex items-center justify-center text-[10px] md:text-sm font-semibold text-gray-700 flex-shrink-0">
                      {emp.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="text-xs md:text-base font-semibold text-gray-900 truncate">
                          {emp.name}
                        </span>
                        <span className="text-xs md:text-base font-bold text-blue-600 ml-2">
                          {emp.perf}%
                        </span>
                      </div>
                      <div className="h-1 md:h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${emp.perf}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-xs md:text-sm text-center py-4 md:py-6">
                  No employee data available
                </p>
              )}

              {empPerf.length > 5 && (
                <button
                  onClick={() => setIsEmployeeModalOpen(true)}
                  className="text-xs md:text-sm text-blue-600 hover:text-blue-800 font-medium mt-2 text-center"
                >
                  + {empPerf.length - 5} more employees
                </button>
              )}
            </div>
          </div>

          {/* Overdue Tasks */}
          <div className="bg-white rounded-xl p-4 md:p-8 border border-gray-200 shadow-md flex flex-col">
            <div className="flex justify-between items-center mb-3 md:mb-6">
              <h3 className="text-sm md:text-lg font-bold text-gray-900">
                Overdue Tasks Report
              </h3>
              <div className="flex items-center gap-2">
                {critical > 0 && (
                  <span className="text-[10px] md:text-sm font-bold text-red-500 bg-red-50 px-2 md:px-3 py-1 rounded tracking-wide">
                    {critical} CRITICAL
                  </span>
                )}
                <button
                  onClick={() => setIsOverdueModalOpen(true)}
                  className="text-xs md:text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-0.5"
                >
                  View All <ChevronRight className="w-3 h-3 md:w-5 md:h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-3 md:gap-5">
              {overdue.length > 0 ? (
                <>
                  {overdue.slice(0, 5).map((task) => (
                    <div
                      key={task.id}
                      className="pb-2 md:pb-4 border-b border-gray-100 last:border-0"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs md:text-base font-semibold text-gray-900">
                          {task.title}
                        </span>
                        <span
                          className={`text-[8px] md:text-sm font-bold px-1 md:px-3 py-0.5 rounded ml-2 flex-shrink-0 ${
                            task.priority === 'HIGH'
                              ? 'text-red-500 bg-red-50'
                              : task.priority === 'MEDIUM'
                                ? 'text-amber-600 bg-amber-50'
                                : 'text-gray-500 bg-gray-50'
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>
                      <p className="text-[10px] md:text-sm text-amber-600">
                        Due: {task.due}
                      </p>
                    </div>
                  ))}

                  {overdue.length > 5 && (
                    <button
                      onClick={() => setIsOverdueModalOpen(true)}
                      className="text-xs md:text-sm text-blue-600 hover:text-blue-800 font-medium mt-2 text-center"
                    >
                      + {overdue.length - 5} more overdue tasks
                    </button>
                  )}
                </>
              ) : (
                <p className="text-gray-400 text-xs md:text-sm text-center py-4 md:py-6">
                  No overdue tasks
                </p>
              )}
            </div>

            <button
              onClick={() => navigate('/tasks')}
              className="mt-3 md:mt-5 w-full py-2 md:py-3.5 bg-white text-gray-700 border border-gray-200 rounded-lg text-xs md:text-base font-medium hover:bg-gray-50 transition"
            >
              Go to Tasks Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsDashboard;
