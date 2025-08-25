import React from 'react';
import './FilterBar.css';

export default function FilterBar({ 
  searchQuery, 
  setSearchQuery, 
  dateFilter, 
  setDateFilter, 
  onSearch, 
  onClear,
  placeholder = "Search tools...",
  showDateFilter = true 
}) {
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    // Auto-search as user types
    if (onSearch) {
      onSearch(value, dateFilter);
    }
  };

  const handleDateChange = (e) => {
    const value = e.target.value;
    setDateFilter(value);
    // Auto-filter when date changes
    if (onSearch) {
      onSearch(searchQuery, value);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    setDateFilter('');
    if (onClear) {
      onClear();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(searchQuery, dateFilter);
    }
  };

  return (
    <div className="filter-bar">
      <div className="filter-controls">
        <div className="search-group">
          <input
            type="text"
            className="search-input"
            placeholder={placeholder}
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
          />
          <button 
            className="search-btn"
            onClick={() => onSearch && onSearch(searchQuery, dateFilter)}
          >
            🔍
          </button>
        </div>
        
        {showDateFilter && (
          <div className="date-group">
            <label htmlFor="date-filter">Filter by Date:</label>
            <input
              id="date-filter"
              type="date"
              className="date-input"
              value={dateFilter}
              onChange={handleDateChange}
            />
          </div>
        )}
        
        <button 
          className="clear-btn"
          onClick={handleClear}
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}
