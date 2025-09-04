import React, { useEffect, useState } from 'react';
import FilterBar from '../components/FilterBar';
import './OfficerInventoryPage.css';

export default function OfficerInventoryPage() {
  const [tools, setTools] = useState([]);
  const [filteredTools, setFilteredTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    async function fetchTools() {
      setLoading(true);
      setError('');
      try {
        const sessionId = localStorage.getItem('session_id');
        const res = await fetch('http://localhost:8000/api/v1/operator/tools', {
          headers: { 'x-session-id': sessionId || '' }
        });
        if (!res.ok) throw new Error('Failed to fetch tools');
        const data = await res.json();
        setTools(Array.isArray(data) ? data : []);
        setFilteredTools(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Failed to fetch tools');
      } finally {
        setLoading(false);
      }
    }
    fetchTools();
  }, []);

  // Filter function
  const handleFilter = (searchTerm, dateValue) => {
    let filtered = [...tools];

    // Filter by search term (tool name, make, location, identification code)
    if (searchTerm.trim()) {
      filtered = filtered.filter(tool =>
        tool.tool_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.make?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.identification_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.gauge?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.id?.toString().includes(searchTerm)
      );
    }

    // Filter by date (added_at)
    if (dateValue) {
      filtered = filtered.filter(tool => {
        if (!tool.added_at) return false;
        const toolDate = new Date(tool.added_at).toDateString();
        const filterDate = new Date(dateValue).toDateString();
        return toolDate === filterDate;
      });
    }

    setFilteredTools(filtered);
  };

  // Clear filters
  const handleClearFilters = () => {
    setFilteredTools(tools);
  };

  return (
    <div className="inventory-page-container">
      <h1>All Tools in Inventory</h1>
      <p>Complete inventory of all tools ({filteredTools.length} of {tools.length} tools)</p>
      
      <FilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        onSearch={handleFilter}
        onClear={handleClearFilters}
        placeholder="Search by tool name, make, location, ID, or code..."
      />
      
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {!loading && !error && (
        <div className="tools-table-container">
          <table className="tools-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Range (mm)</th>
                <th>Identification Code</th>
                <th>Make</th>
                <th>Location</th>
                <th>Gauge</th>
                <th>Quantity</th>
                <th>Remarks</th>
                <th>Added At</th>
              </tr>
            </thead>
            <tbody>
              {filteredTools.length === 0 ? (
                <tr><td colSpan="10" style={{ textAlign: 'center' }}>No tools found.</td></tr>
              ) : (
                filteredTools.map(tool => (
                  <tr key={tool.id}>
                    <td>{tool.id}</td>
                    <td>{tool.tool_name || '-'}</td>
                    <td>{tool.range_mm || '-'}</td>
                    <td>{tool.identification_code || '-'}</td>
                    <td>{tool.make || '-'}</td>
                    <td>{tool.location || '-'}</td>
                    <td>{tool.gauge || '-'}</td>
                    <td>{tool.quantity ?? '-'}</td>
                    <td>{tool.remarks || '-'}</td>
                    <td>{tool.added_at ? new Date(tool.added_at).toLocaleString() : '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
