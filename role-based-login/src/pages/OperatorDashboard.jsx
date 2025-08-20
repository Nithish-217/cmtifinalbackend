// src/pages/OperatorDashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from './TopBar';
import './OfficerDashboard.css'; // shared styles

export default function OperatorDashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <TopBar />
      <h1>Welcome, Operator!</h1>
      <div className="dashboard-hero">
        <img className="hero-icon" src="https://img.icons8.com/fluency/96/workers-male.png" alt="Operator"/>
        <div className="hero-text">Request tools quickly and report issues to keep productivity high.</div>
      </div>
      <div className="dashboard-blocks horizontal">
        <div className="dashboard-block" onClick={() => navigate('/operator/request-tool')}>
          <div className="card-head">
            <img className="card-icon" src="https://img.icons8.com/color/48/hand-truck.png" alt="Request"/>
            <div className="card-title">Request Tool Usage</div>
          </div>
          <div className="card-desc">Pick a tool and request required quantity.</div>
          <img className="card-image" alt="req" src="https://images.unsplash.com/photo-1505798577917-a65157d3320a?q=80&w=800&auto=format&fit=crop"/>
        </div>
        <div className="dashboard-block" onClick={() => navigate('/operator/report-issue')}>
          <div className="card-head">
            <img className="card-icon" src="https://img.icons8.com/color/48/box-important.png" alt="Report"/>
            <div className="card-title">Report Tool Issue</div>
          </div>
          <div className="card-desc">Describe issues so officers can resolve them fast.</div>
          <img className="card-image" alt="issue" src="https://images.unsplash.com/photo-1520880867055-1e30d1cb001c?q=80&w=800&auto=format&fit=crop"/>
        </div>
      </div>
    </div>
  );
}
