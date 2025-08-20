import React, { useEffect, useState } from 'react';
import TopBar from './TopBar';

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
      const res = await fetch('http://localhost:8000/api/officer/tool-requests', {
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
      const res = await fetch(`http://localhost:8000/api/officer/tool-requests/${requestId}/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': sessionId
        }
      });
      if (res.ok) {
        const msg = `Request ${action === 'approve' ? 'approved' : 'rejected'} successfully.`;
        setActionMsg(msg);
        alert(msg);
        fetchRequests();
      } else {
        const data = await res.json();
        const errMsg = data.detail || 'Action failed.';
        setError(errMsg);
        alert(errMsg);
      }
    } catch (e) {
      setError('Action failed.');
      alert('Action failed.');
    }
  };

  return (
    <div className="dashboard-container">
      <TopBar />
      <h2 style={{ textAlign: 'center', marginTop: '30px' }}>Approve Tool Requests</h2>
      {loading ? <p>Loading...</p> : null}
      {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
      {actionMsg && <div style={{ color: 'green', marginBottom: 16 }}>{actionMsg}</div>}
      <div className="table-wrapper">
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 24 }}>
          <thead>
            <tr style={{ background: '#f1f5f9' }}>
              <th style={thStyle}>Request ID</th>
              <th style={thStyle}>Tool Name</th>
              <th style={thStyle}>Operator ID</th>
              <th style={thStyle}>Quantity</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(Array.isArray(requests) ? requests : []).length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: '#888' }}>No pending requests</td></tr>
            ) : (
              (Array.isArray(requests) ? requests : []).map(req => (
                <tr key={req.request_id}>
                  <td style={tdStyle}>{req.request_id}</td>
                  <td style={tdStyle}>{req.tool_name}</td>
                  <td style={tdStyle}>{req.operator_id}</td>
                  <td style={tdStyle}>{req.requested_qty}</td>
                  <td style={tdStyle}>
                    <button onClick={() => handleAction(req.request_id, 'approve')} style={approveBtnStyle}>Approve</button>
                    <button onClick={() => handleAction(req.request_id, 'reject')} style={rejectBtnStyle}>Reject</button>
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

const thStyle = {
  border: 'none',
  padding: '14px 10px',
  fontWeight: '600',
  fontSize: '1rem',
  color: '#333'
};

const tdStyle = {
  borderBottom: '1px solid #e2e8f0',
  padding: '12px 10px',
  textAlign: 'center',
  color: '#444'
};

const approveBtnStyle = {
  color: 'white',
  background: '#22c55e',
  border: 'none',
  padding: '8px 18px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '1rem',
  marginRight: '8px'
};

const rejectBtnStyle = {
  color: 'white',
  background: '#d9534f',
  border: 'none',
  padding: '8px 18px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '1rem'
};
