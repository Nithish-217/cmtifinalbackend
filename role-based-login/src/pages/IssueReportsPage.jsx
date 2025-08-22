import React, { useState, useEffect } from 'react';
import './IssueReportsPage.css';

export default function IssueReports() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      const sessionId = localStorage.getItem('session_id');
      console.log('Fetching issues with session:', sessionId);
      const res = await fetch('http://localhost:8000/api/v1/officer/tool-issues', {
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': sessionId
        }
      });
      if (res.ok) {
        const data = await res.json();
        console.log('Fetched issues:', data);
        setIssues(data);
      } else {
        console.error('Failed to fetch issues:', res.status, res.statusText);
        setError('Failed to fetch issues');
      }
    } catch (err) {
      console.error('Error fetching issues:', err);
      setError('Failed to fetch issues');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (issueId, action, response = '') => {
    try {
      const sessionId = localStorage.getItem('session_id');
      let url = '';
      let method = 'POST';
      let body = {};

      if (action === 'approve') {
        url = `http://localhost:8000/api/v1/officer/tool-issues/${issueId}/approve`;
        body = { response: response || 'Issue approved' };
      } else if (action === 'reject') {
        url = `http://localhost:8000/api/v1/officer/tool-issues/${issueId}/reject`;
        body = { response: response || 'Issue rejected' };
      }

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': sessionId
        },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        setSuccess(`Issue ${action}d successfully`);
        fetchIssues(); // Refresh the list
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await res.json();
        setError(data.detail || `Failed to ${action} issue`);
        setTimeout(() => setError(''), 3000);
      }
    } catch (err) {
      setError(`Failed to ${action} issue`);
      setTimeout(() => setError(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="issue-reports-container">
        <div className="loading">Loading issues...</div>
      </div>
    );
  }

  return (
    <div className="issue-reports-container">
      <h1>Tool Issue Reports</h1>
      
      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}
      
      <div className="issues-table-wrapper">
        <table className="issues-table">
          <thead>
            <tr>
              <th>Issue ID</th>
              <th>Tool ID</th>
              <th>Operator ID</th>
              <th>Description</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {issues.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-issues">No issues reported</td>
              </tr>
            ) : (
              issues.map((issue) => (
                <tr key={issue.id} className={`issue-row ${issue.status.toLowerCase()}`}>
                  <td>{issue.id}</td>
                  <td>{issue.tool_id}</td>
                  <td>{issue.operator_id}</td>
                  <td className="issue-description">{issue.description}</td>
                  <td>
                    <span className={`status-badge ${issue.status.toLowerCase()}`}>
                      {issue.status}
                    </span>
                  </td>
                  <td>{new Date(issue.created_at).toLocaleString()}</td>
                  <td className="actions-cell">
                    {issue.status === 'OPEN' ? (
                      <div className="action-buttons">
                        <button
                          className="approve-btn"
                          onClick={() => {
                            const response = prompt('Enter approval response (optional):');
                            if (response !== null) {
                              handleAction(issue.id, 'approve', response);
                            }
                          }}
                        >
                          Approve
                        </button>
                        <button
                          className="reject-btn"
                          onClick={() => {
                            const response = prompt('Enter rejection reason (optional):');
                            if (response !== null) {
                              handleAction(issue.id, 'reject', response);
                            }
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="processed-status">
                        {issue.status === 'APPROVED' ? '✅ Approved' : '❌ Rejected'}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
