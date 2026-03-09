import React from "react";
import { AlertTriangle, X } from "lucide-react";

export default function DeleteConfirmModal({ task, onConfirm, onCancel }) {
  if (!task) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        {/* Icon + Title row */}
        <div className="flex items-start gap-4">
          <div className="shrink-0 flex items-center justify-center h-11 w-11 rounded-full bg-red-100">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-slate-900">
              Delete this task?
            </h2>
            <p className="text-sm text-slate-500 mt-1 leading-relaxed">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-700">
                &ldquo;{task.title}&rdquo;
              </span>
              ? This action cannot be undone and the data will be permanently
              removed.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-sm"
          >
            Delete Task
          </button>
        </div>
      </div>
    </div>
  );
}
