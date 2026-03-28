import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getOrderStatus } from "../services/api";
import { Search, Package, ShoppingCart, Truck, CheckCircle, Loader2, AlertCircle, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../utils/cn";

const Step = ({ icon: Icon, label, status, isActive, isCompleted }) => (
  <div className="flex flex-col items-center gap-4 relative">
    <div className={cn(
      "w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-700 relative z-10",
      isCompleted ? "bg-success border-success/30 text-white shadow-[0_0_30px_rgba(16,185,129,0.3)]" : 
      isActive ? "bg-primary border-primary/30 text-white shadow-[0_0_30px_rgba(59,130,246,0.3)] animate-pulse" : 
      "bg-slate-800 border-white/5 text-slate-500 grayscale opacity-50"
    )}>
      <Icon className="w-7 h-7" />
      {isCompleted && (
        <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-lg">
          <CheckCircle className="w-5 h-5 text-success" fill="currentColor" />
        </div>
      )}
    </div>
    <div className="flex flex-col items-center gap-1 group">
      <span className={cn(
        "text-xs font-black uppercase tracking-widest text-center transition-colors px-2 rounded-full py-0.5",
        isActive ? "text-primary bg-primary/10" : isCompleted ? "text-success bg-success/10" : "text-slate-500"
      )}>
        {label}
      </span>
      {isActive && (
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[10px] font-bold text-primary italic uppercase tracking-tighter"
        >
          Processing...
        </motion.span>
      )}
    </div>
  </div>
);

const TrackOrder = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get("id") || "");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const steps = [
    { key: "CREATED", label: "Created", icon: ShoppingCart },
    { key: "PROCESSING", label: "Processing", icon: Package },
    { key: "SHIPPED", label: "Shipped", icon: Truck },
    { key: "DELIVERED", label: "Delivered", icon: CheckCircle },
  ];

  const fetchStatus = async (id) => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const currentStatus = await getOrderStatus(id);
      setStatus(currentStatus);
    } catch (err) {
      console.error(err);
      setError("Order ID not found or server error.");
      setStatus(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      fetchStatus(id);
      const interval = setInterval(() => fetchStatus(id), 3000);
      return () => clearInterval(interval);
    }
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (orderId) setSearchParams({ id: orderId });
  };

  const currentStepIndex = steps.findIndex(s => s.key === status);

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-10 py-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-5xl font-black italic uppercase tracking-tighter text-white">Live <span className="text-primary not-italic">Tracker</span></h1>
        <p className="text-slate-400 font-medium">Follow your order pulse in real-time across the landscape.</p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="glass-dark card-glow-primary p-4 rounded-3xl flex items-center gap-4 border border-white/5 focus-within:border-primary/40 focus-within:ring-8 focus-within:ring-primary/5 transition-all shadow-2xl relative overflow-hidden group">
         <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent top-0 opacity-0 group-focus-within:opacity-100 transition-opacity" />
         <Search className="w-6 h-6 text-slate-500 ml-2" />
         <input 
           type="text" 
           placeholder="Enter Order Confirmation ID..." 
           className="bg-transparent text-white w-full outline-none font-bold text-lg placeholder:text-slate-600 placeholder:font-medium placeholder:italic"
           value={orderId}
           onChange={(e) => setOrderId(e.target.value)}
         />
         <button 
           type="submit" 
           className="bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest px-8 py-3 rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-95 flex items-center gap-2 group/btn"
         >
           {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Track <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" /></>}
         </button>
      </form>

      {/* Tracking Canvas */}
      <AnimatePresence mode="wait">
        {status ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass card-glow-primary rounded-[3rem] p-12 flex flex-col items-center gap-16 border border-white/5 shadow-2xl relative overflow-hidden h-[450px] justify-center"
            >
            <div className={`absolute top-0 inset-x-0 h-[200px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none`} />
            
            <div className="flex flex-col items-center gap-3">
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">Active Tracking</span>
               <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Order ID: <span className="text-primary font-bold not-italic font-sans tracking-normal opacity-80">{searchParams.get("id")}</span></h3>
            </div>

            <div className="flex justify-between w-full max-w-2xl relative group/tracker">
              {/* Connector Lines */}
              <div className="absolute top-8 left-0 right-0 h-1 bg-slate-800 -translate-y-1/2 z-0 rounded-full" />
              <div 
                className="absolute top-8 left-0 h-1 bg-gradient-to-r from-success to-primary -translate-y-1/2 z-0 transition-all duration-1000 ease-in-out rounded-full shadow-[0_0_15px_rgba(59,130,246,0.3)]" 
                style={{ width: currentStepIndex === -1 ? '0%' : `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
              />

              {steps.map((step, index) => (
                <Step 
                  key={step.key} 
                  {...step} 
                  isActive={step.key === status} 
                  isCompleted={index < currentStepIndex || status === "DELIVERED" && index <= currentStepIndex}
                />
              ))}
            </div>

            <div className="flex items-center gap-8 text-slate-500 font-bold uppercase tracking-widest text-[10px] italic">
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-success shadow-[0_0_8px_rgba(16,185,129,0.5)]" /> Completed
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-primary animate-pulse" /> Processing
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-slate-800" /> Pending
               </div>
            </div>
          </motion.div>
        ) : error ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-dark rounded-[3rem] p-20 flex flex-col items-center justify-center gap-6 border border-error/10 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-error/10 flex items-center justify-center border-2 border-error/20">
              <AlertCircle className="w-10 h-10 text-error" />
            </div>
            <div className="flex flex-col gap-2">
               <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">System Error</h3>
               <p className="text-slate-400 font-medium max-w-xs">{error}</p>
            </div>
            <button 
              onClick={() => fetchStatus(orderId)}
              className="mt-4 px-8 py-3 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-xs rounded-2xl border border-white/5 transition-all"
            >
              Retry Connection
            </button>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass rounded-[3rem] py-40 flex flex-col items-center justify-center gap-8 border border-white/5 border-dashed"
          >
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-primary/20 animate-[spin_3s_linear_infinite]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Search className="w-10 h-10 text-primary opacity-50" />
              </div>
            </div>
            <p className="text-slate-500 font-black uppercase tracking-[0.3em] italic text-xs">Waiting for Order ID...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};



export default TrackOrder;
