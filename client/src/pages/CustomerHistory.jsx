import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Clock, CheckCircle, Package } from 'lucide-react';
import { motion } from 'framer-motion';

const CustomerHistory = () => {
  const { token } = useAuth();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get('http://localhost:8085/api/orders/my-orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Filter for delivered orders
        setHistory(response.data.filter(o => o.status === 'DELIVERED'));
      } catch (err) {
        console.error('Error fetching history');
      }
    };
    fetchHistory();
  }, [token]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
        <Clock size={32} className="text-primary" />
        <h1>Order History</h1>
      </div>

      <div className="tracker-list">
        {history.length > 0 ? (
          history.map(order => (
            <div key={order.id} className="card" style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3>{order.product}</h3>
                  <p className="order-meta">{order.restaurantName} • ${order.price}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#22c55e' }}>
                  <CheckCircle size={18} />
                  <span style={{ fontWeight: 600 }}>Delivered</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <Package size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
            <p className="order-meta">No delivered orders found in your history.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CustomerHistory;
