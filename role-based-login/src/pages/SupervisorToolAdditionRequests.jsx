// src/pages/SupervisorRequestToolPage.jsx
import React, { useState } from 'react';
import TopBar from './TopBar';
import './OfficerDashboard.css'; // Reuse the existing styles

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
      setSuccess('Tool addition request submitted');
      setToolName('');
      setQuantity(1);
    } catch (err) {
      setError(err.message || 'Failed to submit');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="dashboard-container">
      <TopBar />
      <div className="form-wrapper">
        <h2 style={{ textAlign: 'center', marginTop: '80px' }}>Supervisor - Tool Addition Request</h2>
        {error && <div style={{color:'red', marginBottom:12}}>{error}</div>}
        {success && <div style={{color:'green', marginBottom:12}}>{success}</div>}
        <form className="form-box" onSubmit={handleSubmit}>
          <label>Tool Name</label>
          <input value={toolName} onChange={e=>setToolName(e.target.value)} placeholder="Enter tool name" required />
          <label>Quantity</label>
          <input type="number" min="1" value={quantity} onChange={e=>setQuantity(e.target.value)} required />
          <button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit Request'}</button>
        </form>
      </div>
    </div>
  );
}
