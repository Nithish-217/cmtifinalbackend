// src/pages/OperatorDashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from './TopBar';
import './OfficerDashboard.css'; // shared styles

export default function OperatorDashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <TopBar />
      <h1>Welcome, Operator!</h1>
      <div className="dashboard-blocks horizontal">
        <div className="dashboard-block" onClick={() => navigate('/operator/request-tool')}>
          Request Tool Usage
        </div>
        <div className="dashboard-block" onClick={() => navigate('/operator/report-issue')}>
          Report Tool Issue
        </div>
      </div>
    </div>
  );
}
