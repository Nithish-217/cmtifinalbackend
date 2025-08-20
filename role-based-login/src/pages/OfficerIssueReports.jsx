import React, { useEffect, useState } from 'react';
import TopBar from './TopBar';

export default function OfficerIssueReports() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchIssues() {
      setLoading(true);
      setError(null);
      try {
        const sessionId = localStorage.getItem('session_id'); // use 'session_id' as in supervisor dashboard
        const response = await fetch('http://localhost:8000/api/v1/officer/tool-issues', {
          headers: {
            'Content-Type': 'application/json',
            'x-session-id': sessionId || '', // use lowercase header
          },
        });
        if (!response.ok) throw new Error('Failed to fetch tool issues');
  const data = await response.json();
  console.log('Fetched tool issues:', data);
  setIssues(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchIssues();
  }, []);

  return (
    <div>
      <TopBar />
      <h2>Tool Issue Reports</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{color: 'red'}}>{error}</p>}
      {!loading && !error && (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>ID</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Tool ID</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Operator ID</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Description</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Status</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Created At</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Resolved At</th>
              </tr>
            </thead>
            <tbody>
              {issues.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: 'center' }}>No tool issues found.</td></tr>
              ) : (
                issues.map(issue => (
                  <tr key={issue.id}>
                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>{issue.id}</td>
                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>{issue.tool_id}</td>
                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>{issue.operator_id}</td>
                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>{issue.description}</td>
                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>{issue.status}</td>
                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>{issue.created_at}</td>
                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>{issue.resolved_at || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
