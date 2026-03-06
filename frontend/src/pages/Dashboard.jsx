import React from 'react';
import { 
  BarChart3, Users, Clock, CheckCircle2, Search, Bell, ChevronDown 
} from 'lucide-react';

import StatsCards from '../components/dashboard/StatCard';
import LeadsOverview from '../components/dashboard/LeadsOverview';
import TaskDistribution from '../components/dashboard/TaskDistribution';
import RecentActivities from '../components/dashboard/RecentActivities';

const TasklyDashboard = () => {
  const stats = [
    { title: 'Total Leads', value: '1,284', color: '#2563eb', bg: 'bg-blue-50', icon: BarChart3 },
    { title: 'Total Employees', value: '24', color: '#9333ea', bg: 'bg-purple-50', icon: Users },
    { title: 'Pending Tasks', value: '42', color: '#ea580c', bg: 'bg-orange-50', icon: Clock },
    { title: 'Completed Tasks', value: '892', color: '#16a34a', bg: 'bg-green-50', icon: CheckCircle2 },
  ];

  const lineData = [
  { name: 'Jan', leads: 20 },
  { name: 'Feb', leads: 35 },
  { name: 'Mar', leads: 25 },
  { name: 'Apr', leads: 45 },
  { name: 'May', leads: 30 },
  { name: 'Jun', leads: 50 },
  { name: 'Jul', leads: 40 },
  { name: 'Aug', leads: 35 },
  { name: 'Sep', leads: 20 },
  { name: 'Oct', leads: 45 },
  { name: 'Nov', leads: 30 },
  { name: 'Dec', leads: 40 },
];

  const pieData = [
    { name: 'In Progress', value: 65, color: '#2563eb' },
    { name: 'Completed', value: 20, color: '#22c55e' },
    { name: 'Pending', value: 15, color: '#f59e0b' },
  ];

  const tasks = [
    { name: 'Tesla Model 3 Rental Inquiry', id: '#48291', user: 'John Doe', status: 'In Progress', date: 'Oct 24, 2023', color: 'blue' },
    { name: 'Review New Employee Docs', id: 'HR-04', user: 'Sarah Smith', status: 'Completed', date: 'Oct 23, 2023', color: 'green' },
    { name: 'BMW X5 Maintenance Check', id: 'OPS-112', user: 'Mike Ross', status: 'Pending', date: 'Oct 23, 2023', color: 'orange' },
    { name: 'Mercedes Benz C-Class Quote', id: '#48295', user: 'Jessica Pearson', status: 'In Progress', date: 'Oct 22, 2023', color: 'blue' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12 font-sans text-slate-900">
      {/* Main Dashboard Content */}
      <div className="max-w-[1440px] mx-auto px-8 pt-8">
        
        {/* 1. Stats Section */}
        <StatsCards stats={stats} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* 2. Leads Overview Chart */}
          <LeadsOverview lineData={lineData} />
          
          {/* 3. Task Distribution Chart */}
          <TaskDistribution pieData={pieData} />
        </div>

        {/* 4. Recent Activities Table */}
        <RecentActivities tasks={tasks} />
        
      </div>
    </div>
  );
};

export default TasklyDashboard;