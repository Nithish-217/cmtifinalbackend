import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterBar from '../components/FilterBar';
import './SupervisorRejectedRequests.css';

export default function SupervisorRejectedRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const sessionId = localStorage.getItem('session_id');
      const response = await fetch('http://localhost:8000/api/v1/supervisor/tool-addition-requests?status=rejected', {
        headers: {
          'x-session-id': sessionId || ''
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRequests(Array.isArray(data) ? data : []);
        setFilteredRequests(Array.isArray(data) ? data : []);
      } else {
        setError('Failed to fetch rejected requests');
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (searchTerm, dateFilter) => {
    let filtered = requests;

    if (searchTerm) {
      filtered = filtered.filter(request =>
        request.tool_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.rejection_reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.id?.toString().includes(searchTerm)
      );
    }

    if (dateFilter) {
      filtered = filtered.filter(request => {
        const requestDate = new Date(request.created_at).toDateString();
        const filterDate = new Date(dateFilter).toDateString();
        return requestDate === filterDate;
      });
    }

    setFilteredRequests(filtered);
  };

  if (loading) {
    return (
      <div className="rejected-requests-container">
        <div className="loading-message">Loading rejected requests...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rejected-requests-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="rejected-requests-container">
      <div className="page-header">
        <button className="back-button" onClick={() => navigate('/supervisor-dashboard')}>
          ← Back to Dashboard
        </button>
        <h1>Rejected Tool Requests</h1>
        <p>Tool requests rejected by officer ({filteredRequests.length} of {requests.length} requests)</p>
      </div>

      <FilterBar
        onFilter={handleFilter}
        placeholder="Search by tool name, description, rejection reason, or ID..."
      />

      <div className="requests-table-container">
        {filteredRequests.length === 0 ? (
          <div className="no-requests">
            <p>No rejected requests found.</p>
          </div>
        ) : (
          <table className="requests-table">
            <thead>
              <tr>
                <th>REQUEST ID</th>
                <th>TOOL NAME</th>
                <th>DESCRIPTION</th>
                <th>STATUS</th>
                <th>REJECTION REASON</th>
                <th>REQUESTED AT</th>
                <th>REJECTED AT</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <tr key={request.id}>
                  <td>{request.id}</td>
                  <td>{request.tool_name || 'N/A'}</td>
                  <td>{request.description || 'No description'}</td>
                  <td><span className="status-badge rejected">REJECTED</span></td>
                  <td>{request.rejection_reason || 'No reason provided'}</td>
                  <td>{new Date(request.created_at).toLocaleDateString()}</td>
                  <td>{request.updated_at ? new Date(request.updated_at).toLocaleDateString() : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
