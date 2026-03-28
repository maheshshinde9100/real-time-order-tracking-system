import React from "react";
import Navbar from "./Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

const Layout = ({ children }) => {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] -z-10" />
      
      <Navbar />
      
      <main className="mx-auto max-w-7xl px-6 pt-10 pb-20 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      
      {/* Dynamic Ticker/Footer or status bar */}
      <footer className="fixed bottom-0 w-full glass h-10 flex items-center justify-center border-t border-white/5 opacity-50 text-[10px] tracking-widest text-slate-400 uppercase font-bold uppercase transition-opacity hover:opacity-100 z-50">
        &copy; 2026 Event-Driven Orders | Real-time Kafka Infrastructure | Spring Boot | Redis Cache
      </footer>
    </div>
  );
};

export default Layout;
