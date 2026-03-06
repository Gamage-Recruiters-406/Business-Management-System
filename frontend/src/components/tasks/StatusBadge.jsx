import React from "react";

const STATUS_CONFIG = {
  "In Progress": "bg-blue-100 text-blue-700",
  Review: "bg-amber-100 text-amber-700",
  Completed: "bg-green-100 text-green-700",
  Todo: "bg-gray-100 text-gray-600",
};

export default function StatusBadge({ status }) {
  const cls = STATUS_CONFIG[status] ?? "bg-gray-100 text-gray-600";
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${cls}`}
    >
      {status}
    </span>
  );
}
