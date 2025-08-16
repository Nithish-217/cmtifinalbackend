// src/pages/ManageUsersPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from './TopBar';
import './OfficerDashboard.css';

export default function ManageUsersPage() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <TopBar />
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Manage Users</h2>

      <div className="dashboard-blocks">
        <div className="dashboard-block" style={{ width: '300px' }} onClick={() => navigate('/officer/delete-user')}>
          Delete User
        </div>
        <div className="dashboard-block" style={{ width: '300px' }} onClick={() => navigate('/officer/create-user')}>
          Create New User
        </div>
      </div>
    </div>
  );
}
