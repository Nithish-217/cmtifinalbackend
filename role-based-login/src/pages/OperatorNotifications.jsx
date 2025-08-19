import React, { useEffect, useState } from 'react';
import TopBar from './TopBar';
import './OfficerDashboard.css';

export default function OperatorNotifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/notifications')
      .then(res => res.json())
      .then(data => setNotifications(data));
  }, []);

  return (
    <div className="dashboard-container">
      <TopBar />
      <h2>Notifications</h2>
      {notifications.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#888' }}>No notifications</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {notifications.map((notif) => (
            <li key={notif.id} style={{ background: notif.is_read ? '#f1f5f9' : '#fff', margin: '12px 0', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <strong>{notif.title}</strong>
              <div>{notif.description}</div>
              <div style={{ fontSize: '0.9em', color: '#888' }}>{new Date(notif.created_at).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
