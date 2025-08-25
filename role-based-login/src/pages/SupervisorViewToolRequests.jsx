import React, { useState, useEffect } from 'react';
import FilterBar from '../components/FilterBar';
import './SupervisorViewToolRequests.css';

export default function SupervisorViewToolRequests() {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMsg, setActionMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');

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
      setFilteredRequests(data);
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

  // Filter function
  const handleFilter = (searchTerm, dateValue) => {
    let filtered = [...requests];

    // Filter by search term (tool name, operator name, request ID)
    if (searchTerm.trim()) {
      filtered = filtered.filter(request =>
        request.tool_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.operator_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.request_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.status?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by date (requested_at)
    if (dateValue) {
      filtered = filtered.filter(request => {
        if (!request.requested_at) return false;
        const requestDate = new Date(request.requested_at).toDateString();
        const filterDate = new Date(dateValue).toDateString();
        return requestDate === filterDate;
      });
    }

    setFilteredRequests(filtered);
  };

  // Clear filters
  const handleClearFilters = () => {
    setFilteredRequests(requests);
  };

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
      <div className="page-header">
        <h1>Tool Requests Management</h1>
        <p>Review and approve/reject tool requests from operators ({filteredRequests.length} of {requests.length} requests)</p>
      </div>

      <FilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        onSearch={handleFilter}
        onClear={handleClearFilters}
        placeholder="Search by tool name, operator, request ID, or status..."
      />
      
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
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-requests">No tool requests found</td>
                </tr>
              ) : (
                filteredRequests.map(request => (
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
