// src/pages/OperatorDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OperatorDashboard.css';

export default function OperatorDashboard() {
  const navigate = useNavigate();
  const [tools, setTools] = useState([]);
  const [selectedTool, setSelectedTool] = useState(null);
  const [qty, setQty] = useState(1);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [statistics, setStatistics] = useState({
    totalToolsUsed: 0,
    totalRequests: 0,
    totalIssues: 0
  });

  useEffect(() => {
    const sessionId = localStorage.getItem('session_id');
    fetch('http://localhost:8000/api/v1/operator/tools', {
      headers: {
        'Content-Type': 'application/json',
        ...(sessionId ? { 'x-session-id': sessionId } : {})
      }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTools(data);
        } else {
          setTools([]);
        }
      })
      .catch(() => setTools([]));
  }, []);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const sessionId = localStorage.getItem('session_id');
        const res = await fetch('http://localhost:8000/api/v1/operator/statistics', {
          headers: {
            'Content-Type': 'application/json',
            ...(sessionId ? { 'x-session-id': sessionId } : {})
          }
        });
        if (res.ok) {
          const data = await res.json();
          setStatistics({
            totalToolsUsed: data.total_tools_used || 0,
            totalRequests: data.total_requests || 0,
            totalIssues: data.total_issues || 0
          });
          
          // Store full name in localStorage for sidebar
          if (data.full_name) {
            localStorage.setItem('full_name', data.full_name);
          }
        }
      } catch (err) {
        console.error('Failed to fetch statistics:', err);
      }
    };

    fetchStatistics();

    // Listen for localStorage changes to refresh statistics
    const handleStorageChange = (e) => {
      if (e.key === 'last_issue_report') {
        fetchStatistics();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check for changes when the page becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchStatistics();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleRequest = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    if (!selectedTool) {
      setError('Please select a tool.');
      window.alert('Please select a tool.');
      return;
    }
    if (qty <= 0) {
      setError('Quantity must be at least 1.');
      window.alert('Quantity must be at least 1.');
      return;
    }
    try {
      const sessionId = localStorage.getItem('session_id');
      const res = await fetch('http://localhost:8000/api/v1/operator/tool-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(sessionId ? { 'x-session-id': sessionId } : {})
        },
        body: JSON.stringify({ tool_id: selectedTool, requested_qty: qty }),
      });
      if (res.ok) {
        setSuccess('Tool request submitted successfully!');
        window.alert('Tool request submitted successfully!');
        setSelectedTool(null);
        setQty(1);
        // Refresh statistics after successful request
        const statsRes = await fetch('http://localhost:8000/api/v1/operator/statistics', {
          headers: {
            'Content-Type': 'application/json',
            ...(sessionId ? { 'x-session-id': sessionId } : {})
          }
        });
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStatistics({
            totalToolsUsed: statsData.total_tools_used || 0,
            totalRequests: statsData.total_requests || 0,
            totalIssues: statsData.total_issues || 0
          });
        }
      } else {
        const data = await res.json();
        setError(data.detail || 'Failed to submit request.');
        window.alert(data.detail || 'Failed to submit request.');
      }
    } catch (err) {
      setError('Failed to submit request.');
      window.alert('Failed to submit request.');
    }
  };

  const handleStatBoxClick = (type) => {
    switch (type) {
      case 'tools-used':
        navigate('/operator/used-tools');
        break;
      case 'tool-requests':
        navigate('/operator/tool-requests');
        break;
      case 'reported-issues':
        navigate('/operator/reported-issues');
        break;
      default:
        break;
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Welcome, Operator!</h1>
      
      {/* Statistics Boxes */}
      <div className="stats-container">
        <div 
          className="stat-box glass clickable" 
          onClick={() => handleStatBoxClick('tools-used')}
        >
          <div className="stat-icon">🔧</div>
          <div className="stat-content">
            <h3>Total Tools Used</h3>
            <div className="stat-number">{statistics.totalToolsUsed}</div>
            <p>Approved tool requests</p>
            <div className="click-hint">Click to view details</div>
          </div>
        </div>
        
        <div 
          className="stat-box glass clickable" 
          onClick={() => handleStatBoxClick('tool-requests')}
        >
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>Requested Tools</h3>
            <div className="stat-number">{statistics.totalRequests}</div>
            <p>Total tool requests made</p>
            <div className="click-hint">Click to view details</div>
          </div>
        </div>
        
        <div 
          className="stat-box glass clickable" 
          onClick={() => handleStatBoxClick('reported-issues')}
        >
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3>Reported Issues</h3>
            <div className="stat-number">{statistics.totalIssues}</div>
            <p>Issues reported to officers</p>
            <div className="click-hint">Click to view details</div>
          </div>
        </div>
      </div>
      
      <div className="tool-request-section">
        <h2>Request Tool</h2>
        {success && <div className="success-message">{success}</div>}
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleRequest} className="request-form">
          <div className="table-wrapper glass">
            <table className="styled-table glass">
              <thead>
                <tr>
                  <th>Sl no</th>
                  <th>ID</th>
                  <th>Tool Name</th>
                  <th>Range (mm)</th>
                  <th>Identification Code</th>
                  <th>Make</th>
                  <th>Location</th>
                  <th>Gauge</th>
                  <th>Remarks</th>
                  <th>Added At</th>
                  <th>Select</th>
                  <th>Request Quantity</th>
                </tr>
              </thead>
              <tbody>
                {tools.length === 0 ? (
                  <tr><td colSpan={12} className="no-tools">No tools available</td></tr>
                ) : (
                  tools.map((tool, idx) => (
                    <tr key={tool.id}>
                      <td>{idx + 1}</td>
                      <td>{tool.id}</td>
                      <td>{tool.tool_name || '-'}</td>
                      <td>{tool.range_mm || '-'}</td>
                      <td>{tool.identification_code || '-'}</td>
                      <td>{tool.make || '-'}</td>
                      <td>{tool.location || '-'}</td>
                      <td>{tool.gauge || '-'}</td>
                      <td>{tool.remarks || '-'}</td>
                      <td>{tool.added_at ? new Date(tool.added_at).toLocaleString() : '-'}</td>
                      <td>
                        <input
                          type="radio"
                          name="tool"
                          value={tool.id}
                          checked={selectedTool === tool.id}
                          onChange={() => setSelectedTool(tool.id)}
                          className="tool-radio"
                        />
                      </td>
                      <td>
                        {selectedTool === tool.id ? (
                          <div className="quantity-input-wrapper">
                            <input
                              type="number"
                              min="1"
                              max={tool.quantity ?? 0}
                              value={qty}
                              onChange={e => setQty(Number(e.target.value))}
                              className="quantity-input"
                              placeholder="Qty"
                            />
                            <span className="max-quantity">Max: {tool.quantity ?? 0}</span>
                          </div>
                        ) : (
                          <span className="select-tool-hint">Select tool first</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="request-submit-btn">
              Request Tool
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/operator/report-issue')}
              className="report-issue-btn"
            >
              Report Issue
            </button>
          </div>
        </form>
      </div>

      {/* Floating decorative shapes */}
      <div className="dashboard-decoration">
        <div className="floating-shape shape-1" />
        <div className="floating-shape shape-2" />
        <div className="floating-shape shape-3" />
      </div>
    </div>
  );
}
