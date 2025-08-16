// src/components/TopBar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TopBar.css';

export default function TopBar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const sessionId = localStorage.getItem('session_id');
    try {
      await fetch(`http://localhost:8000/api/auth/logout?x_session_id=${sessionId}`, {
        method: 'POST',
      });
      localStorage.removeItem('session_id');
    } catch (err) {
      // Optionally handle error
    }
    navigate('/');
  };

  return (
    <div className="top-bar">
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
