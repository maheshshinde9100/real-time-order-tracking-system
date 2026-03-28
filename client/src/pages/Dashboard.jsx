import React, { useState, useEffect } from "react";
import { ShoppingCart, TrendingUp, Package, Activity, ChevronRight, Bell } from "lucide-react";
import { getOrderAnalytics, getNotifications } from "../services/api";
import { motion } from "framer-motion";

const StatCard = ({ icon: Icon, title, value, color }) => (
  <div className="glass p-6 rounded-3xl flex flex-col gap-4 border border-white/5 hover:border-white/10 transition-colors group relative overflow-hidden">
    <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-20 -mr-10 -mt-10 ${color}`} />
    <div className={`p-4 rounded-2xl w-fit ${color.replace('bg-', 'bg-').replace('text-', 'text-')} bg-opacity-20 flex items-center justify-center`}>
      <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
    </div>
    <div className="flex flex-col">
      <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">{title}</span>
      <span className="text-4xl font-extrabold text-white mt-1 tabular-nums">{value}</span>
    </div>
  </div>
);

const NotificationItem = ({ message, time }) => (
  <div className="flex items-start gap-4 p-4 hover:bg-white/5 transition-all rounded-2xl group border border-transparent hover:border-white/5">
    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
      <Bell className="w-5 h-5 text-primary" />
    </div>
    <div className="flex flex-col gap-1 w-full relative">
      <p className="text-sm font-medium text-slate-200 leading-relaxed pr-8">{message}</p>
      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{time || 'Just now'}</span>
      <div className="absolute top-0 right-0 p-1">
        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [analytics, setAnalytics] = useState({ count: 0 });
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const count = await getOrderAnalytics();
        const notices = await getNotifications();
        setAnalytics({ count });
        setNotifications(notices || []);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-10">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-5xl font-black italic uppercase tracking-tighter text-white">System <span className="text-primary tracking-normal not-italic">Overview</span></h1>
          <p className="text-slate-400 font-medium">Monitoring real-time order processing through Kafka events.</p>
        </div>
        <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/5 backdrop-blur-md">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] uppercase font-bold text-slate-400">
                U{i}
              </div>
            ))}
          </div>
          <div className="h-6 w-px bg-white/10 mx-1" />
          <span className="text-xs font-bold text-white pr-2">10.4K Active Users</span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={ShoppingCart} 
          title="Total Orders" 
          value={loading ? "..." : analytics.count.toLocaleString()} 
          color="bg-primary text-primary" 
        />
        <StatCard 
          icon={TrendingUp} 
          title="Processing Rate" 
          value="124/hr" 
          color="bg-secondary text-secondary" 
        />
        <StatCard 
          icon={Package} 
          title="In Transit" 
          value="42" 
          color="bg-accent text-accent" 
        />
        <StatCard 
          icon={Activity} 
          title="System Latency" 
          value="14ms" 
          color="bg-success text-success" 
        />
      </div>

      {/* Main content area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
        {/* Recent Notifications */}
        <div className="lg:col-span-1 glass rounded-[2.5rem] p-8 flex flex-col gap-6 max-h-[600px] border border-white/5 shadow-2xl">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Recent <span className="opacity-50">Events</span>
            </h2>
            <button className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20 hover:bg-primary/20 transition-colors cursor-pointer">
              View All
            </button>
          </div>
          <div className="flex flex-col gap-2 overflow-y-auto pr-2 custom-scrollbar">
            {notifications.length > 0 ? (
              notifications.map((msg, idx) => (
                <NotificationItem key={idx} message={msg} />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-4 opacity-50 grayscale">
                <div className="bg-slate-800/50 p-6 rounded-full border-2 border-dashed border-slate-700">
                  <Package className="w-10 h-10" />
                </div>
                <p className="text-sm font-bold uppercase tracking-widest italic">No events recorded</p>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Chart / Recent Activity Mockup */}
        <div className="lg:col-span-2 glass rounded-[2.5rem] p-8 flex flex-col gap-8 border border-white/5 shadow-2xl relative overflow-hidden h-[600px]">
          <div className={`absolute -top-40 -right-40 w-96 h-96 rounded-full blur-[150px] opacity-10 bg-primary`} />
          
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Activity className="w-5 h-5 text-success" />
              Latency <span className="opacity-50">Chart</span>
            </h2>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-[10px] font-bold text-slate-400 tracking-wider">EVENTS/S</span>
              </div>
            </div>
          </div>

          <div className="flex-1 rounded-3xl bg-slate-900/30 border border-white/5 flex items-center justify-center group overflow-hidden relative">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]" />
            
            {/* Mock Chart lines */}
            <div className="w-full h-full flex flex-col justify-end p-8 gap-4 z-10">
               <div className="flex items-end h-full gap-2 px-10">
                 {[40, 60, 45, 80, 50, 90, 70, 40, 60, 45, 80, 50, 90, 70].map((h, i) => (
                   <motion.div 
                     key={i} 
                     initial={{ height: 0 }} 
                     animate={{ height: `${h}%` }}
                     transition={{ delay: i * 0.05, duration: 1 }}
                     className="w-full bg-gradient-to-t from-primary/10 to-primary/60 rounded-t-lg relative group-hover:to-primary" 
                   />
                 ))}
               </div>
               <div className="h-px w-full bg-white/10" />
            </div>

            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
               <p className="text-xl font-black uppercase text-white tracking-widest italic bg-black/60 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 shadow-2xl">
                 Real-time data stream <span className="text-primary">Online</span>
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
