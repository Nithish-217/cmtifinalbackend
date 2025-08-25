import React, { useState, useEffect } from 'react';
import FilterBar from '../components/FilterBar';
import './SupervisorResponse.css';

export default function SupervisorResponse() {
  const [responses, setResponses] = useState([]);
  const [filteredResponses, setFilteredResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    async function fetchResponses() {
      setLoading(true);
      try {
        const sessionId = localStorage.getItem('session_id');
        const response = await fetch('http://localhost:8000/api/v1/supervisor/tool-requests', {
          headers: { 'x-session-id': sessionId || '' }
        });
        
        if (response.ok) {
          const data = await response.json();
          // Filter only responded requests (approved or rejected)
          const respondedRequests = Array.isArray(data) ? data.filter(req => 
            req.status === 'APPROVED' || req.status === 'REJECTED'
          ) : [];
          setResponses(respondedRequests);
          setFilteredResponses(respondedRequests);
        } else {
          setError('Failed to fetch responses');
        }
      } catch (err) {
        setError('Error connecting to server');
        console.error('Error fetching responses:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchResponses();
  }, []);

  // Filter function
  const handleFilter = (searchTerm, dateValue) => {
    let filtered = [...responses];

    // Filter by search term (tool name, operator name, request ID)
    if (searchTerm.trim()) {
      filtered = filtered.filter(response =>
        response.tool_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        response.operator_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        response.request_id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by date
    if (dateValue) {
      filtered = filtered.filter(response => {
        const responseDate = new Date(response.requested_at).toDateString();
        const filterDate = new Date(dateValue).toDateString();
        return responseDate === filterDate;
      });
    }

    setFilteredResponses(filtered);
  };

  // Clear filters
  const handleClearFilters = () => {
    setFilteredResponses(responses);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED':
        return '#10b981';
      case 'REJECTED':
        return '#ef4444';
      case 'PENDING':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'APPROVED':
        return '✅';
      case 'REJECTED':
        return '❌';
      case 'PENDING':
        return '⏳';
      default:
        return '❓';
    }
  };

  if (loading) {
    return (
      <div className="supervisor-response-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading supervisor responses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="supervisor-response-container">
        <div className="error-message">
          <h3>Error Loading Responses</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="supervisor-response-container">
      <div className="page-header">
        <h1>Supervisor Responses</h1>
        <p>View supervisor responses to tool requests from operators ({filteredResponses.length} of {responses.length} responses)</p>
      </div>

      <FilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        onSearch={handleFilter}
        onClear={handleClearFilters}
        placeholder="Search by tool name, operator, or request ID..."
      />

      {filteredResponses.length === 0 ? (
        <div className="no-responses">
          <div className="no-responses-icon">📭</div>
          <h3>No Responses Yet</h3>
          <p>Supervisor responses will appear here once they review tool requests.</p>
        </div>
      ) : (
        <div className="responses-table-container">
          <table className="responses-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Tool Name</th>
                <th>Operator</th>
                <th>Quantity</th>
                <th>Request Date</th>
                <th>Status</th>
                <th>Response Date</th>
                <th>Comments</th>
              </tr>
            </thead>
            <tbody>
              {filteredResponses.map((response) => (
                <tr key={response.request_id}>
                  <td>{response.request_id}</td>
                  <td>{response.tool_name}</td>
                  <td>{response.operator_name || 'Unknown'}</td>
                  <td>{response.requested_qty}</td>
                  <td>{new Date(response.requested_at).toLocaleDateString()}</td>
                  <td>
                    <span 
                      className={`status-badge ${response.status.toLowerCase()}`}
                      style={{ backgroundColor: getStatusColor(response.status) }}
                    >
                      {getStatusIcon(response.status)} {response.status}
                    </span>
                  </td>
                  <td>{response.updated_at ? new Date(response.updated_at).toLocaleDateString() : '-'}</td>
                  <td>{response.comments || 'No comments'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

