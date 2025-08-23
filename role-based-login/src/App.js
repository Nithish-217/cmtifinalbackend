import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Layout from './components/Layout';

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
import OfficerIssueReports from './pages/OfficerIssueReports';
import OfficerNotifications from './pages/OfficerNotifications';
import SupervisorResponse from './pages/SupervisorResponse';

import RequestToolPage from './pages/RequestToolPage';
import ReportIssuePage from './pages/ReportIssuePage';
import SupervisorViewToolRequests from './pages/SupervisorViewToolRequests';
import SupervisorToolAdditionRequests from './pages/SupervisorToolAdditionRequests';

// New operator pages
import OperatorToolRequests from './pages/OperatorToolRequests';
import OperatorReportedIssues from './pages/OperatorReportedIssues';
import OperatorUsedTools from './pages/OperatorUsedTools';

export default function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* Common routes */}
          <Route path="/" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Officer dashboard + subpages */}
          <Route path="/officer-dashboard" element={
            <Layout>
              <OfficerDashboard />
            </Layout>
          } />
          <Route path="/officer/view-tool-requests" element={
            <Layout>
              <ViewToolRequestsPage />
            </Layout>
          } />
          <Route path="/officer/manage-users" element={
            <Layout>
              <ManageUsersPage />
            </Layout>
          } />
          <Route path="/officer/create-user" element={
            <Layout>
              <CreateUserPage />
            </Layout>
          } />
          <Route path="/officer/delete-user" element={
            <Layout>
              <DeleteUserPage />
            </Layout>
          } />
          <Route path="/officer/tool-addition-requests" element={
            <Layout>
              <ToolAdditionRequestsPage />
            </Layout>
          } />
          <Route path="/officer/issue-reports" element={
            <Layout>
              <OfficerIssueReports />
            </Layout>
          } />
          <Route path="/officer/notifications" element={
            <Layout>
              <OfficerNotifications />
            </Layout>
          } />
          <Route path="/officer/supervisor-response" element={
            <Layout>
              <SupervisorResponse />
            </Layout>
          } />

          {/* Operator dashboard + subpages */}
          <Route path="/operator-dashboard" element={
            <Layout>
              <OperatorDashboard />
            </Layout>
          } />
          <Route path="/operator/request-tool" element={
            <Layout>
              <RequestToolPage />
            </Layout>
          } />
          <Route path="/operator/report-issue" element={
            <Layout>
              <ReportIssuePage />
            </Layout>
          } />
          <Route path="/operator/tool-requests" element={
            <Layout>
              <OperatorToolRequests />
            </Layout>
          } />
          <Route path="/operator/reported-issues" element={
            <Layout>
              <OperatorReportedIssues />
            </Layout>
          } />
          <Route path="/operator/used-tools" element={
            <Layout>
              <OperatorUsedTools />
            </Layout>
          } />

          {/* Supervisor dashboard */}
          <Route path="/supervisor-dashboard" element={
            <Layout>
              <SupervisorDashboard />
            </Layout>
          } />
          <Route path="/supervisor/view-tool-requests" element={
            <Layout>
              <SupervisorViewToolRequests />
            </Layout>
          } />
          <Route path="/supervisor/tool-addition-requests" element={
            <Layout>
              <SupervisorToolAdditionRequests />
            </Layout>
          } />
        </Routes>
      </Router>
    </UserProvider>
  );
}
