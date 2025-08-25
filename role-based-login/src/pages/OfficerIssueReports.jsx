import React, { useEffect, useState } from 'react';
import FilterBar from '../components/FilterBar';
import './OfficerIssueReports.css';

export default function OfficerIssueReports() {
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');

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
        setFilteredIssues(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchIssues();
  }, []);

  // Filter function
  const handleFilter = (searchTerm, dateValue) => {
    let filtered = [...issues];

    // Filter by search term (tool ID, operator ID, description, status)
    if (searchTerm.trim()) {
      filtered = filtered.filter(issue =>
        issue.tool_id?.toString().includes(searchTerm) ||
        issue.operator_id?.toString().includes(searchTerm) ||
        issue.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.id?.toString().includes(searchTerm)
      );
    }

    // Filter by date (created_at)
    if (dateValue) {
      filtered = filtered.filter(issue => {
        if (!issue.created_at) return false;
        const issueDate = new Date(issue.created_at).toDateString();
        const filterDate = new Date(dateValue).toDateString();
        return issueDate === filterDate;
      });
    }

    setFilteredIssues(filtered);
  };

  // Clear filters
  const handleClearFilters = () => {
    setFilteredIssues(issues);
  };

  return (
    <div className="issue-reports-container">
      <div className="page-header">
        <h1>Tool Issue Reports</h1>
        <p>View and manage tool maintenance issues ({filteredIssues.length} of {issues.length} issues)</p>
      </div>

      <FilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        onSearch={handleFilter}
        onClear={handleClearFilters}
        placeholder="Search by tool ID, operator ID, description, or status..."
      />
      {loading && <div className="loading">Loading issues...</div>}
      {error && <div className="error">{error}</div>}
      {!loading && !error && (
        <>
          {filteredIssues.length === 0 ? (
            <div className="no-issues">
              <h3>No Issues Found</h3>
              <p>No tool issues match your current filters.</p>
            </div>
          ) : (
            <div className="issues-table-container">
              <table className="issues-table">
                <thead>
                  <tr>
                    <th>Issue ID</th>
                    <th>Tool ID</th>
                    <th>Operator ID</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Created At</th>
                    <th>Resolved At</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIssues.map(issue => (
                    <tr key={issue.id}>
                      <td>{issue.id}</td>
                      <td>{issue.tool_id}</td>
                      <td>{issue.operator_id}</td>
                      <td>{issue.description}</td>
                      <td>
                        <span className={`status-badge ${issue.status?.toLowerCase() || 'open'}`}>
                          {issue.status || 'Open'}
                        </span>
                      </td>
                      <td>{issue.created_at ? new Date(issue.created_at).toLocaleDateString() : '-'}</td>
                      <td>{issue.resolved_at ? new Date(issue.resolved_at).toLocaleDateString() : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
