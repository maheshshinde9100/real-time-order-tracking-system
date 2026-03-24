import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart, Package, Bell, BarChart2, Plus, RefreshCw, CheckCircle } from 'lucide-react';

const API_BASE = 'http://localhost:8080';

const App = () => {
  const [userId, setUserId] = useState(101); // Default user for demo
  const [productName, setProductName] = useState('');
  const [amount, setAmount] = useState('');
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch initial data
  useEffect(() => {
    fetchStats();
    fetchNotifications();
    
    // Polling for updates every 5 seconds
    const interval = setInterval(() => {
      fetchStats();
      fetchNotifications();
      refreshOrderStatus();
    }, 5000);

    return () => clearInterval(interval);
  }, [userId]);

  const fetchStats = async () => {
    try {
      const resp = await axios.get(`${API_BASE}/analytics/count`);
      setTotalOrders(resp.data);
    } catch (err) {
      console.error("Error fetching stats", err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const resp = await axios.get(`${API_BASE}/notifications/${userId}`);
      setNotifications(resp.data);
    } catch (err) {
      console.error("Error fetching notifications", err);
    }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!productName || !amount) return;

    setLoading(true);
    try {
      const payload = {
        userId: parseInt(userId),
        productName,
        amount: parseFloat(amount)
      };
      
      const resp = await axios.post(`${API_BASE}/orders`, payload);
      const newOrder = { ...resp.data, status: 'CREATED' };
      setOrders([newOrder, ...orders]);
      setProductName('');
      setAmount('');
      
      // Immediately refresh stats
      fetchStats();
    } catch (err) {
      alert("Failed to create order. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const refreshOrderStatus = async () => {
    if (orders.length === 0) return;

    const updatedOrders = await Promise.all(
      orders.map(async (order) => {
        if (order.status === 'PROCESSING') return order; // Keep as is if already processing (or check if it moves further)
        try {
          const resp = await axios.get(`${API_BASE}/orders/${order.id}/status`);
          return { ...order, status: resp.data };
        } catch (err) {
          return order;
        }
      })
    );
    setOrders(updatedOrders);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 space-y-8 max-w-6xl mx-auto">
      {/* Header & Stats */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight flex items-center gap-3">
            <Package className="text-purple-500" size={40} />
            Order Tracker
          </h1>
          <p className="text-slate-400 mt-1">Real-time Event-Driven Processing System</p>
        </div>
        
        <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 flex items-center gap-4">
          <div className="bg-purple-500/10 p-3 rounded-xl border border-purple-500/20">
            <BarChart2 className="text-purple-400" size={24} />
          </div>
          <div>
            <p className="text-slate-400 text-xs uppercase font-semibold tracking-wider">Total Orders</p>
            <p className="text-2xl font-bold text-white leading-none mt-1">{totalOrders}</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Create Order */}
        <section className="lg:col-span-1 space-y-6">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Plus size={20} className="text-purple-400" />
              New Order
            </h2>
            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">User ID</label>
                <input 
                  type="number" 
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Product Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. MacBook Pro"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Amount ($)</label>
                <input 
                  type="number" 
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>
              <button 
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-purple-900/20 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {loading ? <RefreshCw className="animate-spin" size={20} /> : <ShoppingCart size={20} />}
                Place Order
              </button>
            </form>
          </div>
        </section>

        {/* Middle: Active Orders */}
        <section className="lg:col-span-2 space-y-6">
          <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-6 backdrop-blur-sm min-h-[400px]">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <RefreshCw size={20} className="text-green-400" />
                  Live Order Status
                </h2>
                <span className="text-xs bg-green-500/10 text-green-400 px-3 py-1 rounded-full border border-green-500/20 animate-pulse">
                  Live Polling Active
                </span>
             </div>

             {orders.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-64 text-slate-500 space-y-3">
                  <Package size={48} className="opacity-20 transition-all" />
                  <p>No orders yet. Place your first order!</p>
               </div>
             ) : (
               <div className="space-y-3">
                 {orders.map((order) => (
                   <div key={order.id} className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl flex items-center justify-between group hover:border-slate-600 transition-all">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${order.status === 'PROCESSING' ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'}`}>
                           <Package size={20} />
                        </div>
                        <div>
                           <p className="font-bold text-white">{order.productName}</p>
                           <p className="text-xs text-slate-500 font-mono">ID: {order.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                         <p className="font-bold text-white text-lg">${order.amount}</p>
                         <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase border ${
                            order.status === 'PROCESSING' 
                           ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                           : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                         }`}>
                           {order.status}
                         </span>
                      </div>
                   </div>
                 ))}
               </div>
             )}
          </div>
        </section>
      </div>

      {/* Notifications Footer/Toast Section */}
      <section className="bg-slate-800/40 border border-slate-700 p-6 rounded-3xl overflow-hidden">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
           <Bell size={20} className="text-yellow-400" />
           Live Notifications
        </h3>
        {notifications.length === 0 ? (
          <p className="text-slate-500 italic text-sm">Waiting for updates...</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {notifications.map((msg, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-sm text-slate-300 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <CheckCircle size={14} className="text-green-500" />
                {msg}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default App;
