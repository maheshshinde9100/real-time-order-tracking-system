import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  BarChart3, 
  Package, 
  Settings, 
  MessageSquare, 
  Clock,
  ChevronRight
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();

  const adminLinks = [
    { to: '/', icon: <Package size={20} />, label: 'Orders' },
    { to: '/analytics', icon: <BarChart3 size={20} />, label: 'Analytics' },
    { to: '/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  const customerLinks = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: 'Order Food' },
    { to: '/history', icon: <Clock size={20} />, label: 'History' },
    { to: '/messages', icon: <MessageSquare size={20} />, label: 'Chats' },
  ];

  const links = user?.role === 'ROLE_ADMIN' ? adminLinks : customerLinks;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-role">
          {user?.role === 'ROLE_ADMIN' ? 'Admin Portal' : 'Customer Area'}
        </span>
      </div>
      
      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink 
            key={link.to} 
            to={link.to} 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            {link.icon}
            <span className="sidebar-label">{link.label}</span>
            <ChevronRight className="sidebar-arrow" size={14} />
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <span className="user-name">{user?.username}</span>
            <span className="user-status">Online</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
