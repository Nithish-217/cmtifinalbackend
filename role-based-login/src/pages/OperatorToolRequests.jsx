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

  const handleCollectTool = async (requestId, toolName, toolId) => {
    try {
      const sessionId = localStorage.getItem('session_id');
      console.log('Attempting to collect tool:', { requestId, sessionId });
      
      const res = await fetch(`http://localhost:8000/api/v1/operator/collect-tool/${requestId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(sessionId ? { 'x-session-id': sessionId } : {})
        }
      });
      
      console.log('Response status:', res.status);
      
      if (res.ok) {
        const data = await res.json();
        console.log('Success response:', data);
        alert(`✅ Tool Collected Successfully!\n\nTool: ${data.tool_name}\nID: ${data.tool_id}\nRequest ID: ${data.request_id}`);
        fetchRequests(); // Refresh the requests list
      } else {
        const errorText = await res.text();
        console.error('Error response:', res.status, errorText);
        try {
          const errorData = JSON.parse(errorText);
          alert(`Error: ${errorData.detail || 'Failed to collect tool'}`);
        } catch {
          alert(`Error ${res.status}: ${errorText || 'Failed to collect tool'}`);
        }
      }
    } catch (err) {
      console.error('Network error:', err);
      alert(`Network error: ${err.message || 'Failed to collect tool'}`);
    }
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
                <th>Action</th>
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
                  <td>
                    {request.status.toLowerCase() === 'approved' ? (
                      <button 
                        className="collect-btn"
                        onClick={() => handleCollectTool(request.request_id, request.tool_name, request.tool_id)}
                      >
                        🔧 Collect
                      </button>
                    ) : (
                      <span className="no-action">
                        {request.status.toLowerCase() === 'pending' ? 'Waiting...' : 
                         request.status.toLowerCase() === 'rejected' ? 'Rejected' : 
                         request.status.toLowerCase() === 'received' ? '✅ Collected' : 
                         request.status.toLowerCase() === 'collected' ? '✅ Collected' : '-'}
                      </span>
                    )}
                  </td>
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
