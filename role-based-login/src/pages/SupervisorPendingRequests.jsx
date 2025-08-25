import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterBar from '../components/FilterBar';
import './SupervisorPendingRequests.css';

export default function SupervisorPendingRequests() {
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
      const response = await fetch('http://localhost:8000/api/v1/supervisor/tool-addition-requests?status=pending', {
        headers: {
          'x-session-id': sessionId || ''
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRequests(Array.isArray(data) ? data : []);
        setFilteredRequests(Array.isArray(data) ? data : []);
      } else {
        setError('Failed to fetch pending requests');
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
      <div className="pending-requests-container">
        <div className="loading-message">Loading pending requests...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pending-requests-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="pending-requests-container">
      <div className="page-header">
        <button className="back-button" onClick={() => navigate('/supervisor-dashboard')}>
          ← Back to Dashboard
        </button>
        <h1>Pending Tool Requests</h1>
        <p>Tool requests awaiting officer approval ({filteredRequests.length} of {requests.length} requests)</p>
      </div>

      <FilterBar
        onFilter={handleFilter}
        placeholder="Search by tool name, description, or ID..."
      />

      <div className="requests-table-container">
        {filteredRequests.length === 0 ? (
          <div className="no-requests">
            <p>No pending requests found.</p>
          </div>
        ) : (
          <table className="requests-table">
            <thead>
              <tr>
                <th>REQUEST ID</th>
                <th>TOOL NAME</th>
                <th>DESCRIPTION</th>
                <th>STATUS</th>
                <th>REQUESTED AT</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <tr key={request.id}>
                  <td>{request.id}</td>
                  <td>{request.tool_name || 'N/A'}</td>
                  <td>{request.description || 'No description'}</td>
                  <td><span className="status-badge pending">PENDING</span></td>
                  <td>{new Date(request.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
