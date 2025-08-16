// src/pages/SupervisorRequestToolPage.jsx
import React from 'react';
import TopBar from './TopBar';
import './OfficerDashboard.css'; // Reuse the existing styles

export default function SupervisorRequestToolPage() {
  return (
    <div className="dashboard-container">
      <TopBar />
      <div className="form-wrapper">
        <h2 style={{ textAlign: 'center', marginTop: '80px' }}>Supervisor - Request Tool</h2>
      </div>
    </div>
  );
}
