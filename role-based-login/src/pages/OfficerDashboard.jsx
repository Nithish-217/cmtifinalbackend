import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../pages/TopBar';
import './OfficerDashboard.css';

export default function OfficerDashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <TopBar />
      <h1>Welcome, Officer!</h1>
      <div className="dashboard-hero">
        <img className="hero-icon" src="https://img.icons8.com/fluency/96/toolbox.png" alt="Toolbox"/>
        <div className="hero-text">Stay on top of requests and issues. Review tool usage, manage users, and keep the crib healthy.</div>
      </div>

      <div className="dashboard-blocks horizontal">
        <div className="dashboard-block" onClick={() => navigate('/officer/view-tool-requests')}>
          <div className="card-head">
            <img className="card-icon" src="https://img.icons8.com/color/48/maintenance.png" alt="Requests"/>
            <div className="card-title">View Tool Requests</div>
          </div>
          <div className="card-desc">Approve or review usage requests from operators.</div>
          <img className="card-image" alt="tools" src="https://images.unsplash.com/photo-1517433456452-f9633a875f6f?q=80&w=800&auto=format&fit=crop"/>
        </div>
        <div className="dashboard-block" onClick={() => navigate('/officer/manage-users')}>
          <div className="card-head">
            <img className="card-icon" src="https://img.icons8.com/color/48/conference-foreground-selected.png" alt="Users"/>
            <div className="card-title">Manage Users</div>
          </div>
          <div className="card-desc">Create, delete, and view user accounts.</div>
          <img className="card-image" alt="users" src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop"/>
        </div>
        <div className="dashboard-block" onClick={() => navigate('/officer/tool-addition-requests')}>
          <div className="card-head">
            <img className="card-icon" src="https://img.icons8.com/color/48/add-database.png" alt="Add tool"/>
            <div className="card-title">Tool Addition Requests</div>
          </div>
          <div className="card-desc">Review new tool requests from supervisors.</div>
          <img className="card-image" alt="add" src="https://images.unsplash.com/photo-1504148455329-4caed0d77eb3?q=80&w=800&auto=format&fit=crop"/>
        </div>
        <div className="dashboard-block" onClick={() => navigate('/officer/issue-reports')}>
          <div className="card-head">
            <img className="card-icon" src="https://img.icons8.com/color/48/error--v1.png" alt="Issues"/>
            <div className="card-title">Tool Issue Reports</div>
          </div>
          <div className="card-desc">Track reported issues and status.</div>
          <img className="card-image" alt="issues" src="https://images.unsplash.com/photo-1581093588401-16bba4c4f23d?q=80&w=800&auto=format&fit=crop"/>
        </div>
      </div>
    </div>
  );
}
