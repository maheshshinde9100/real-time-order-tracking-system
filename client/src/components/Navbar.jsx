import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Utensils, User, ShoppingBag } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', textDecoration: 'none' }}>
          <Utensils className="text-primary" />
          <span style={{ fontWeight: 800, fontSize: '1.2rem' }}>FlashFood</span>
        </Link>
      </div>
      
      <div className="nav-links">
        {user && (
          <>
            <span className="user-badge" style={{ background: 'rgba(255, 77, 77, 0.1)', color: 'var(--primary)', fontWeight: 600 }}>
              Live Monitoring Active
            </span>
            <button onClick={handleLogout} className="btn-logout">
              <LogOut size={16} />
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
