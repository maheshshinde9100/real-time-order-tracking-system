import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CustomerDashboard from './pages/CustomerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminSettings from './pages/AdminSettings';
import CustomerHistory from './pages/CustomerHistory';
import CustomerMessages from './pages/CustomerMessages';
import './index.css';

const ProtectedRoute = ({ children, role }) => {
  const { user, token } = useAuth();
  
  if (!token) return <Navigate to="/login" />;
  if (role && user?.role !== role) return <Navigate to="/" />;
  
  return children;
};

const Home = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return user.role === 'ROLE_ADMIN' ? <AdminDashboard /> : <CustomerDashboard />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Navbar />
          <div className="app-layout">
            <SidebarAuthWrapper />
            <main className="main-content">
              <Routes>
                <Route path="/login" element={<AuthRedirect><Login /></AuthRedirect>} />
                <Route path="/signup" element={<AuthRedirect><Signup /></AuthRedirect>} />
                <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route path="/analytics" element={<ProtectedRoute role="ROLE_ADMIN"><AdminAnalytics /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute role="ROLE_ADMIN"><AdminSettings /></ProtectedRoute>} />
                <Route path="/history" element={<ProtectedRoute role="ROLE_CUSTOMER"><CustomerHistory /></ProtectedRoute>} />
                <Route path="/messages" element={<ProtectedRoute role="ROLE_CUSTOMER"><CustomerMessages /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

const SidebarAuthWrapper = () => {
  const { token } = useAuth();
  return token ? <Sidebar /> : null;
};

const AuthRedirect = ({ children }) => {
  const { token } = useAuth();
  if (token) return <Navigate to="/" />;
  return children;
};

export default App;
