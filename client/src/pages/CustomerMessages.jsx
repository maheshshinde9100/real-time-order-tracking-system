import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ChatWindow from '../components/ChatWindow';
import { MessageSquare, User } from 'lucide-react';
import { motion } from 'framer-motion';

const CustomerMessages = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [activeChat, setActiveChat] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:8085/api/orders/my-orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(response.data);
      } catch (err) {
        console.error('Error fetching orders for chat');
      }
    };
    fetchOrders();
  }, [token]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
        <MessageSquare size={32} className="text-primary" />
        <h1>My Messages</h1>
      </div>

      <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 2fr' }}>
        <div className="tracker-list">
          {orders.map(order => (
            <div 
              key={order.id} 
              className={`card ${activeChat === order.id ? 'active' : ''}`}
              style={{ 
                cursor: 'pointer', 
                marginBottom: '1rem',
                borderLeft: activeChat === order.id ? '4px solid var(--primary)' : 'none'
              }}
              onClick={() => setActiveChat(order.id)}
            >
              <h4 style={{ marginBottom: '4px' }}>{order.product}</h4>
              <p className="order-meta">Order #{order.id}</p>
            </div>
          ))}
        </div>

        <div>
          {activeChat ? (
            <ChatWindow orderId={activeChat} />
          ) : (
            <div className="card" style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p className="order-meta">Select an order to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CustomerMessages;
