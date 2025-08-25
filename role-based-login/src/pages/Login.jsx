// Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export default function Login() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useUser();

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

      // Store session_id, user_id, and full_name in localStorage
      if (data.session_id) {
        localStorage.setItem('session_id', data.session_id);
      }
      localStorage.setItem('user_id', userId);
      
      // Store full name if available from login response
      if (data.full_name) {
        localStorage.setItem('full_name', data.full_name);
      }

      if (data.role === 'OFFICER') {
        login('OFFICER', data.session_id);
        navigate('/officer-dashboard');
      } else if (data.role === 'OPERATOR') {
        login('OPERATOR', data.session_id);
        navigate('/operator-dashboard');
      } else if (data.role === 'SUPERVISOR') {
        login('SUPERVISOR', data.session_id);
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
    <div
      className="page"
      style={{
        backgroundImage: "url('https://i.postimg.cc/c1vYQTyc/9703773.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div className="top-bar">
        {/* No logout or theme toggle on login */}
      </div>

      <div
        className="container glass tilt"
        style={{
          backdropFilter: 'blur(8px)',
          transform: 'rotateX(0.5deg) translateZ(0)',
          padding: '2rem'
        }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          e.currentTarget.style.transform = `rotateX(${0.5 - y * 2}deg) rotateY(${x * 2}deg) translateZ(0)`;
        }}
      >
        <div className="login-image-container">
          
        </div>
        <h1 className="title">Tool Management</h1>
        <div className="login-decoration">
          <div className="floating-shape shape-1" />
          <div className="floating-shape shape-2" />
          <div className="floating-shape shape-3" />
        </div>
        <input
          type="text"
          placeholder="Enter ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="glass-input"
        />
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="glass-input"
        />
        <button onClick={handleLogin} className="glass-button">
          Login
        </button>
        <p className="link" onClick={() => navigate('/forgot-password')}>
          Forgot Password?
        </p>
      </div>
    </div>
  );
}
