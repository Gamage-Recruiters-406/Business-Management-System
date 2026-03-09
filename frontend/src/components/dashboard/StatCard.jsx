import React from 'react';

const StatsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((item, idx) => (
        <div 
          key={idx} 
          className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex items-center justify-between transition-all hover:shadow-md"
        >
          <div className="flex flex-col">
            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              {item.title}
            </p>
            <h2 className="text-3xl font-extrabold text-slate-950">
              {item.value}
            </h2>
          </div>

          <div 
            className={`${item.bg} p-4 rounded-2xl flex items-center justify-center`} 
            style={{ color: item.color }}
          >
            <item.icon size={24} strokeWidth={2.5} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;