import React from "react";
import { useNavigate } from "react-router-dom";
import { Users, ClipboardList } from "lucide-react";

const CARDS = [
  {
    to: "/employees",
    icon: Users,
    label: "Employee Management",
    description: "Manage your workforce, roles, and organisational structure.",
    color: "emerald",
  },
  {
    to: "/tasks",
    icon: ClipboardList,
    label: "Task Management",
    description: "Organise, track, and manage your team tasks efficiently.",
    color: "blue",
  },
  {
    to: "/leads",
    icon: Users,
    label: "Lead Management",
    description: "Manage and track your sales pipeline prospects.",
    color: "darkblue",
  },
];

const COLOR = {
  emerald: {
    icon: "bg-emerald-100 text-emerald-600",
    btn: "bg-emerald-600 hover:bg-emerald-700",
    border: "hover:border-emerald-300",
  },
  blue: {
    icon: "bg-blue-100 text-blue-600",
    btn: "bg-blue-600 hover:bg-blue-700",
    border: "hover:border-blue-300",
  },
  darkblue: {
    icon: "bg-blue-100 text-blue-800",
    btn: "bg-blue-800 hover:bg-blue-950",
    border: "hover:border-blue-300",
  },
};

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
      {/* Heading */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Business Management System
        </h1>
        <p className="mt-4 text-slate-500 text-base sm:text-lg max-w-xl mx-auto">
          Select a module below to get started.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
        {CARDS.map(({ to, icon: Icon, label, description, color }) => {
          const c = COLOR[color];
          return (
            <div
              key={to}
              className={`bg-white rounded-2xl border border-slate-200 ${c.border} shadow-sm p-8 flex flex-col items-center text-center gap-5 transition-all duration-200 hover:shadow-md`}
            >
              <div className={`p-4 rounded-2xl ${c.icon}`}>
                <Icon className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">{label}</h2>
                <p className="text-sm text-slate-500 mt-1">{description}</p>
              </div>
              <button
                onClick={() => navigate(to)}
                className={`mt-auto w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-colors ${c.btn}`}
              >
                Open
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
