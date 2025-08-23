import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Sidebar from './Sidebar';
import TopBar from '../pages/TopBar';
import './Layout.css';

export default function Layout({ children, showTopBar = true }) {
  const { userRole, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!userRole) {
    return <div>Loading...</div>;
  }

  return (
    <div className="layout">
      <Sidebar userRole={userRole} />
      <div className="main-content">
        {showTopBar && <TopBar onLogout={handleLogout} />}
        <div className="content-wrapper">
          {children}
        </div>
      </div>
    </div>
  );
}

