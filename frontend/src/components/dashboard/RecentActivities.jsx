import React from 'react';

const RecentActivities = ({ tasks }) => (
  <div className="bg-white rounded-[32px] shadow-sm border border-gray-50 overflow-hidden">
    <div className="p-8 flex justify-between items-center">
      <h3 className="text-xl font-bold text-slate-800">Recent Activity & Tasks</h3>
      <button className="text-blue-600 text-sm font-bold hover:underline">View All</button>
    </div>
    <div className="overflow-x-auto px-4 pb-4">
      <table className="w-full text-left">
        <thead>
          <tr className="text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50">
            <th className="px-6 py-4">Task / Lead</th>
            <th className="px-6 py-4">Assigned To</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {tasks.map((task, idx) => (
            <tr key={idx} className="group hover:bg-blue-50/30 transition-colors">
              <td className="px-6 py-5">
                <div className="text-sm font-bold text-slate-700">{task.name}</div>
                <div className="text-[11px] text-slate-400 font-medium">{task.id}</div>
              </td>
              <td className="px-6 py-5">
                <div className="flex items-center gap-3">
                  <img src={`https://ui-avatars.com/api/?name=${task.user}&background=random`} className="w-8 h-8 rounded-full border border-white shadow-sm" alt="Avatar" />
                  <span className="text-sm font-semibold text-slate-600">{task.user}</span>
                </div>
              </td>
              <td className="px-6 py-5">
                <span className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border ${
                  task.color === 'blue' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                  task.color === 'green' ? 'bg-green-50 text-green-600 border-green-100' : 
                  'bg-orange-50 text-orange-600 border-orange-100'
                }`}>
                  {task.status}
                </span>
              </td>
              <td className="px-6 py-5 text-right text-sm font-medium text-slate-400">{task.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default RecentActivities;