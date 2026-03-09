import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart3, Users, Clock, CheckCircle2 } from 'lucide-react';
import StatsCards from '../components/dashboard/StatCard';
import LeadsOverview from '../components/dashboard/LeadsOverview';
import TaskDistribution from '../components/dashboard/TaskDistribution';
import RecentActivities from '../components/dashboard/RecentActivities';

const TasklyDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    leads: [],
    tasks: [],
    chartTasks: [],
    employees: [],
    totalTasks: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("userToken");
        console.log("Fetching dashboard data with token:", token); 
        console.log("Token sent to backend:", token); 
        const config = { 
          headers: { 
            'Authorization': `Bearer ${token}`
          },
          withCredentials: true
        };

        const [leadsRes, tasksRes, employeesRes] = await Promise.all([
            axios.get(`${import.meta.env.VITE_API_BASE_URL}/leads/all`, config),
            axios.get(`${import.meta.env.VITE_API_BASE_URL}/tasks`, config),
            axios.get(`${import.meta.env.VITE_API_BASE_URL}/employees/stats`, config) 
        ]);
        console.log("Leads Response:", leadsRes.data);
        const rawTasks = tasksRes.data.tasks || [];
        const total = rawTasks.length;

        const chartData = [
          { 
            name: 'In Progress Tasks', 
            value: rawTasks.filter(t => t.status === 'in-progress').length, 
            percentage: total ? Math.round((rawTasks.filter(t => t.status === 'in-progress').length / total) * 100) : 0,
            color: '#3b82f6'
          },
          { 
            name: 'Completed Tasks', 
            value: rawTasks.filter(t => t.status === 'completed').length, 
            percentage: total ? Math.round((rawTasks.filter(t => t.status === 'completed').length / total) * 100) : 0,
            color: '#22c55e' 
          },
          { 
            name: 'Pending Tasks', 
            value: rawTasks.filter(t => t.status === 'pending').length, 
            percentage: total ? Math.round((rawTasks.filter(t => t.status === 'pending').length / total) * 100) : 0,
            color: '#f97316' 
          }
        ];

        setDashboardData({
          leads: leadsRes.data.data || [],
          tasks: rawTasks,
          chartTasks: chartData,
          totalEmployees: employeesRes.data.data?.totalEmployees || 0, 
          totalTasks: total
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <div className="p-20 text-center font-bold text-slate-600">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      <div className="max-w-1440px mx-auto px-8 pt-8">
        
        {/* Stats Section */}
        <StatsCards stats={[
          { 
            title: 'Total Leads', 
            value: (dashboardData?.leads?.length || 0).toString(), 
            color: '#2563eb', 
            bg: 'bg-blue-50', 
            icon: BarChart3 
          },
          { 
            title: 'Total Employees', 
            value: (dashboardData?.totalEmployees || 0).toString(), 
            color: '#9333ea', 
            bg: 'bg-purple-50', 
            icon: Users 
          },
          { 
            title: 'Pending Tasks', 
            value: (dashboardData?.tasks?.filter(t => t.status === 'pending').length || 0).toString(), 
            color: '#ea580c', 
            bg: 'bg-orange-50', 
            icon: Clock 
          },
          { 
            title: 'Completed Tasks', 
            value: (dashboardData?.tasks?.filter(t => t.status === 'completed').length || 0).toString(), 
            color: '#16a34a', 
            bg: 'bg-green-50', 
            icon: CheckCircle2 
          },
        ]} />

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2 h-300px bg-white rounded-[32px] p-6 shadow-sm border border-slate-100">
                <LeadsOverview lineData={dashboardData.leads} />
            </div>
            <div className="lg:col-span-1 h-400px">
                <TaskDistribution 
                  pieData={dashboardData.chartTasks} 
                  totalCount={dashboardData.totalTasks} 
                />
            </div>
        </div>

        {/* Recent Activities Section */}
        <RecentActivities 
          tasks={dashboardData.tasks && Array.isArray(dashboardData.tasks) 
            ? dashboardData.tasks.slice(0, 5).map(task => ({
                name: task.title || "No Title",
                id: task.task_id || task._id || "N/A",
                user: typeof task.assignedTo === 'object' ? task.assignedTo.name : (task.assignedTo || 'Unassigned'),
                status: task.status ? task.status.charAt(0).toUpperCase() + task.status.slice(1) : 'Pending',
                date: task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'N/A'
            })) 
            : []
          } 
        />
      </div>
    </div>
  );
};

export default TasklyDashboard;