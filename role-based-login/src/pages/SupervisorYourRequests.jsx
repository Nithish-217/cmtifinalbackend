import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterBar from '../components/FilterBar';
import './SupervisorYourRequests.css';

export default function SupervisorYourRequests() {
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
      const response = await fetch('http://localhost:8000/api/v1/supervisor/tool-addition-requests', {
        headers: {
          'x-session-id': sessionId || ''
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRequests(Array.isArray(data) ? data : []);
        setFilteredRequests(Array.isArray(data) ? data : []);
      } else {
        setError('Failed to fetch your requests');
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
        request.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  const getStatusBadge = (status) => {
    const statusClass = status?.toLowerCase() || 'unknown';
    return <span className={`status-badge ${statusClass}`}>{status || 'Unknown'}</span>;
  };

  if (loading) {
    return (
      <div className="your-requests-container">
        <div className="loading-message">Loading your requests...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="your-requests-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="your-requests-container">
      <div className="page-header">
        <button className="back-button" onClick={() => navigate('/supervisor-dashboard')}>
          ← Back to Dashboard
        </button>
        <h1>Your Tool Addition Requests</h1>
        <p>View all tool addition requests you have made ({filteredRequests.length} of {requests.length} requests)</p>
      </div>

      <FilterBar
        onFilter={handleFilter}
        placeholder="Search by tool name, description, status, or ID..."
      />

      <div className="requests-table-container">
        {filteredRequests.length === 0 ? (
          <div className="no-requests">
            <p>No tool addition requests found.</p>
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
                <th>UPDATED AT</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <tr key={request.id}>
                  <td>{request.id}</td>
                  <td>{request.tool_name || 'N/A'}</td>
                  <td>{request.description || 'No description'}</td>
                  <td>{getStatusBadge(request.status)}</td>
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
