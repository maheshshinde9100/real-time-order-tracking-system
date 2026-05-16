import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  CheckCircle2, 
  AlertCircle,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminAnalytics = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get('http://localhost:8085/api/analytics', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 10000); // Update every 10s
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="loading">Loading Analytics...</div>;

  const cards = [
    { label: 'Total Orders', value: stats?.totalOrders || 0, icon: <ShoppingBag />, color: 'var(--primary)' },
    { label: 'Active Orders', value: stats?.activeOrders || 0, icon: <Activity />, color: 'var(--accent)' },
    { label: 'Successful Deliveries', value: stats?.deliveredOrders || 0, icon: <CheckCircle2 />, color: '#22c55e' },
    { label: 'Success Rate', value: `${(stats?.successRate || 0).toFixed(1)}%`, icon: <TrendingUp />, color: '#3b82f6' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="analytics-container"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
        <BarChart3 size={32} className="text-primary" />
        <h1>Platform Monitoring</h1>
      </div>

      <div className="analytics-grid">
        {cards.map((card, i) => (
          <div key={i} className="card stat-card" style={{ borderTop: `4px solid ${card.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span className="stat-label">{card.label}</span>
              <div style={{ color: card.color }}>{card.icon}</div>
            </div>
            <div className="stat-value">{card.value}</div>
            <div className="stat-trend">Live Monitoring Active</div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid" style={{ gridTemplateColumns: '1.5fr 1fr' }}>
        <div className="card">
          <h3>Delivery Status Distribution</h3>
          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {Object.entries(stats?.statusDistribution || {}).map(([status, count]) => (
              <div key={status}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  <span>{status}</span>
                  <span>{count} orders</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(count / stats.totalOrders) * 100}%` }}
                    style={{ height: '100%', background: 'var(--primary)' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3>System Health</h3>
          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
                <CheckCircle2 size={20} />
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600 }}>Redis Cache</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Connected & Healthy</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
                <Activity size={20} />
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600 }}>Kafka Streams</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Processing Events</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminAnalytics;
