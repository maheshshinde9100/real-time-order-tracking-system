import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingBag, Truck, CheckCircle, Clock, Utensils, User, MapPin, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = 'http://localhost:8085/api/orders';

function App() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    product: '',
    quantity: 1,
    price: 0,
    customerName: '',
    restaurantName: ''
  });

  const fetchOrderStatus = async (orderId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${orderId}/status`);
      return response.data;
    } catch (error) {
      console.error('Error fetching status:', error);
      return null;
    }
  };

  const updateOrdersStatus = async () => {
    const updatedOrders = await Promise.all(
      orders.map(async (order) => {
        if (order.status !== 'DELIVERED') {
          const newStatus = await fetchOrderStatus(order.id);
          if (newStatus && newStatus !== order.status) {
            return { ...order, status: newStatus };
          }
        }
        return order;
      })
    );
    setOrders(updatedOrders);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (orders.length > 0) {
        updateOrdersStatus();
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [orders]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(API_BASE_URL, formData);
      setOrders([response.data, ...orders]);
      setFormData({
        product: '',
        quantity: 1,
        price: 0,
        customerName: '',
        restaurantName: ''
      });
    } catch (error) {
      alert('Error placing order. Make sure backend is running!');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING': return <Clock className="w-5 h-5" />;
      case 'PREPARING': return <Utensils className="w-5 h-5" />;
      case 'OUT_FOR_DELIVERY': return <Truck className="w-5 h-5" />;
      case 'DELIVERED': return <CheckCircle className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  const getStatusClass = (status) => {
    return `status-badge status-${status.toLowerCase().replace(/_/g, '-')}`;
  };

  return (
    <div className="app-container">
      <header>
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          FlashFood Tracker
        </motion.h1>
        <p className="subtitle">Real-time order management powered by Kafka & Redis</p>
      </header>

      <div className="dashboard-grid">
        {/* Order Form */}
        <motion.div 
          className="card"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
            <ShoppingBag className="text-primary" />
            <h2 style={{ fontSize: '1.5rem' }}>Place New Order</h2>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label><Utensils size={14} style={{ marginRight: '5px' }} /> Dish Name</label>
              <input 
                type="text" 
                placeholder="e.g. Spicy Miso Ramen"
                value={formData.product}
                onChange={(e) => setFormData({...formData, product: e.target.value})}
                required
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Quantity</label>
                <input 
                  type="number" 
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                  min="1"
                />
              </div>
              <div className="form-group">
                <label>Price ($)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                />
              </div>
            </div>

            <div className="form-group">
              <label><User size={14} style={{ marginRight: '5px' }} /> Customer Name</label>
              <input 
                type="text" 
                placeholder="Mahesh"
                value={formData.customerName}
                onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label><MapPin size={14} style={{ marginRight: '5px' }} /> Restaurant</label>
              <input 
                type="text" 
                placeholder="Ichiraku Ramen"
                value={formData.restaurantName}
                onChange={(e) => setFormData({...formData, restaurantName: e.target.value})}
                required
              />
            </div>

            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </motion.div>

        {/* Order Tracker */}
        <motion.div 
          className="card"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Truck className="text-accent" />
              <h2 style={{ fontSize: '1.5rem' }}>Active Orders</h2>
            </div>
            <div className="real-time-indicator">
              <div className="dot"></div>
              Live Updates
            </div>
          </div>

          <div className="tracker-list">
            <AnimatePresence>
              {orders.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                  No active orders. Place one to see it here!
                </p>
              ) : (
                orders.map((order) => (
                  <motion.div 
                    key={order.id} 
                    className="order-item"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    layout
                  >
                    <div className="order-info">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h3>{order.product}</h3>
                        <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>x{order.quantity}</span>
                      </div>
                      <div className="order-meta">
                        <span>ID: #{order.id}</span> • <span>{order.restaurantName}</span> • <span>${order.price}</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', marginTop: '5px', color: 'var(--text-muted)' }}>
                        Ordered by: {order.customerName}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                      <div className={getStatusClass(order.status)}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default App;
