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
      <div className="dashboard-hero">
        <img className="hero-icon" src="https://img.icons8.com/fluency/96/hard-working.png" alt="Supervisor"/>
        <div className="hero-text"><strong>Review and approve</strong> tool usage, or request new tools for the crib.</div>
      </div>
      <div className="dashboard-blocks horizontal">
        <div className="dashboard-block" onClick={() => navigate('/supervisor/view-tool-requests')}>
          <div className="card-head">
            <img className="card-icon" src="https://img.icons8.com/color/48/checklist--v1.png" alt="Requests"/>
            <div className="card-title">View Tool Requests</div>
          </div>
          <div className="card-desc">Approve or reject operator tool usage requests.</div>
          {/* <img className="card-image" alt="list" src="https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=800&auto=format&fit=crop"/> */}
        </div>
        <div className="dashboard-block" onClick={() => navigate('/supervisor/tool-addition-requests')}>
          <div className="card-head">
            <img className="card-icon" src="https://img.icons8.com/color/48/add-property.png" alt="Add"/>
            <div className="card-title">Tool Addition Requests</div>
          </div>
          <div className="card-desc">Submit requests to add essential tools to inventory.</div>
          {/* <img className="card-image" alt="add" src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop"/> */}
        </div>
      </div>
    </div>
  );
}
