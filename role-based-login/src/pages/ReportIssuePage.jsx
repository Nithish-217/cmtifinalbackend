// src/pages/ReportIssuePage.jsx
import React, { useEffect, useState } from 'react';
import './ReportIssuePage.css';

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
      if (res.ok) {
        setSuccess('Tool issue reported successfully!');
        setToolId('');
        setDescription('');
        
        // Refresh statistics on the operator dashboard
        try {
          const statsRes = await fetch('http://localhost:8000/api/v1/operator/statistics', {
            headers: {
              'Content-Type': 'application/json',
              'x-session-id': sessionId || ''
            }
          });
          if (statsRes.ok) {
            // Update localStorage to trigger dashboard refresh
            const currentTime = Date.now();
            localStorage.setItem('last_issue_report', currentTime.toString());
          }
        } catch (statsErr) {
          console.error('Failed to refresh statistics:', statsErr);
        }
      } else {
        const data = await res.json();
        setError(data.detail || 'Failed to submit issue');
      }
    } catch (err) {
      setError(err.message || 'Failed to submit issue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-issue-container">
      <h1>Report Tool Issue</h1>
      
      <div className="form-wrapper glass">
        <h2>Report an Issue</h2>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form className="issue-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="tool-select">Select Tool</label>
            <select 
              id="tool-select"
              value={toolId} 
              onChange={e => setToolId(e.target.value)} 
              required
              className="form-select"
            >
              <option value="">Choose a tool...</option>
              {tools.map(t => (
                <option key={t.id} value={t.id}>{t.tool_name || 'Unknown Tool'}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="issue-description">Issue Description</label>
            <textarea 
              id="issue-description"
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              placeholder="Please describe the issue in detail..." 
              required
              className="form-textarea"
              rows="6"
            />
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              disabled={loading}
              className="submit-btn"
            >
              {loading ? 'Submitting...' : 'Submit Issue Report'}
            </button>
          </div>
        </form>
      </div>

      {/* Floating decorative shapes */}
      <div className="dashboard-decoration">
        <div className="floating-shape shape-1" />
        <div className="floating-shape shape-2" />
        <div className="floating-shape shape-3" />
      </div>
    </div>
  );
}
