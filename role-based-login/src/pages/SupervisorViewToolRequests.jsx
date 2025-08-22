import React, { useEffect, useState } from 'react';
import './SupervisorViewToolRequests.css';

export default function SupervisorViewToolRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  // Rewritten fetch logic for supervisor tool requests
  const fetchRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const sessionId = localStorage.getItem('session_id');
      const res = await fetch('http://localhost:8000/api/supervisor/tool-requests', {
        headers: {
          'x-session-id': sessionId
        }
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Supervisor requests fetch failed:', res.status, errorData);
        throw new Error(`Failed to fetch requests: ${res.status} - ${errorData.detail || 'Unknown error'}`);
      }
      const data = await res.json();
      console.log('Fetched supervisor requests:', data);
      setRequests(data);
    } catch (err) {
      console.error('Supervisor requests error:', err);
      setError(`Failed to fetch requests: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (requestId, action) => {
    setActionMsg('');
    setError('');
    try {
      const sessionId = localStorage.getItem('session_id');
      const res = await fetch(`http://localhost:8000/api/supervisor/tool-requests/${requestId}/${action}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-session-id': sessionId
        },
      });
      if (res.ok) {
        const msg = `Request ${action === 'approve' ? 'approved' : 'rejected'} successfully.`;
        setActionMsg(msg);
        setTimeout(() => setActionMsg(''), 3000);
        // Refresh the list to show updated status
        fetchRequests();
      } else {
        const data = await res.json();
        const errMsg = data.detail || 'Action failed.';
        setError(errMsg);
        setTimeout(() => setError(''), 3000);
      }
    } catch (err) {
      setError('Action failed.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const getStatusBadge = (status) => {
    const statusClass = status.toLowerCase();
    return (
      <span className={`status-badge ${statusClass}`}>
        {status}
      </span>
    );
  };

  const getActionButtons = (request) => {
    if (request.status === 'PENDING') {
      return (
        <div className="action-buttons">
          <button 
            onClick={() => handleAction(request.request_id, 'approve')} 
            className="approve-btn"
          >
            Approve
          </button>
          <button 
            onClick={() => handleAction(request.request_id, 'reject')} 
            className="reject-btn"
          >
            Reject
          </button>
        </div>
      );
    } else {
      return (
        <span className="processed-status">
          {request.status === 'APPROVED' ? '✅ Approved' : '❌ Rejected'}
        </span>
      );
    }
  };

  return (
    <div className="supervisor-view-tool-requests-container">
      <h1>Tool Requests Management</h1>
      
      {actionMsg && <div className="success-message">{actionMsg}</div>}
      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <div className="loading">Loading requests...</div>
      ) : (
        <div className="requests-table-wrapper">
          <table className="requests-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Tool Name</th>
                <th>Operator ID</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Requested At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-requests">No tool requests found</td>
                </tr>
              ) : (
                requests.map(request => (
                  <tr key={request.request_id} className={`request-row ${request.status.toLowerCase()}`}>
                    <td>{request.request_id}</td>
                    <td>{request.tool_name}</td>
                    <td>{request.operator_id}</td>
                    <td>{request.requested_qty}</td>
                    <td>{getStatusBadge(request.status)}</td>
                    <td>{new Date(request.requested_at).toLocaleString()}</td>
                    <td className="actions-cell">
                      {getActionButtons(request)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
