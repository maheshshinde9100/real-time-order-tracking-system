import React, { useState } from "react";
import { createOrder } from "../services/api";
import { useNavigate } from "react-router-dom";
import { Package, CreditCard, ChevronRight, Loader2, Info } from "lucide-react";
import { motion } from "framer-motion";

const CreateOrder = () => {
  const [productName, setProductName] = useState("");
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await createOrder(productName, parseFloat(amount));
      // Save created order ID to local storage for quick tracking
      const recentOrders = JSON.parse(localStorage.getItem("recent_orders") || "[]");
      localStorage.setItem("recent_orders", JSON.stringify([response.id, ...recentOrders]));
      
      // Navigate to tracking
      setTimeout(() => {
        navigate(`/track?id=${response.id}`);
      }, 1000);
    } catch (err) {
      console.error("Order creation failed", err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-12 max-w-5xl mx-auto py-10">
      {/* Form Section */}
      <div className="flex-1 glass card-glow-primary rounded-[2.5rem] p-10 flex flex-col gap-10 border border-white/5 shadow-2xl relative overflow-hidden">
        <div className={`absolute -top-40 -left-40 w-96 h-96 rounded-full blur-[150px] opacity-10 bg-primary`} />
        
        <div className="flex flex-col gap-2 relative z-10">
          <h1 className="text-4xl font-extrabold text-white">New <span className="text-primary tracking-tight">Order</span></h1>
          <p className="text-slate-400 font-medium">Place a new order into the event-driven system.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8 relative z-10">
          <div className="flex flex-col gap-3 group">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500 group-focus-within:text-primary transition-colors">
              Product Name
            </label>
            <div className="flex items-center gap-4 bg-slate-900 px-6 py-4 rounded-2xl border border-white/5 focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/10 transition-all">
              <Package className="w-5 h-5 text-slate-500" />
              <input 
                required
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                autoFocus
                type="text" 
                placeholder="What are we shipping?" 
                className="bg-transparent text-white outline-none w-full placeholder:text-slate-600 font-medium"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 group">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500 group-focus-within:text-primary transition-colors">
              Amount (USD)
            </label>
            <div className="flex items-center gap-4 bg-slate-900 px-6 py-4 rounded-2xl border border-white/5 focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/10 transition-all">
              <CreditCard className="w-5 h-5 text-slate-500" />
              <input 
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number" 
                step="0.01"
                placeholder="0.00" 
                className="bg-transparent text-white outline-none w-full placeholder:text-slate-600 font-medium"
              />
            </div>
          </div>

          <button 
            disabled={isSubmitting}
            className="w-full mt-4 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-black uppercase tracking-widest py-5 rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Create Order
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Info Section */}
      <div className="lg:w-80 flex flex-col gap-6">
        <div className="glass-dark card-glow-primary p-8 rounded-[2rem] border border-white/5 flex flex-col gap-6 relative overflow-hidden group">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 rotate-3 transition-transform group-hover:rotate-0">
             <Info className="w-6 h-6 text-primary" />
          </div>
          <p className="text-sm text-slate-300 leading-relaxed font-medium">Your order will be instantly published to our <span className="text-white font-bold">Kafka stream</span> for processing by independent microservices.</p>
        </div>

        <div className="glass p-8 rounded-[2rem] border border-white/5 flex flex-col gap-4">
           <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Technology</span>
           <div className="flex flex-wrap gap-2">
             {["Spring", "Kafka", "Redis", "MongoDB"].map(tech => (
               <span key={tech} className="bg-slate-800 px-3 py-1 rounded-full text-[10px] font-bold text-slate-400 capitalize border border-white/5">
                 {tech}
               </span>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
