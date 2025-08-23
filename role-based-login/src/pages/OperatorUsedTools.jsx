// src/pages/OperatorUsedTools.jsx
import React, { useEffect, useState } from 'react';
import './OperatorUsedTools.css';

export default function OperatorUsedTools() {
  const [usedTools, setUsedTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsedTools = async () => {
    setLoading(true);
    setError('');
    try {
      const sessionId = localStorage.getItem('session_id');
      const res = await fetch('http://localhost:8000/api/v1/operator/used-tools', {
        headers: { 'x-session-id': sessionId }
      });
      if (!res.ok) throw new Error('Failed to fetch used tools');
      const data = await res.json();
      setUsedTools(data);
    } catch (e) {
      setError('Failed to fetch used tools');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsedTools(); }, []);

  if (loading) {
    return (
      <div className="operator-used-tools-container">
        <div className="loading">Loading your used tools...</div>
      </div>
    );
  }

  return (
    <div className="operator-used-tools-container">
      <h1>My Used Tools</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="used-tools-table-wrapper glass">
        {usedTools.length === 0 ? (
          <div className="no-used-tools">
            <div className="no-used-tools-icon">🔧</div>
            <h3>No Tools Used Yet</h3>
            <p>You haven't used any tools yet. Approved tool requests will appear here.</p>
          </div>
        ) : (
          <table className="used-tools-table">
            <thead>
              <tr>
                <th>Tool ID</th>
                <th>Tool Name</th>
                <th>Range (mm)</th>
                <th>Identification Code</th>
                <th>Make</th>
                <th>Location</th>
                <th>Gauge</th>
                <th>Quantity Used</th>
                <th>Used At</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {usedTools.map((tool) => (
                <tr key={tool.tool_id}>
                  <td>{tool.tool_id}</td>
                  <td>{tool.tool_name || 'N/A'}</td>
                  <td>{tool.range_mm || 'N/A'}</td>
                  <td>{tool.identification_code || 'N/A'}</td>
                  <td>{tool.make || 'N/A'}</td>
                  <td>{tool.location || 'N/A'}</td>
                  <td>{tool.gauge || 'N/A'}</td>
                  <td className="quantity-used">{tool.quantity_used || 'N/A'}</td>
                  <td>{tool.used_at ? new Date(tool.used_at).toLocaleString() : 'N/A'}</td>
                  <td className="tool-remarks">{tool.remarks || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Floating decorative shapes */}
      <div className="page-decoration">
        <div className="floating-shape shape-1" />
        <div className="floating-shape shape-2" />
        <div className="floating-shape shape-3" />
      </div>
    </div>
  );
}
