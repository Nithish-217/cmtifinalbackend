// src/pages/SupervisorDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SupervisorDashboard.css';

export default function SupervisorDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user profile data to get full name
    const fetchUserProfile = async () => {
      try {
        const sessionId = localStorage.getItem('session_id');
        if (sessionId) {
          const response = await fetch('http://localhost:8000/api/auth/profile', {
            headers: {
              'x-session-id': sessionId
            }
          });
          if (response.ok) {
            const data = await response.json();
            if (data.full_name) {
              localStorage.setItem('full_name', data.full_name);
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };
    
    fetchUserProfile();
  }, []);

  const [stats, setStats] = useState({
    yourRequests: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
  const [toolStats, setToolStats] = useState({
    total: 0,
    available: 0,
    issues: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const sessionId = localStorage.getItem('session_id');
        
        // Fetch all tool addition requests
        const allRequestsRes = await fetch('http://localhost:8000/api/v1/supervisor/tool-addition-requests', {
          headers: { 'x-session-id': sessionId || '' }
        });
        const allRequests = await allRequestsRes.json();
        
        // Fetch pending tool addition requests
        const pendingRes = await fetch('http://localhost:8000/api/v1/supervisor/tool-addition-requests?status=pending', {
          headers: { 'x-session-id': sessionId || '' }
        });
        const pending = await pendingRes.json();
        
        // Fetch approved tool addition requests
        const approvedRes = await fetch('http://localhost:8000/api/v1/supervisor/tool-addition-requests?status=approved', {
          headers: { 'x-session-id': sessionId || '' }
        });
        const approved = await approvedRes.json();
        
        // Fetch rejected tool addition requests
        const rejectedRes = await fetch('http://localhost:8000/api/v1/supervisor/tool-addition-requests?status=rejected', {
          headers: { 'x-session-id': sessionId || '' }
        });
        const rejected = await rejectedRes.json();
        
        // Fetch all tools (same as officer dashboard)
        const toolsRes = await fetch('http://localhost:8000/api/v1/operator/tools', {
          headers: { 'x-session-id': sessionId || '' }
        });
        const tools = await toolsRes.json();
        
        // Fetch all issues (same as officer dashboard)
        const issuesRes = await fetch('http://localhost:8000/api/v1/officer/tool-issues', {
          headers: { 'x-session-id': sessionId || '' }
        });
        const issues = await issuesRes.json();
        
        setStats({
          yourRequests: Array.isArray(allRequests) ? allRequests.length : 0,
          pending: Array.isArray(pending) ? pending.length : 0,
          approved: Array.isArray(approved) ? approved.length : 0,
          rejected: Array.isArray(rejected) ? rejected.length : 0
        });
        
        setToolStats({
          total: Array.isArray(tools) ? tools.length : 0,
          available: Array.isArray(tools) ? tools.filter(t => (t.quantity ?? 0) > 0).length : 0,
          issues: Array.isArray(issues) ? issues.length : 0
        });
      } catch (err) {
        console.error('Failed to fetch stats:', err);
        setStats({ yourRequests: 0, pending: 0, approved: 0, rejected: 0 });
        setToolStats({ total: 0, available: 0, issues: 0 });
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Welcome, Supervisor!</h1>

      {/* First Row - Tool Addition Requests */}
      <div className="dashboard-blocks horizontal small-boxes">
        {/* Your Requests */}
        <div className="dashboard-block" onClick={() => navigate('/supervisor/your-requests')}>
          <div className="card-head">
            <img className="card-icon" src="https://img.icons8.com/color/48/add-database.png" alt="Your Requests"/>
            <div className="card-title">Your Requests</div>
          </div>
          <div className="card-desc">{loading ? 'Loading...' : stats.yourRequests} tool addition requests made</div>
        </div>
        
        {/* Pending Requests */}
        <div className="dashboard-block" onClick={() => navigate('/supervisor/pending-requests')}>
          <div className="card-head">
            <img className="card-icon" src="https://img.icons8.com/color/48/hourglass.png" alt="Pending"/>
            <div className="card-title">Pending Requests</div>
          </div>
          <div className="card-desc">{loading ? 'Loading...' : stats.pending} requests awaiting approval</div>
        </div>
        
        {/* Approved Requests */}
        <div className="dashboard-block" onClick={() => navigate('/supervisor/approved-requests')}>
          <div className="card-head">
            <img className="card-icon" src="https://img.icons8.com/color/48/checkmark.png" alt="Approved"/>
            <div className="card-title">Approved</div>
          </div>
          <div className="card-desc">{loading ? 'Loading...' : stats.approved} requests approved</div>
        </div>
        
        {/* Rejected Requests */}
        <div className="dashboard-block" onClick={() => navigate('/supervisor/rejected-requests')}>
          <div className="card-head">
            <img className="card-icon" src="https://img.icons8.com/color/48/cancel.png" alt="Rejected"/>
            <div className="card-title">Rejected</div>
          </div>
          <div className="card-desc">{loading ? 'Loading...' : stats.rejected} requests rejected</div>
        </div>
      </div>

      {/* Second Row - Tool Management (copied from Officer Dashboard) */}
      <div className="dashboard-blocks horizontal small-boxes">
        {/* Total Tools */}
        <div className="dashboard-block" onClick={() => navigate('/officer/inventory')}>
          <div className="card-head">
            <img className="card-icon" src="https://img.icons8.com/color/48/toolbox.png" alt="Total Tools"/>
            <div className="card-title">Total Tools</div>
          </div>
          <div className="card-desc">{loading ? 'Loading...' : toolStats.total} tools in inventory</div>
        </div>
        
        {/* Available Tools */}
        <div className="dashboard-block" onClick={() => navigate('/officer/available-tools')}>
          <div className="card-head">
            <img className="card-icon" src="https://img.icons8.com/color/48/maintenance.png" alt="Available Tools"/>
            <div className="card-title">Available Tools</div>
          </div>
          <div className="card-desc">{loading ? 'Loading...' : toolStats.available} tools available</div>
        </div>
        
        {/* Under Maintenance (Issues) */}
        <div className="dashboard-block" onClick={() => navigate('/officer/issue-reports')}>
          <div className="card-head">
            <img className="card-icon" src="https://img.icons8.com/color/48/error--v1.png" alt="Under Maintenance"/>
            <div className="card-title">Under Maintenance</div>
          </div>
          <div className="card-desc">{loading ? 'Loading...' : toolStats.issues} issues reported</div>
        </div>
      </div>
    </div>
  );
}
