import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ChatWindow from '../components/ChatWindow';
import { ClipboardList, MessageSquare, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [activeChat, setActiveChat] = useState(null);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get('http://localhost:8085/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (err) {
      console.error('Error fetching all orders');
    }
  };

  useEffect(() => {
    fetchAllOrders();
    const interval = setInterval(fetchAllOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(`http://localhost:8085/api/orders/${orderId}/status?status=${newStatus}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAllOrders();
    } catch (err) {
      alert('Error updating status');
    }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await axios.delete(`http://localhost:8085/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAllOrders();
    } catch (err) {
      alert('Error deleting order');
    }
  };

  const statusOptions = ['PENDING', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'];

  return (
    <div className="admin-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
        <ClipboardList size={32} className="text-primary" />
        <h1>Restaurant Management</h1>
      </div>

      <div className="tracker-list">
        <AnimatePresence>
          {orders.map(order => (
            <div key={order.id} className="card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--accent)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3>{order.product} <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>#{order.id}</span></h3>
                  <p className="order-meta">Customer: <strong>{order.customerName}</strong> • ${order.price}</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <select 
                    value={order.status} 
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="status-badge"
                    style={{ background: 'var(--background)', color: 'var(--text)', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  <button 
                    onClick={() => setActiveChat(activeChat === order.id ? null : order.id)}
                    className={`btn-logout ${activeChat === order.id ? 'active' : ''}`}
                  >
                    <MessageSquare size={16} />
                  </button>
                  <button 
                    onClick={() => deleteOrder(order.id)}
                    className="btn-logout"
                    style={{ borderColor: 'rgba(255,77,77,0.3)', color: 'var(--primary)' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {activeChat === order.id && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <ChatWindow orderId={order.id} />
                </motion.div>
              )}
            </div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;
