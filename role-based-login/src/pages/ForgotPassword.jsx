// ForgotPassword.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const [userId, setUserId] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const handleReset = async () => {
    if (!userId || !oldPassword || !newPassword) {
      alert('All fields are required.');
      return;
    }
    try {
      const response = await fetch('http://localhost:8000/api/user/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userId,
          old_password: oldPassword,
          new_password: newPassword
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.detail || 'Failed to reset password');
        return;
      }
      alert('Password changed successfully');
      navigate('/');
    } catch (error) {
      alert('Error connecting to server');
    }
  };

  return (
    <div className="page">
      <div className="top-bar"></div>
      <div className="container">
        <h2>Reset Password</h2>
        <input
          type="text"
          placeholder="Enter ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button onClick={handleReset}>Change Password</button>
      </div>
    </div>
  );
}
