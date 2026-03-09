import React from 'react';
import { X } from 'lucide-react';

// Base Modal Component with blur backdrop
export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Blurred Backdrop */}
      <div 
        className="fixed inset-0 backdrop-blur-md bg-black/30 transition-opacity"
        onClick={onClose}
      />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
          <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200">
            <h3 className="text-lg md:text-xl font-bold text-gray-900">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition p-1"
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
          <div className="p-4 md:p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
            {children}
          </div>
          <div className="border-t border-gray-200 p-4 md:p-6">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm md:text-base"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Employee Modal Component
export const EmployeeModal = ({ isOpen, onClose, employees }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`All Employees (${employees.length})`}
    >
      <div className="space-y-4">
        {employees.length > 0 ? (
          employees.map((emp) => (
            <div
              key={emp.id}
              className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-100 flex items-center justify-center text-xs md:text-sm font-semibold text-blue-600 flex-shrink-0">
                {emp.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm md:text-base font-semibold text-gray-900 truncate">
                    {emp.name}
                  </span>
                  <span className="text-xs md:text-sm font-medium text-gray-500 ml-2">
                    {emp.tasks} tasks
                  </span>
                </div>
                <div className="flex items-center gap-2 md:gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between text-[10px] md:text-xs mb-1">
                      <span className="text-gray-500">Performance</span>
                      <span className="font-semibold text-blue-600">
                        {emp.perf}%
                      </span>
                    </div>
                    <div className="h-1.5 md:h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${emp.perf}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-[10px] md:text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded-full capitalize">
                    {emp.role}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center py-8">
            No employee data available
          </p>
        )}
      </div>
    </Modal>
  );
};

// Overdue Tasks Modal Component
export const OverdueModal = ({ isOpen, onClose, tasks }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`All Overdue Tasks (${tasks.length})`}
    >
      <div className="space-y-4">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div
              key={task.id}
              className="p-3 md:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="flex justify-between items-start mb-2 md:mb-3">
                <span className="text-sm md:text-base font-semibold text-gray-900">
                  {task.title}
                </span>
                <span
                  className={`text-[10px] md:text-xs font-bold px-2 py-1 rounded ml-2 flex-shrink-0 ${
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
              <div className="grid grid-cols-2 gap-2 md:gap-4 text-xs md:text-sm">
                <div>
                  <p className="text-gray-500 text-[10px] md:text-xs mb-1">
                    Due Date
                  </p>
                  <p className="text-amber-600 font-medium">{task.due}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-[10px] md:text-xs mb-1">
                    Assigned To
                  </p>
                  <p className="text-gray-700 font-medium truncate">
                    {task.assignee}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center py-8">No overdue tasks</p>
        )}
      </div>
    </Modal>
  );
};