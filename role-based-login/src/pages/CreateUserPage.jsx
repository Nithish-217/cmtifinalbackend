// src/pages/CreateUserPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from './TopBar';
import './OfficerDashboard.css'; // uses the same global dashboard styles

export default function CreateUserPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('OFFICER');
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!name || !phone || !userId || !password) {
      alert('All fields are required.');
      return;
    }

    if (phone.length !== 10 || isNaN(phone)) {
      alert('Phone number must be exactly 10 digits.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/user/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userId,
          full_name: name,
          email: `${userId}@example.com`, // You may want to add an email field in the UI
          contact_number: phone,
          role: role, // Use selected role
          password: password,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.detail || 'Failed to create user');
        return;
      }
      alert('User created successfully!');
      navigate('/officer/manage-users');
    } catch (error) {
      alert('Error connecting to server');
    }
  };

	return (
		<div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', display: 'flex', flexDirection: 'column' }}>
			<TopBar />
			<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 64px)' }}>
				<div style={{ background: '#fff', borderRadius: '18px', boxShadow: '0 6px 32px rgba(0,0,0,0.10)', padding: '40px 32px', maxWidth: '420px', width: '100%' }}>
					<h2 style={{ textAlign: 'center', marginBottom: '32px', fontWeight: '700', fontSize: '2rem', letterSpacing: '1px', color: '#222' }}>Create New User</h2>
					<form style={{ display: 'flex', flexDirection: 'column', gap: '18px' }} onSubmit={e => e.preventDefault()}>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
							<label style={{ fontWeight: '500', color: '#444' }}>Name</label>
							<input
								type="text"
								value={name}
								onChange={e => setName(e.target.value)}
								placeholder="Enter full name"
								style={{ padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '1rem' }}
							/>
						</div>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
							<label style={{ fontWeight: '500', color: '#444' }}>Phone Number</label>
							<input
								type="text"
								value={phone}
								onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
								placeholder="Enter 10-digit phone number"
								maxLength="10"
								style={{ padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '1rem' }}
							/>
						</div>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
							<label style={{ fontWeight: '500', color: '#444' }}>User ID</label>
							<input
								type="text"
								value={userId}
								onChange={e => setUserId(e.target.value)}
								placeholder="Enter user ID (e.g., OF123)"
								style={{ padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '1rem' }}
							/>
						</div>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
							<label style={{ fontWeight: '500', color: '#444' }}>Password</label>
							<input
								type="password"
								value={password}
								onChange={e => setPassword(e.target.value)}
								placeholder="Enter password"
								style={{ padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '1rem' }}
							/>
						</div>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
							<label style={{ fontWeight: '500', color: '#444' }}>Role</label>
							<select value={role} onChange={e => setRole(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '1rem', background: '#f8fafc' }}>
								<option value="OFFICER">OFFICER</option>
								<option value="SUPERVISOR">SUPERVISOR</option>
								<option value="OPERATOR">OPERATOR</option>
							</select>
						</div>
						<button onClick={handleCreate} style={{ color: 'white', background: '#2563eb', border: 'none', padding: '12px 0', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '1rem', marginTop: '10px', boxShadow: '0 2px 6px rgba(37,99,235,0.10)' }}>Create User</button>
					</form>
				</div>
			</div>
		</div>
	);
}
