import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Package, LayoutDashboard, PlusCircle, History, Info } from "lucide-react";
import { cn } from "../utils/cn";

const NavLink = ({ to, icon: Icon, children, active }) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300",
      active 
        ? "bg-primary/20 text-primary shadow-lg shadow-primary/10 border border-primary/30" 
        : "text-slate-400 hover:text-white hover:bg-white/5"
    )}
  >
    <Icon className="w-5 h-5" />
    <span className="font-medium">{children}</span>
  </Link>
);

const Navbar = () => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full px-4 pt-4">
      <nav className="mx-auto max-w-7xl glass rounded-2xl h-16 flex items-center justify-between px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-primary p-2 rounded-lg group-hover:scale-110 transition-transform">
            <Package className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            OrderTrack
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-2">
          <NavLink to="/" icon={LayoutDashboard} active={location.pathname === "/"}>
            Dashboard
          </NavLink>
          <NavLink to="/order/new" icon={PlusCircle} active={location.pathname === "/order/new"}>
            New Order
          </NavLink>
          <NavLink to="/track" icon={History} active={location.pathname === "/track"}>
            Track Status
          </NavLink>
        </div>

        {/* Status indicator or profile */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end mr-2">
            <span className="text-xs text-slate-400">Status</span>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-success status-animate" />
              <span className="text-sm font-semibold text-success">Live</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold border-2 border-white/10 shadow-lg">
            M
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
