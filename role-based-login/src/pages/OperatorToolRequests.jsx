// src/pages/OperatorToolRequests.jsx
import React, { useEffect, useState } from 'react';
import './OperatorToolRequests.css';

export default function OperatorToolRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const sessionId = localStorage.getItem('session_id');
      const res = await fetch('http://localhost:8000/api/v1/operator/tool-requests', {
        headers: { 'x-session-id': sessionId }
      });
      if (!res.ok) throw new Error('Failed to fetch requests');
      const data = await res.json();
      setRequests(data);
    } catch (e) {
      setError('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

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
      <div className="operator-tool-requests-container">
        <div className="loading">Loading your tool requests...</div>
      </div>
    );
  }

  return (
    <div className="operator-tool-requests-container">
      <h1>My Tool Requests</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="requests-table-wrapper glass">
        {requests.length === 0 ? (
          <div className="no-requests">
            <div className="no-requests-icon">📋</div>
            <h3>No Tool Requests Yet</h3>
            <p>You haven't made any tool requests yet. Go to the dashboard to request tools.</p>
          </div>
        ) : (
          <table className="requests-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Tool ID</th>
                <th>Tool Name</th>
                <th>Requested Quantity</th>
                <th>Status</th>
                <th>Requested At</th>
                <th>Processed At</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.request_id}>
                  <td>{request.request_id}</td>
                  <td>{request.tool_id}</td>
                  <td>{request.tool_name || 'N/A'}</td>
                  <td>{request.requested_qty}</td>
                  <td>{getStatusBadge(request.status)}</td>
                  <td>{request.requested_at ? new Date(request.requested_at).toLocaleString() : 'N/A'}</td>
                  <td>{request.processed_at ? new Date(request.processed_at).toLocaleString() : 'N/A'}</td>
                  <td>{request.remarks || 'N/A'}</td>
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
