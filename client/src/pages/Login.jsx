import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Lock, User as UserIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8085/api/auth/login', { username, password });
      login(response.data.token);
      navigate('/');
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <motion.div 
      className="card auth-card"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <LogIn size={40} className="text-primary" style={{ marginBottom: '1rem' }} />
        <h2>Welcome Back</h2>
        <p className="subtitle">Login to track your orders</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label><UserIcon size={14} /> Username</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label><Lock size={14} /> Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        {error && <p style={{ color: 'var(--primary)', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</p>}
        <button type="submit" className="btn">Login</button>
      </form>
      
      <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Sign Up</Link>
      </p>
    </motion.div>
  );
};

export default Login;
