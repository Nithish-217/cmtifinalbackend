// src/pages/RequestToolPage.jsx
import React from 'react';
import TopBar from './TopBar';
import './OfficerDashboard.css'; // reuse styling

export default function RequestToolPage() {
  return (
    <div className="dashboard-container">
      <TopBar />
      <h2>Request Tool</h2>
      <p>This is the page where Operators can request tools.</p>
      {/* Add your request form logic here */}
    </div>
  );
}
