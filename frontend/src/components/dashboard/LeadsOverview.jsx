import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronDown } from 'lucide-react';

const LeadsOverview = ({ lineData }) => (
  <div className="lg:col-span-2 bg-white p-8 rounded-[32px] shadow-sm border border-gray-50">
    <div className="flex justify-between items-center mb-10">
      <div>
        <h3 className="text-xl font-bold text-slate-800">Leads Overview</h3>
        <p className="text-sm text-slate-400">Monthly Performance</p>
      </div>
      <button className="flex items-center gap-2 bg-gray-50 text-slate-600 px-4 py-2 rounded-xl border border-gray-100 text-sm font-semibold">
        Last 12 Months <ChevronDown size={16} />
      </button>
    </div>
    
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={lineData} margin={{ left: -10, right: 10 }}>
          <defs>
            <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
          
          {/* XAxis - මාස 12ක් සඳහා */}
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 12 }} 
            dy={10} 
          />
          
          {/* YAxis - 10, 20, 30, 40, 50 අගයන් සඳහා */}
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 12 }} 
            ticks={[10, 20, 30, 40, 50]} 
          />
          
          <Area type="monotone" dataKey="leads" stroke="#2563eb" strokeWidth={4} fill="url(#colorLeads)" dot={{ r: 6, fill: '#2563eb', strokeWidth: 3, stroke: '#fff' }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default LeadsOverview;