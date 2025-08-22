import React, { useEffect, useState } from 'react';
import './ViewToolRequestsPage.css';

export default function ViewToolRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  const fetchRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const sessionId = localStorage.getItem('session_id');
      // Fetch all tool requests, not just pending ones
      const res = await fetch('http://localhost:8000/api/v1/officer/tool-requests', {
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

  const handleAction = async (requestId, action) => {
    setActionMsg('');
    setError('');
    try {
      const sessionId = localStorage.getItem('session_id');
      const res = await fetch(`http://localhost:8000/api/v1/officer/tool-requests/${requestId}/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': sessionId
        }
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
    } catch (e) {
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
    <div className="view-tool-requests-container">
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
