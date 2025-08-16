// src/pages/SupervisorDashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from './TopBar';
import './OfficerDashboard.css'; // reuse same styles

export default function SupervisorDashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <TopBar />
      <h1>Welcome, Supervisor!</h1>
      <div className="dashboard-blocks horizontal">
        <div className="dashboard-block" onClick={() => navigate('/supervisor/view-tool-requests')}>
          View Tool Requests
        </div>
        <div className="dashboard-block" onClick={() => navigate('/supervisor/tool-addition-requests')}>
          Tool Addition Requests
        </div>
      </div>
    </div>
  );
}
