import React, { useState, useEffect } from "react";
import { ShoppingCart, TrendingUp, Package, Activity, ChevronRight, Bell } from "lucide-react";
import { getOrderAnalytics, getNotifications, getAllOrders } from "../services/api";
import { motion } from "framer-motion";

const StatCard = ({ icon: Icon, title, value, color }) => (
  <div className="glass-dark hover:card-glow-primary p-6 rounded-3xl flex flex-col gap-4 border border-white/5 hover:border-white/10 transition-all duration-300 group relative overflow-hidden">
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
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    className="flex items-start gap-4 p-4 hover:bg-white/5 transition-all rounded-2xl group border border-transparent hover:border-white/5"
  >
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
  </motion.div>
);

const HealthIndicator = ({ label, status }) => (
  <div className="flex items-center gap-3 glass px-4 py-2 rounded-xl border border-white/5">
    <div className={`w-2 h-2 rounded-full ${status ? 'bg-success animate-pulse' : 'bg-error'} shadow-[0_0_10px_rgba(34,197,94,0.3)]`} />
    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
  </div>
);

const Dashboard = () => {
  const [analytics, setAnalytics] = useState({ count: 0 });
  const [notifications, setNotifications] = useState([]);
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const count = await getOrderAnalytics();
        const notices = await getNotifications();
        const allOrders = await getAllOrders();
        setAnalytics({ count });
        setNotifications(notices || []);
        // Get the latest 5 orders
        setOrders(allOrders.slice(0, 5) || []);
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
        <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/5 backdrop-blur-md text-white">
          <Activity className="w-4 h-4 text-primary animate-pulse ml-2" />
          <span className="text-xs font-bold uppercase tracking-widest pr-2">Processing Live Events</span>
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

      {/* System Health */}
      <div className="flex flex-wrap gap-4 items-center">
        <HealthIndicator label="Kafka Node 092" status={true} />
        <HealthIndicator label="Redis Cache 379" status={true} />
        <HealthIndicator label="MongoDB Cluster" status={true} />
        <div className="h-4 w-px bg-white/10 mx-2" />
        <div className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em]">Infrastructure: Stable</div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Active Orders Section */}
        <div className="lg:col-span-2 flex flex-col gap-6">
           <div className="flex items-center justify-between px-2">
             <h2 className="text-xl font-bold flex items-center gap-2 text-white uppercase italic tracking-tighter">
                Recent <span className="text-primary not-italic">Orders</span>
             </h2>
             <TrendingUp className="w-5 h-5 text-primary opacity-50" />
           </div>
           
           <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 mb-2 p-1 bg-white/5 rounded-2xl border border-white/5">
                <input 
                  type="text" 
                  placeholder="Find by ID or Product..." 
                  className="bg-transparent text-xs text-white px-4 py-2 w-full outline-none font-bold placeholder:text-slate-600 uppercase"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="flex gap-2 mb-4 overflow-x-auto pb-2 custom-scrollbar">
                {["ALL", "CREATED", "PROCESSING", "SHIPPED", "DELIVERED"].map(f => (
                  <button 
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${
                      filter === f ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-white/5 border-white/5 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {orders.filter(o => 
                (filter === "ALL" || o.status === filter) && 
                (o.productName?.toLowerCase().includes(search.toLowerCase()) || o.id?.toLowerCase().includes(search.toLowerCase()))
              ).length > 0 ? (
                orders
                  .filter(o => 
                    (filter === "ALL" || o.status === filter) && 
                    (o.productName?.toLowerCase().includes(search.toLowerCase()) || o.id?.toLowerCase().includes(search.toLowerCase()))
                  )
                  .map((order) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={order.id} 
                      className="glass p-5 rounded-3xl border border-white/10 flex items-center justify-between group hover:bg-white/5 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-primary border border-primary/20">
                          <Package className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-white uppercase tracking-tight">{order.productName || 'Unnamed Product'}</span>
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">ORDER #{order.id.slice(-6)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                         <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-colors ${
                           order.status === 'DELIVERED' ? 'bg-success/10 text-success border-success/30 shadow-[0_0_15px_rgba(34,197,94,0.1)]' : 
                           order.status === 'SHIPPED' ? 'bg-accent/10 text-accent border-accent/20' : 
                           'bg-primary/10 text-primary border-primary/20'
                         }`}>
                           {order.status}
                         </span>
                         <div className="text-right flex flex-col mr-2">
                            <span className="text-sm font-black text-white tabular-nums">${order.amount.toLocaleString()}</span>
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">USD</span>
                         </div>
                      </div>
                    </motion.div>
                  ))
              ) : (
                <div className="glass rounded-[2rem] py-20 flex flex-col items-center justify-center gap-4 border-dashed border-white/5 opacity-50 italic text-slate-500">
                  <Package className="w-10 h-10" />
                  <p className="text-sm font-bold uppercase tracking-widest">No matching orders</p>
                </div>
              )}
           </div>
        </div>

        {/* Notifications sidebar */}
        <div className="lg:col-span-2 glass-dark card-glow-primary rounded-[2.5rem] p-8 flex flex-col gap-6 max-h-[600px] border border-white/5 shadow-2xl">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold flex items-center gap-2 text-white uppercase italic tracking-tighter">
              Event <span className="text-secondary not-italic">Stream</span>
            </h2>
            <Bell className="w-5 h-5 text-secondary opacity-50" />
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
      </div>
    </div>
  );
};

export default Dashboard;
