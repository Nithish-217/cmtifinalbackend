// src/pages/RequestToolPage.jsx

import React, { useEffect, useState } from 'react';
import TopBar from './TopBar';
import './OfficerDashboard.css';

export default function RequestToolPage() {
  const [tools, setTools] = useState([]);
  const [selectedTool, setSelectedTool] = useState(null);
  const [qty, setQty] = useState(1);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

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

    const handleRequest = async (e) => {
      e.preventDefault();
      setSuccess('');
      setError('');
      if (!selectedTool) {
        setError('Please select a tool.');
        return;
      }
      if (qty <= 0) {
        setError('Quantity must be at least 1.');
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
          setSelectedTool(null);
          setQty(1);
        } else {
          const data = await res.json();
          setError(data.detail || 'Failed to submit request.');
        }
      } catch (err) {
        setError('Failed to submit request.');
      }
  };

  return (
    <div className="dashboard-container">
      <TopBar />
      <h2>Request Tool</h2>
      {success && <div style={{ color: 'green', marginBottom: 16 }}>{success}</div>}
      {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
      <form onSubmit={handleRequest} className="form-box" style={{ marginBottom: 32 }}>
        <div className="table-wrapper">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Sl no</th>
                <th>ID</th>
                <th>Tool Name</th>
                <th>Range (mm)</th>
                <th>Identification Code</th>
                <th>Make</th>
                <th>Quantity</th>
                <th>Location</th>
                <th>Gauge</th>
                <th>Remarks</th>
                <th>Added At</th>
                <th>Select</th>
                <th>Request Qty</th>
              </tr>
            </thead>
            <tbody>
              {tools.length === 0 ? (
                <tr><td colSpan={13} style={{ textAlign: 'center', color: '#888' }}>No tools available</td></tr>
              ) : (
                tools.map((tool, idx) => (
                  <tr key={tool.id}>
                    <td>{idx + 1}</td>
                    <td>{tool.id}</td>
                    <td>{tool.tool_name || '-'}</td>
                    <td>{tool.range_mm || '-'}</td>
                    <td>{tool.identification_code || '-'}</td>
                    <td>{tool.make || '-'}</td>
                    <td>{tool.quantity ?? 0}</td>
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
                      />
                    </td>
                    <td>
                      {selectedTool === tool.id ? (
                        <input
                          type="number"
                          min="1"
                          max={tool.quantity ?? 0}
                          value={qty}
                          onChange={e => setQty(Number(e.target.value))}
                          style={{ width: 60 }}
                        />
                      ) : null}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <button type="submit" style={{
          color: 'white',
          background: '#2563eb',
          border: 'none',
          padding: '10px 22px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '1rem',
          boxShadow: '0 2px 6px rgba(37,99,235,0.10)'
        }}>Request Tool</button>
      </form>
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
