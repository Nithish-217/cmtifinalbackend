import React, { useEffect, useState } from 'react';
import TopBar from './TopBar';

export default function ToolAdditionRequests() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const sessionId = localStorage.getItem('session_id');
        const res = await fetch('http://localhost:8000/api/officer/tool-additions', {
          headers: { 'x-session-id': sessionId || '' }
        });
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setRows(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || 'Failed to fetch');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);
  return (
    <div>
      <TopBar />
      <h2>Tool Addition Requests</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{color:'red'}}>{error}</p>}
      {!loading && !error && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>ID</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Tool Name</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Status</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Requested By</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Created At</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan="5" style={{textAlign:'center'}}>No requests</td></tr>
            ) : rows.map(r => (
              <tr key={r.id}>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{r.id}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{r.tool_name}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{r.status}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{r.requested_by}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{r.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
