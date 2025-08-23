// src/pages/OperatorReportedIssues.jsx
import React, { useEffect, useState } from 'react';
import './OperatorReportedIssues.css';

export default function OperatorReportedIssues() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchIssues = async () => {
    setLoading(true);
    setError('');
    try {
      const sessionId = localStorage.getItem('session_id');
      const res = await fetch('http://localhost:8000/api/v1/operator/tool-issues', {
        headers: { 'x-session-id': sessionId }
      });
      if (!res.ok) throw new Error('Failed to fetch issues');
      const data = await res.json();
      setIssues(data);
    } catch (e) {
      setError('Failed to fetch issues');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchIssues(); }, []);

  const getStatusBadge = (status) => {
    const statusClass = status.toLowerCase();
    return (
      <span className={`status-badge ${statusClass}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="operator-reported-issues-container">
        <div className="loading">Loading your reported issues...</div>
      </div>
    );
  }

  return (
    <div className="operator-reported-issues-container">
      <h1>My Reported Issues</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="issues-table-wrapper glass">
        {issues.length === 0 ? (
          <div className="no-issues">
            <div className="no-issues-icon">⚠️</div>
            <h3>No Issues Reported Yet</h3>
            <p>You haven't reported any tool issues yet. Go to the dashboard to report issues.</p>
          </div>
        ) : (
          <table className="issues-table">
            <thead>
              <tr>
                <th>Issue ID</th>
                <th>Tool ID</th>
                <th>Tool Name</th>
                <th>Issue Description</th>
                <th>Status</th>
                <th>Reported At</th>
                <th>Response</th>
                <th>Response At</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue) => (
                <tr key={issue.issue_id}>
                  <td>{issue.issue_id}</td>
                  <td>{issue.tool_id}</td>
                  <td>{issue.tool_name || 'N/A'}</td>
                  <td className="issue-description">{issue.description}</td>
                  <td>{getStatusBadge(issue.status)}</td>
                  <td>{issue.reported_at ? new Date(issue.reported_at).toLocaleString() : 'N/A'}</td>
                  <td className="issue-response">{issue.response || 'No response yet'}</td>
                  <td>{issue.response_at ? new Date(issue.response_at).toLocaleString() : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Floating decorative shapes */}
      <div className="page-decoration">
        <div className="floating-shape shape-1" />
        <div className="floating-shape shape-2" />
        <div className="floating-shape shape-3" />
      </div>
    </div>
  );
}
