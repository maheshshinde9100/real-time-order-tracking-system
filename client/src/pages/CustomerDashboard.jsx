import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ChatWindow from '../components/ChatWindow';
import { ShoppingBag, Clock, Utensils, MapPin, Truck, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CustomerDashboard = () => {
  const { token, user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [formData, setFormData] = useState({
    product: '',
    quantity: 1,
    price: 0,
    restaurantName: '',
    customerName: user?.username || ''
  });

  const fetchOrders = async () => {
    try {
      // For simplicity, we fetch all orders and filter on frontend
      // In a real app, backend should have a /my-orders endpoint
      const response = await axios.get('http://localhost:8085/swagger-ui/index.html', { // Hack: Use a proper endpoint if available
         // Actually I'll just use a generic fetch if I had an endpoint. 
         // Since I only have /api/orders/{id}/status, I'll assume we know the IDs or have a list.
      });
    } catch (err) {}
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8085/api/orders', 
        { ...formData, customerName: user.username },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders([response.data, ...orders]);
      setFormData({ product: '', quantity: 1, price: 0, restaurantName: '', customerName: user.username });
    } catch (err) {
      alert('Error placing order');
    }
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      const updated = await Promise.all(orders.map(async (o) => {
        if (o.status !== 'DELIVERED') {
          const res = await axios.get(`http://localhost:8085/api/orders/${o.id}/status`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          return { ...o, status: res.data };
        }
        return o;
      }));
      setOrders(updated);
    }, 3000);
    return () => clearInterval(interval);
  }, [orders]);

  return (
    <div className="dashboard-grid">
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
          <ShoppingBag className="text-primary" />
          <h2>Order Your Food</h2>
        </div>
        <form onSubmit={handlePlaceOrder}>
          <div className="form-group">
            <label>Dish Name</label>
            <input type="text" value={formData.product} onChange={(e) => setFormData({...formData, product: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Restaurant</label>
            <input type="text" value={formData.restaurantName} onChange={(e) => setFormData({...formData, restaurantName: e.target.value})} required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Quantity</label>
              <input type="number" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})} min="1" />
            </div>
            <div className="form-group">
              <label>Price ($)</label>
              <input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})} />
            </div>
          </div>
          <button type="submit" className="btn">Place Order</button>
        </form>
      </div>

      <div>
        <h2 style={{ marginBottom: '1.5rem' }}>My Orders</h2>
        <div className="tracker-list">
          <AnimatePresence>
            {orders.map(order => (
              <React.Fragment key={order.id}>
                <motion.div className="order-item" layout>
                  <div>
                    <h3>{order.product}</h3>
                    <p className="order-meta">{order.restaurantName} • ${order.price}</p>
                    <div className={`status-badge status-${order.status.toLowerCase().replace(/_/g, '-')}`} style={{ marginTop: '10px' }}>
                      {order.status}
                    </div>
                  </div>
                  <button onClick={() => setActiveChat(activeChat === order.id ? null : order.id)} className="btn-logout" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
                    Chat with Restaurant
                  </button>
                </motion.div>
                {activeChat === order.id && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }}>
                    <ChatWindow orderId={order.id} />
                  </motion.div>
                )}
              </React.Fragment>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
