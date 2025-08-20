// src/pages/ReportIssuePage.jsx
import React, { useEffect, useState } from 'react';
import TopBar from './TopBar';
import './OfficerDashboard.css';

export default function ReportIssuePage() {
  const [tools, setTools] = useState([]);
  const [toolId, setToolId] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function loadTools() {
      try {
        const sessionId = localStorage.getItem('session_id');
        const res = await fetch('http://localhost:8000/api/v1/operator/tools', {
          headers: { 'x-session-id': sessionId || '' }
        });
        const data = await res.json();
        setTools(Array.isArray(data) ? data : []);
      } catch (_) {
        // ignore
      }
    }
    loadTools();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const sessionId = localStorage.getItem('session_id');
      const res = await fetch('http://localhost:8000/api/operator/tool-issues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': sessionId || ''
        },
        body: JSON.stringify({ tool_id: Number(toolId), description })
      });
      if (!res.ok) throw new Error('Failed to submit issue');
      setSuccess('Tool issue reported successfully.');
      setToolId('');
      setDescription('');
    } catch (err) {
      setError(err.message || 'Failed to submit issue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <TopBar />
      <div className="form-wrapper">
        <h2>Report Tool Issue</h2>
        {error && <div style={{color:'red', marginBottom: 12}}>{error}</div>}
        {success && <div style={{color:'green', marginBottom: 12}}>{success}</div>}
        <form className="form-box" onSubmit={handleSubmit}>
          <label>Tool</label>
          <select value={toolId} onChange={e => setToolId(e.target.value)} required>
            <option value="">Select tool</option>
            {tools.map(t => (
              <option key={t.id} value={t.id}>{t.tool_name}</option>
            ))}
          </select>

          <label>Issue Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the issue" required></textarea>

          <button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit Issue'}</button>
        </form>
      </div>
    </div>
  );
}
