import React from 'react';

const RecentActivities = ({ tasks }) => (
  <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden mt-8">
    <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center">
      <h3 className="text-lg font-bold text-slate-800 tracking-tight">Recent Activity & Tasks</h3>
      <button className="text-blue-600 text-xs font-bold hover:text-blue-700 uppercase tracking-widest transition-colors">
        View All
      </button>
    </div>
    
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-[12px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/50">
            <th className="px-8 py-4">Task Name</th>
            <th className="px-8 py-4">Assigned To</th>
            <th className="px-8 py-4">Status</th>
            <th className="px-8 py-4 text-right">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {tasks.map((task, idx) => (
            <tr key={idx} className="hover:bg-blue-50/20 transition-all duration-200 cursor-pointer group">
              <td className="px-8 py-5">
                <div className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{task.name}</div>
              </td>
              <td className="px-8 py-5">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src={`https://ui-avatars.com/api/?name=${task.user}&background=random`} className="w-9 h-9 rounded-full ring-2 ring-white shadow-sm" alt={task.user} />
                  </div>
                  <span className="text-sm font-semibold text-slate-600">{task.user}</span>
                </div>
              </td>
              <td className="px-8 py-5">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold border ${
                  task.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                  task.status === 'In Progress' ? 'bg-sky-50 text-sky-600 border-sky-100' : 
                  'bg-amber-50 text-amber-600 border-amber-100'
                }`}>
                  {task.status.toUpperCase()}
                </span>
              </td>
              <td className="px-8 py-5 text-right text-sm font-medium text-slate-400">{task.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default RecentActivities;