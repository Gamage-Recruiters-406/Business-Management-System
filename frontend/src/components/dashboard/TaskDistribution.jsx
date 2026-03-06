import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const TaskDistribution = ({ pieData }) => {
  const COLORS = ['#2563eb', '#ea580c', '#16a34a', '#dc2626'];

  return (
    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 h-full">
      <h3 className="text-xl font-bold text-slate-800 mb-6">Task Distribution</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TaskDistribution;