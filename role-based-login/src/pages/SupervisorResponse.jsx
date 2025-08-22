import React, { useState, useEffect } from 'react';
import './SupervisorResponse.css';

export default function SupervisorResponse() {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching supervisor responses
    // In a real app, this would fetch from the backend
    setTimeout(() => {
      setResponses([
        {
          id: 1,
          toolName: 'Drill Machine',
          operatorName: 'John Doe',
          requestDate: '2024-01-15',
          responseDate: '2024-01-16',
          status: 'APPROVED',
          supervisorName: 'Mike Johnson',
          comments: 'Approved for maintenance work. Please return by end of day.',
          quantity: 1
        },
        {
          id: 2,
          toolName: 'Welding Kit',
          operatorName: 'Jane Smith',
          requestDate: '2024-01-14',
          responseDate: '2024-01-15',
          status: 'REJECTED',
          supervisorName: 'Mike Johnson',
          comments: 'Currently in use by another team. Please request again next week.',
          quantity: 1
        },
        {
          id: 3,
          toolName: 'Safety Harness',
          operatorName: 'Bob Wilson',
          requestDate: '2024-01-13',
          responseDate: '2024-01-14',
          status: 'APPROVED',
          supervisorName: 'Sarah Davis',
          comments: 'Approved for height work. Ensure proper safety protocols.',
          quantity: 2
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

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

  return (
    <div className="supervisor-response-container">
      <div className="page-header">
        <h1>Supervisor Responses</h1>
        <p>View supervisor responses to tool requests from operators</p>
      </div>

      <div className="responses-grid">
        {responses.map((response) => (
          <div key={response.id} className="response-card">
            <div className="response-header">
              <div className="tool-info">
                <h3>{response.toolName}</h3>
                <span className="operator-name">Requested by: {response.operatorName}</span>
              </div>
              <div className="status-badge" style={{ backgroundColor: getStatusColor(response.status) }}>
                <span className="status-icon">{getStatusIcon(response.status)}</span>
                {response.status}
              </div>
            </div>
            
            <div className="response-details">
              <div className="detail-row">
                <span className="detail-label">Quantity:</span>
                <span className="detail-value">{response.quantity}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Request Date:</span>
                <span className="detail-value">{response.requestDate}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Response Date:</span>
                <span className="detail-value">{response.responseDate}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Supervisor:</span>
                <span className="detail-value">{response.supervisorName}</span>
              </div>
            </div>
            
            <div className="response-comments">
              <h4>Comments:</h4>
              <p>{response.comments}</p>
            </div>
          </div>
        ))}
      </div>

      {responses.length === 0 && (
        <div className="no-responses">
          <div className="no-responses-icon">📭</div>
          <h3>No Responses Yet</h3>
          <p>Supervisor responses will appear here once they review tool requests.</p>
        </div>
      )}
    </div>
  );
}
