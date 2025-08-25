import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OfficerDashboard.css';

export default function OfficerDashboard() {
  const navigate = useNavigate();
  const [toolStats, setToolStats] = useState({
    total: 0,
    available: 0,
    issues: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        const sessionId = localStorage.getItem('session_id');
        
        // Fetch user profile data to get full name
        const profileRes = await fetch('http://localhost:8000/api/auth/profile', {
          headers: { 'x-session-id': sessionId || '' }
        });
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          if (profileData.full_name) {
            localStorage.setItem('full_name', profileData.full_name);
          }
        }
        
        // Fetch all tools
        const toolsRes = await fetch('http://localhost:8000/api/v1/operator/tools', {
          headers: { 'x-session-id': sessionId || '' }
        });
        const tools = await toolsRes.json();
        // Fetch all issues
        const issuesRes = await fetch('http://localhost:8000/api/v1/officer/tool-issues', {
          headers: { 'x-session-id': sessionId || '' }
        });
        const issues = await issuesRes.json();
        setToolStats({
          total: Array.isArray(tools) ? tools.length : 0,
          available: Array.isArray(tools) ? tools.filter(t => (t.quantity ?? 0) > 0).length : 0,
          issues: Array.isArray(issues) ? issues.length : 0
        });
      } catch (err) {
        setToolStats({ total: 0, available: 0, issues: 0 });
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Welcome, Officer!</h1>
      <div className="dashboard-blocks horizontal">
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
