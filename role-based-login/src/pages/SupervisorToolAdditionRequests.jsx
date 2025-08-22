// src/pages/SupervisorToolAdditionRequests.jsx
import React, { useState } from 'react';
import './SupervisorToolAdditionRequests.css';

export default function SupervisorRequestToolPage() {
  const [toolName, setToolName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const sessionId = localStorage.getItem('session_id');
      const res = await fetch('http://localhost:8000/api/supervisor/tool-additions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': sessionId || ''
        },
        body: JSON.stringify({ tool_name: toolName, quantity: Number(quantity) })
      });
      if (!res.ok) throw new Error('Failed to submit tool addition request');
      setSuccess('Tool addition request submitted successfully!');
      setToolName('');
      setQuantity(1);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to submit');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="supervisor-tool-addition-container">
      <h1>Tool Addition Request</h1>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <div className="form-wrapper glass">
        <h2>Request New Tool</h2>
        <form className="tool-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="toolName">Tool Name</label>
            <input
              id="toolName"
              type="text"
              value={toolName}
              onChange={e => setToolName(e.target.value)}
              placeholder="Enter tool name"
              required
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="quantity">Quantity</label>
            <input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              required
              className="form-input"
            />
          </div>
          
          <div className="form-actions">
            <button 
              type="submit" 
              disabled={loading}
              className="submit-btn"
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
