// src/pages/SupervisorDashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SupervisorDashboard.css';

export default function SupervisorDashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <h1>Welcome, Supervisor!</h1>


      <div className="dashboard-blocks horizontal">
        <div className="dashboard-block" onClick={() => navigate('/supervisor/view-tool-requests')}>
          <div className="card-head">
            <img className="card-icon" src="https://img.icons8.com/color/48/maintenance.png" alt="Requests"/>
            <div className="card-title">View Tool Requests</div>
          </div>
          <div className="card-desc">Review and approve tool usage requests.</div>
        </div>
        <div className="dashboard-block" onClick={() => navigate('/supervisor/tool-addition-requests')}>
          <div className="card-head">
            <img className="card-icon" src="https://img.icons8.com/color/48/add-database.png" alt="Add tool"/>
            <div className="card-title">Tool Addition Requests</div>
          </div>
          <div className="card-desc">Request new tools for the inventory.</div>
        </div>
      </div>
    </div>
  );
}
