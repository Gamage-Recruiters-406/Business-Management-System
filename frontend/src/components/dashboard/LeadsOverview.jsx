import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const LeadsOverview = ({ lineData }) => {
  const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const monthlyCounts = (lineData || []).reduce((acc, lead) => {
    const date = lead.createdAt ? new Date(lead.createdAt) : new Date();
    const month = date.toLocaleString('default', { month: 'short' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  const chartData = allMonths.map(month => ({
    name: month,
    value: monthlyCounts[month] || 0
  }));

  return (
    <div className="w-full h-full bg-white p-4 md:p-6 rounded-[32px] border border-slate-100 flex flex-col">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-800">Leads Overview</h3>
        <p className="text-sm text-slate-500">Monthly Performance</p>
      </div>
      
      <div className="flex-1 overflow-x-auto scrollbar-hide pb-4">
        <div className="h-[250px] min-w-[600px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
              <XAxis 
                dataKey="name" 
                axisLine={true} 
                tickLine={true}
                tick={{ fill: '#64748b', fontSize: 12 }} 
                dy={15} 
              />
              <YAxis 
                axisLine={true}
                tickLine={true} 
                allowDecimals={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                domain={[0, 'auto']} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  borderRadius: '12px', 
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                itemStyle={{ color: '#2563eb', fontWeight: 'bold' }}
                cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} 
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#2563eb" 
                strokeWidth={3} 
                fill="#dbeafe" 
                dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default LeadsOverview;