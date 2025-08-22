import React from 'react';
import { useNavigate } from 'react-router-dom';
import './OfficerDashboard.css';

export default function OfficerDashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <h1>Welcome, Officer!</h1>


      <div className="dashboard-blocks horizontal">
        <div className="dashboard-block" onClick={() => navigate('/officer/view-tool-requests')}>
          <div className="card-head">
            <img className="card-icon" src="https://img.icons8.com/color/48/maintenance.png" alt="Requests"/>
            <div className="card-title">View Tool Requests</div>
          </div>
          <div className="card-desc">Approve or review usage requests from operators.</div>
        </div>
        <div className="dashboard-block" onClick={() => navigate('/officer/manage-users')}>
          <div className="card-head">
            <img className="card-icon" src="https://img.icons8.com/color/48/conference-foreground-selected.png" alt="Users"/>
            <div className="card-title">Manage Users</div>
          </div>
          <div className="card-desc">Create, delete, and view user accounts.</div>
        </div>
        <div className="dashboard-block" onClick={() => navigate('/officer/tool-addition-requests')}>
          <div className="card-head">
            <img className="card-icon" src="https://img.icons8.com/color/48/add-database.png" alt="Add tool"/>
            <div className="card-title">Tool Addition Requests</div>
          </div>
          <div className="card-desc">Review new tool requests from supervisors.</div>
        </div>
        <div className="dashboard-block" onClick={() => navigate('/officer/issue-reports')}>
          <div className="card-head">
            <img className="card-icon" src="https://img.icons8.com/color/48/error--v1.png" alt="Issues"/>
            <div className="card-title">Tool Issue Reports</div>
          </div>
          <div className="card-desc">Track reported issues and status.</div>
        </div>
      </div>
    </div>
  );
}
