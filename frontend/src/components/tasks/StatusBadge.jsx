import React from "react";

const STATUS_CONFIG = {
  pending: { cls: "bg-yellow-100 text-yellow-700", label: "Pending" },
  "in-progress": { cls: "bg-blue-100 text-blue-700", label: "In Progress" },
  completed: { cls: "bg-green-100 text-green-700", label: "Completed" },
  cancelled: { cls: "bg-red-100 text-red-600", label: "Cancelled" },
};

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] ?? {
    cls: "bg-gray-100 text-gray-600",
    label: status,
  };
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${config.cls}`}
    >
      {config.label}
    </span>
  );
}
