import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"; // Tooltip import කරගන්න

const TaskDistribution = ({ pieData, totalCount }) => {
  const COLORS = ['#0056D2', '#00C48C', '#FFBB28'];

  return (
    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 h-full flex flex-col">
      <h3 className="text-xl font-bold text-slate-800 mb-2">Task Distribution</h3>
      <p className="text-slate-400 text-sm mb-6">Task Status</p>
      
      <div className="h-[250px] w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              innerRadius={70}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
              cornerRadius={10}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              itemStyle={{ color: '#334155', fontWeight: '600' }}
              formatter={(value) => [`${value} tasks`, 'Count']}
            />
          </PieChart>
        </ResponsiveContainer>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-4xl font-bold text-slate-800">{totalCount}</span>
          <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold mt-1">Total</span>
        </div>
      </div>

      <div className="mt-4">
        {pieData.map((entry, index) => (
          <div key={`item-${index}`} className="flex justify-between items-center mb-3 px-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
              <span className="text-sm text-slate-600 font-medium">{entry.name}</span>
            </div>
            <span className="text-sm font-bold text-slate-800">
              {entry.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskDistribution;