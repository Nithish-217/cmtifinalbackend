// src/pages/ReportIssuePage.jsx
import React from 'react';
import TopBar from './TopBar';
import './OfficerDashboard.css'; // Reusing the existing CSS

export default function ReportIssuePage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to handle the issue submission can go here
    alert("Tool issue reported successfully.");
  };

  return (
    <div className="dashboard-container">
      <TopBar />
      <div className="form-wrapper">
        <h2>Report Tool Issue</h2>
        <form className="form-box" onSubmit={handleSubmit}>
          <label>Tool Name</label>
          <input type="text" placeholder="Enter tool name" required />

          <label>Issue Description</label>
          <textarea placeholder="Describe the issue" required></textarea>

          <button type="submit">Submit Request</button>
        </form>
      </div>
    </div>
  );
}
