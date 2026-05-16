import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ChatWindow = ({ orderId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { user, token } = useAuth();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`http://localhost:8085/api/chat/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data);
    } catch (err) {
      console.error('Error fetching chat history');
    }
  };

  useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 2000); // Poll for new messages every 2s
    return () => clearInterval(interval);
  }, [orderId]);

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await axios.post(`http://localhost:8085/api/chat/${orderId}`, 
        { message: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewMessage('');
      fetchHistory();
    } catch (err) {
      alert('Error sending message');
    }
  };

  return (
    <div className="chat-window card">
      <div style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <MessageSquare size={18} className="text-primary" />
        <span style={{ fontWeight: 600 }}>Order Chat #{orderId}</span>
      </div>
      
      <div className="messages">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`message ${msg.sender === user.username ? 'sent' : 'received'}`}
          >
            <div style={{ fontSize: '0.7rem', opacity: 0.7, marginBottom: '2px' }}>
              {msg.sender === user.username ? 'You' : msg.sender}
            </div>
            {msg.message}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="chat-input">
        <input 
          type="text" 
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit" className="btn" style={{ padding: '0.5rem 1rem' }}>
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
