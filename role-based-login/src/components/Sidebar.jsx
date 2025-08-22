import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar({ userRole }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getMenuItems = () => {
    switch (userRole) {
      case 'OFFICER':
        return [
          { path: '/officer-dashboard', label: 'Dashboard', icon: '🏠' },
          { path: '/officer/view-tool-requests', label: 'View Tool Requests', icon: '📋' },
          { path: '/officer/manage-users', label: 'Manage Users', icon: '👥' },
          { path: '/officer/tool-addition-requests', label: 'Tool Addition Requests', icon: '➕' },
          { path: '/officer/issue-reports', label: 'Issue Reports', icon: '⚠️' },
          { path: '/officer/supervisor-response', label: 'Supervisor Response', icon: '📢' }
        ];
      case 'OPERATOR':
        return [
          { path: '/operator-dashboard', label: 'Dashboard', icon: '🏠' },
          { path: '/operator/report-issue', label: 'Report Issue', icon: '📝' }
        ];
      case 'SUPERVISOR':
        return [
          { path: '/supervisor-dashboard', label: 'Dashboard', icon: '🏠' },
          { path: '/supervisor/view-tool-requests', label: 'View Tool Requests', icon: '📋' },
          { path: '/supervisor/tool-addition-requests', label: 'Tool Addition Requests', icon: '➕' }
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();
  
  // Get username from localStorage or use a default
  const getUsername = () => {
    const userId = localStorage.getItem('user_id') || 'User';
    return userId;
  };

  const getFullName = () => {
    // Try to get full name from localStorage if available
    const fullName = localStorage.getItem('full_name');
    if (fullName) {
      return fullName;
    }
    // Fallback to user_id if full_name not available
    const userId = localStorage.getItem('user_id') || 'User';
    return userId;
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/6/6c/CMTILogo.jpg" 
          alt="CMTI Logo" 
          className="cmti-logo"
        />
        <h3 className="company-name">CMTI</h3>
      </div>
      
      <nav className="sidebar-nav">
        <ul className="nav-menu">
          {menuItems.map((item) => (
            <li key={item.path} className="nav-item">
              <button
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="user-role">
          <span className="role-badge" title={getFullName()}>{userRole}</span>
        </div>
      </div>
    </div>
  );
}
