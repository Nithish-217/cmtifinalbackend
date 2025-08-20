// Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!userId || !password) {
      alert('Please enter both ID and password');
      return;
    }
    try {
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: userId, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.detail || 'Login failed');
        return;
      }
      // Store session_id in localStorage for logout
      if (data.session_id) {
        localStorage.setItem('session_id', data.session_id);
      }
      if (data.role === 'OFFICER') {
        navigate('/officer-dashboard');
      } else if (data.role === 'OPERATOR') {
        navigate('/operator-dashboard');
      } else if (data.role === 'SUPERVISOR') {
        navigate('/supervisor-dashboard');
      } else if (data.first_login_required) {
        alert('First login detected. Please change your password.');
        navigate('/forgot-password');
      } else if (data.role_in_use) {
        alert(data.message || 'Role currently in use by another user.');
      } else {
        console.log('Login response:', data);
        alert('Unknown role: ' + data.role);
      }
    } catch (error) {
      alert('Error connecting to server');
    }
  };

  return (
    
    <div className="page" style={{
      backgroundImage: "url('/images/login-bg.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
     
      <div className="top-bar">
        {/* No logout or theme toggle on login */}
      </div>

      <div className="container" style={{backdropFilter:'blur(2px)'}}>
        <h1 className="title">Tool Management</h1>
        <input
          type="text"
          placeholder="Enter ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
        <p className="link" onClick={() => navigate('/forgot-password')}>Forgot Password?</p>
      </div>
    </div>
  );
}
