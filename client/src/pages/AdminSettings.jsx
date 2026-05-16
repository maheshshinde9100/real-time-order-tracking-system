import React from 'react';
import { Settings, Shield, Bell, Database } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminSettings = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="settings-container"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
        <Settings size={32} className="text-primary" />
        <h1>Admin Settings</h1>
      </div>

      <div className="analytics-grid">
        <div className="card">
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '1rem' }}>
            <Shield className="text-primary" />
            <h3>Security</h3>
          </div>
          <p className="order-meta">Manage roles and permissions</p>
          <button className="btn" style={{ marginTop: '1rem' }}>Manage Roles</button>
        </div>

        <div className="card">
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '1rem' }}>
            <Bell className="text-primary" />
            <h3>Notifications</h3>
          </div>
          <p className="order-meta">Configure Kafka alert topics</p>
          <button className="btn" style={{ marginTop: '1rem' }}>Configure Topics</button>
        </div>

        <div className="card">
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '1rem' }}>
            <Database className="text-primary" />
            <h3>System Health</h3>
          </div>
          <p className="order-meta">Clear Redis cache / DB logs</p>
          <button className="btn" style={{ marginTop: '1rem' }}>System Check</button>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminSettings;
