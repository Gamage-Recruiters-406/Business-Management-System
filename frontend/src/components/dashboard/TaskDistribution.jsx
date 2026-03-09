import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const TaskDistribution = ({ pieData }) => (
  <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-50 flex flex-col items-center">
    <h3 className="text-xl font-bold text-slate-800 self-start mb-2">Task Distribution</h3>
    <p className="text-sm text-slate-400 self-start mb-8">Task Status</p>
    <div className="relative w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={pieData} innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value">
            {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} cornerRadius={10} />)}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-3xl font-black text-slate-800">100%</span>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total</span>
      </div>
    </div>
    <div className="w-full mt-6 space-y-4">
      {pieData.map((item, idx) => (
        <div key={idx} className="flex justify-between items-center text-sm font-semibold">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
            <span className="text-slate-600">{item.name}</span>
          </div>
          <span className="text-slate-800">{item.value}%</span>
        </div>
      ))}
    </div>
  </div>
);

export default TaskDistribution;