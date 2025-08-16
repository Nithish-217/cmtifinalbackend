import React, { useEffect, useState } from 'react';

export default function DeleteUserPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/user/list')
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  const handleDelete = async (id) => {
    const res = await fetch(`http://localhost:8000/api/user/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      setUsers(users.filter(u => u.id !== id));
    } else {
      alert('Failed to delete user');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ background: '#fff', borderRadius: '18px', boxShadow: '0 6px 32px rgba(0,0,0,0.10)', padding: '40px 32px', maxWidth: '800px', width: '100%' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '32px', fontWeight: '700', fontSize: '2rem', letterSpacing: '1px', color: '#222' }}>Delete Users</h2>
        {users.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888' }}>No users available</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <thead>
              <tr style={{ background: '#f1f5f9' }}>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Username</th>
                <th style={thStyle}>Contact</th>
                <th style={thStyle}>Post</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr key={user.id} style={{ background: idx % 2 === 0 ? '#fff' : '#f8fafc' }}>
                  <td style={tdStyleBold}>{user.full_name}</td>
                  <td style={tdStyle}>{user.username}</td>
                  <td style={tdStyle}>{user.contact_number}</td>
                  <td style={tdStyleBold}>{user.role}</td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => handleDelete(user.id)}
                      style={{
                        color: 'white',
                        background: '#d9534f',
                        border: 'none',
                        padding: '8px 18px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '1rem',
                        boxShadow: '0 2px 6px rgba(217,83,79,0.10)'
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const thStyle = {
  border: 'none',
  padding: '14px 10px',
  fontWeight: '600',
  fontSize: '1rem',
  color: '#333'
};

const tdStyle = {
  borderBottom: '1px solid #e2e8f0',
  padding: '12px 10px',
  textAlign: 'center',
  color: '#444'
};

const tdStyleBold = {
  ...tdStyle,
  fontWeight: '500',
  color: '#222'
};
