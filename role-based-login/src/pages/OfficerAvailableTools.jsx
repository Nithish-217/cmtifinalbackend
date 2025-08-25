import React, { useEffect, useState } from 'react';
import FilterBar from '../components/FilterBar';
import './OfficerInventoryPage.css';

export default function OfficerAvailableTools() {
  const [tools, setTools] = useState([]);
  const [filteredTools, setFilteredTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    async function fetchAvailableTools() {
      setLoading(true);
      try {
        const sessionId = localStorage.getItem('session_id');
        const response = await fetch('http://localhost:8000/api/v1/operator/tools', {
          headers: { 'x-session-id': sessionId || '' }
        });
        
        if (response.ok) {
          const data = await response.json();
          // Filter only available tools (quantity > 0)
          const availableTools = Array.isArray(data) ? data.filter(tool => (tool.quantity ?? 0) > 0) : [];
          setTools(availableTools);
          setFilteredTools(availableTools);
        } else {
          setError('Failed to fetch tools');
        }
      } catch (err) {
        setError('Error connecting to server');
      } finally {
        setLoading(false);
      }
    }
    fetchAvailableTools();
  }, []);

  // Filter function
  const handleFilter = (searchTerm, dateValue) => {
    let filtered = [...tools];

    // Filter by search term (tool name, category, location)
    if (searchTerm.trim()) {
      filtered = filtered.filter(tool =>
        tool.tool_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.id?.toString().includes(searchTerm)
      );
    }

    setFilteredTools(filtered);
  };

  // Clear filters
  const handleClearFilters = () => {
    setFilteredTools(tools);
  };

  if (loading) return <div className="loading">Loading available tools...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="inventory-container">
      <div className="page-header">
        <h1>Available Tools</h1>
        <p>Tools currently available for use ({filteredTools.length} of {tools.length} tools)</p>
      </div>

      <FilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        onSearch={handleFilter}
        onClear={handleClearFilters}
        placeholder="Search by tool name, category, location, or ID..."
        showDateFilter={false}
      />

      {filteredTools.length === 0 ? (
        <div className="no-tools">
          <h3>No Available Tools</h3>
          <p>All tools are currently in use or under maintenance.</p>
        </div>
      ) : (
        <div className="tools-table-container">
          <table className="tools-table">
            <thead>
              <tr>
                <th>Tool ID</th>
                <th>Tool Name</th>
                <th>Category</th>
                <th>Available Quantity</th>
                <th>Location</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTools.map((tool) => (
                <tr key={tool.id}>
                  <td>{tool.id}</td>
                  <td>{tool.tool_name}</td>
                  <td>{tool.category || 'General'}</td>
                  <td className="quantity-cell">{tool.quantity}</td>
                  <td>{tool.location || 'Main Storage'}</td>
                  <td>
                    <span className="status-badge available">Available</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
