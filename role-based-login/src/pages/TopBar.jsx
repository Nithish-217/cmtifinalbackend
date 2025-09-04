// src/pages/TopBar.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import './TopBar.css';

export default function TopBar({ onLogout }) {
  const navigate = useNavigate();
  const { logout } = useUser();
  // const [notifications, setNotifications] = useState([]);
  // const [showNotifications, setShowNotifications] = useState(false);
  // const [unreadCount, setUnreadCount] = useState(0);

  // useEffect(() => {
  //   const fetchNotifications = async () => {
  //     try {
  //       const sessionId = localStorage.getItem('session_id');
  //       const userRole = localStorage.getItem('user_role');
        
  //       if (sessionId) {
  //         let endpoint = '';
  //         switch (userRole) {
  //           case 'OPERATOR':
  //             endpoint = '/api/v1/operator/notifications';
  //             break;
  //           case 'OFFICER':
  //             endpoint = '/api/v1/officer/notifications';
  //             break;
  //           case 'SUPERVISOR':
  //             endpoint = '/api/v1/supervisor/notifications';
  //             break;
  //           default:
  //             return;
  //         }
          
  //         const res = await fetch(`http://localhost:8000${endpoint}`, {
  //           headers: {
  //             'Content-Type': 'application/json',
  //             'x-session-id': sessionId
  //           }
  //         });
  //         if (res.ok) {
  //           const data = await res.json();
  //           setNotifications(data);
  //           setUnreadCount(data.filter(n => !n.is_read).length);
  //         }
  //       }
  //     } catch (err) {
  //       console.error('Failed to fetch notifications:', err);
  //     }
  //   };

  //   fetchNotifications();
    
  //   // Refresh notifications every 30 seconds
  //   const interval = setInterval(fetchNotifications, 30000);
  //   return () => clearInterval(interval);
  // }, []);

  const handleLogout = async () => {
    try {
      const sessionId = localStorage.getItem('session_id');
      
      if (sessionId) {
        // Only call logout endpoint - it will handle lock release internally
        await fetch('http://localhost:8000/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-session-id': sessionId
          }
        });
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      logout();
      navigate('/');
    }
  };

  // const toggleNotifications = () => {
  //   setShowNotifications(!showNotifications);
  // };

  // const markAsRead = (notificationId) => {
  //   setNotifications(prev => 
  //     prev.map(n => 
  //       n.id === notificationId ? { ...n, is_read: true } : n
  //     )
  //   );
  //   setUnreadCount(prev => Math.max(0, prev - 1));
  // };

  return (
    <div className="top-bar">
      <div className="top-bar-content">
        <div className="top-bar-left">
          <h1>CMTI Tool Management System</h1>
        </div>
        <div className="top-bar-right">
          {/* Notification Bell - Commented Out */}
          {/* <div className="notification-container">
            <button 
              className={`notification-bell ${unreadCount > 0 ? 'has-notifications' : ''}`}
              onClick={toggleNotifications}
              title="Notifications"
            >
              🔔
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </button>
            
            {showNotifications && (
              <div className="notifications-dropdown">
                <div className="notifications-header">
                  <h3>Notifications</h3>
                  <button 
                    className="close-notifications"
                    onClick={toggleNotifications}
                  >
                    ✕
                  </button>
                </div>
                <div className="notifications-list">
                  {notifications.length === 0 ? (
                    <div className="no-notifications">No notifications</div>
                  ) : (
                    notifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={`notification-item ${!notification.is_read ? 'unread' : ''}`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="notification-title">{notification.title}</div>
                        <div className="notification-description">{notification.description}</div>
                        <div className="notification-time">
                          {new Date(notification.created_at).toLocaleString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div> */}
          
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
