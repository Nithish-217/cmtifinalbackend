import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';

import OfficerDashboard from './pages/OfficerDashboard';
import OperatorDashboard from './pages/OperatorDashboard';
import SupervisorDashboard from './pages/SupervisorDashboard';

import ViewToolRequestsPage from './pages/ViewToolRequestsPage';
import ManageUsersPage from './pages/ManageUsersPage';
import CreateUserPage from './pages/CreateUserPage';
import DeleteUserPage from './pages/DeleteUserPage';
import ToolAdditionRequestsPage from './pages/ToolAdditionRequestsPage';
import IssueReportsPage from './pages/IssueReportsPage';
import OfficerNotifications from './pages/OfficerNotifications';

import RequestToolPage from './pages/RequestToolPage';
import ReportIssuePage from './pages/ReportIssuePage';
import SupervisorViewToolRequests from './pages/SupervisorViewToolRequests';
import SupervisorToolAdditionRequests from './pages/SupervisorToolAdditionRequests';



export default function App() {
  return (
    <Router>
      <Routes>
        {/* Common routes */}
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Officer dashboard + subpages */}
        <Route path="/officer-dashboard" element={<OfficerDashboard />} />
        <Route path="/officer/view-tool-requests" element={<ViewToolRequestsPage />} />
        <Route path="/officer/manage-users" element={<ManageUsersPage />} />
        <Route path="/officer/create-user" element={<CreateUserPage />} />
        <Route path="/officer/delete-user" element={<DeleteUserPage />} />
        <Route path="/officer/tool-addition-requests" element={<ToolAdditionRequestsPage />} />
        <Route path="/officer/issue-reports" element={<IssueReportsPage />} />
        <Route path="/officer/notifications" element={<OfficerNotifications />} />

        {/* Operator dashboard + subpages */}
        <Route path="/operator-dashboard" element={<OperatorDashboard />} />
        <Route path="/operator/request-tool" element={<RequestToolPage />} />
        <Route path="/operator/report-issue" element={<ReportIssuePage />} />

        {/* Supervisor dashboard */}
        <Route path="/supervisor-dashboard" element={<SupervisorDashboard />} />
        <Route path="/supervisor/view-tool-requests" element={<SupervisorViewToolRequests />} />
<Route path="/supervisor/tool-addition-requests" element={<SupervisorToolAdditionRequests />} />

      </Routes>
    </Router>
  );
}
