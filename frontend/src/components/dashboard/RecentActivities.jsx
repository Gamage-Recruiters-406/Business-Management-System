import React from 'react';

const RecentActivities = ({ tasks }) => {

  const getStatusClasses = (status) => {
    const base = "px-3 py-1 rounded-full text-[9px] font-bold border";
    const s = (status || "").toLowerCase().trim();

    if (s === 'completed') return `${base} bg-emerald-50 text-emerald-600 border-emerald-100`;
    
    if (s.includes('progress')) return `${base} bg-blue-50 text-blue-600 border-blue-200`;
    
    if (s === 'pending') return `${base} bg-yellow-50 text-yellow-600 border-yellow-200`;
    
    return `${base} bg-slate-50 text-slate-600 border-slate-100`;
  };

  return (
    <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden mt-8">
      <div className="px-6 py-6 border-b border-slate-50 flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800 tracking-tight">Recent Activity</h3>
        <button className="text-blue-600 text-[10px] font-bold hover:text-blue-700 uppercase tracking-widest transition-colors">View All</button>
      </div>
      
      <div className="w-full">
        {/* Desktop view */}
        <table className="hidden md:table w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/50">
              <th className="px-6 py-4">Task Name</th>
              <th className="px-6 py-4">Assigned To</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {tasks.map((task, idx) => (
              <tr key={idx} className="hover:bg-blue-50/20 transition-all cursor-pointer">
                <td className="px-6 py-4 text-sm font-bold text-slate-800">{task.name}</td>
                <td className="px-6 py-4 text-sm text-slate-600 flex items-center gap-2">
                  <img src={`https://ui-avatars.com/api/?name=${task.user}&background=random`} className="w-6 h-6 rounded-full" alt="" />
                  {task.user}
                </td>
                <td className="px-6 py-4">
                  <span className={getStatusClasses(task.status)}>
                    {task.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-xs text-slate-400">{task.date}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile view */}
        <div className="md:hidden">
          {tasks.map((task, idx) => (
            <div key={idx} className="p-4 border-b border-slate-50 flex justify-between items-center">
              <div>
                <div className="text-sm font-bold text-slate-800">{task.name}</div>
                <div className="text-xs text-slate-500 mt-1">{task.user} • {task.date}</div>
              </div>
              <span className={getStatusClasses(task.status)}>
                {task.status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentActivities;