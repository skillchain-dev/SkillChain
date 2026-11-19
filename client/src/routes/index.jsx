import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import PublicLayout from '../layouts/PublicLayout.jsx';
import AuthLayout from '../layouts/AuthLayout.jsx';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import RoleRoute from './RoleRoute.jsx';
import { useAuth } from '../features/auth/useAuth.js';
import { DASHBOARD_HOME, ROLES } from '../constants/roles.js';
import ChatWidget from '../features/chatbot/ChatWidget.jsx';

// Public marketing pages
import HomePage from '../pages/public/HomePage.jsx';
import AboutPage from '../pages/public/AboutPage.jsx';
import ExploreTalentPage from '../pages/public/ExploreTalentPage.jsx';
import NotFoundPage from '../pages/public/NotFoundPage.jsx';

// Auth pages
import LoginPage from '../pages/auth/LoginPage.jsx';
import RegisterPage from '../pages/auth/RegisterPage.jsx';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage.jsx';

// Public verification
import PublicVerificationPage from '../pages/verification/PublicVerificationPage.jsx';

// Student pages
import StudentDashboardPage from '../pages/student/StudentDashboardPage.jsx';
import JobDiscoveryPage from '../pages/student/JobDiscoveryPage.jsx';
import JobDetailsPage from '../pages/student/JobDetailsPage.jsx';
import MyApplicationsPage from '../pages/student/MyApplicationsPage.jsx';
import MySkillsPage from '../pages/student/MySkillsPage.jsx';
import MyProjectsPage from '../pages/student/MyProjectsPage.jsx';
import MyCertificatesPage from '../pages/student/MyCertificatesPage.jsx';
import ResumePage from '../pages/student/ResumePage.jsx';
import StudentAnalyticsPage from '../pages/student/StudentAnalyticsPage.jsx';
import StudentProfilePage from '../pages/student/StudentProfilePage.jsx';

// Recruiter pages
import RecruiterDashboardPage from '../pages/recruiter/RecruiterDashboardPage.jsx';
import ManageJobsPage from '../pages/recruiter/ManageJobsPage.jsx';
import CreateJobPage from '../pages/recruiter/CreateJobPage.jsx';
import JobApplicationsPage from '../pages/recruiter/JobApplicationsPage.jsx';
import CandidatesPage from '../pages/recruiter/CandidatesPage.jsx';
import CompanyProfilePage from '../pages/recruiter/CompanyProfilePage.jsx';
import RecruiterAnalyticsPage from '../pages/recruiter/RecruiterAnalyticsPage.jsx';

// Admin pages
import AdminDashboardPage from '../pages/admin/AdminDashboardPage.jsx';
import CertificateApprovalPage from '../pages/admin/CertificateApprovalPage.jsx';
import CertificateDetailsPage from '../pages/admin/CertificateDetailsPage.jsx';
import StudentManagementPage from '../pages/admin/StudentManagementPage.jsx';
import RecruiterManagementPage from '../pages/admin/RecruiterManagementPage.jsx';
import JobModerationPage from '../pages/admin/JobModerationPage.jsx';
import AdminAnalyticsPage from '../pages/admin/AdminAnalyticsPage.jsx';

// Signed-in users shouldn't see the login/register screens again — bounce them to their dashboard.
function GuestOnly({ children }) {
  const { isAuthenticated, user, initializing } = useAuth();
  const location = useLocation();
  if (initializing) return null;
  if (isAuthenticated) return <Navigate to={DASHBOARD_HOME[user?.role] || '/'} replace state={{ from: location }} />;
  return children;
}

export default function AppRoutes() {
  const { isAuthenticated } = useAuth();
  return (
    <>
    <Routes>
      {/* Public site */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/explore-talent" element={<ExploreTalentPage />} />
        <Route path="/verify" element={<PublicVerificationPage />} />
        <Route path="/verify/:certificateId" element={<PublicVerificationPage />} />
      </Route>

      {/* Auth */}
      <Route element={<GuestOnly><AuthLayout /></GuestOnly>}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* Student — pages manage their own DashboardLayout */}
      <Route path="/student" element={<RoleRoute allow={[ROLES.STUDENT]}><StudentDashboardPage /></RoleRoute>} />
      <Route path="/student/skills" element={<RoleRoute allow={[ROLES.STUDENT]}><MySkillsPage /></RoleRoute>} />
      <Route path="/student/projects" element={<RoleRoute allow={[ROLES.STUDENT]}><MyProjectsPage /></RoleRoute>} />
      <Route path="/student/certificates" element={<RoleRoute allow={[ROLES.STUDENT]}><MyCertificatesPage /></RoleRoute>} />
      <Route path="/student/resume" element={<RoleRoute allow={[ROLES.STUDENT]}><ResumePage /></RoleRoute>} />
      <Route path="/student/analytics" element={<RoleRoute allow={[ROLES.STUDENT]}><StudentAnalyticsPage /></RoleRoute>} />
      <Route path="/student/profile" element={<RoleRoute allow={[ROLES.STUDENT]}><StudentProfilePage /></RoleRoute>} />
      <Route path="/jobs" element={<RoleRoute allow={[ROLES.STUDENT]}><JobDiscoveryPage /></RoleRoute>} />
      <Route path="/jobs/:id" element={<RoleRoute allow={[ROLES.STUDENT]}><JobDetailsPage /></RoleRoute>} />
      <Route path="/applications" element={<RoleRoute allow={[ROLES.STUDENT]}><MyApplicationsPage /></RoleRoute>} />

      {/* Recruiter — pages manage their own DashboardLayout */}
      <Route path="/recruiter" element={<RoleRoute allow={[ROLES.RECRUITER]}><RecruiterDashboardPage /></RoleRoute>} />
      <Route path="/recruiter/jobs" element={<RoleRoute allow={[ROLES.RECRUITER]}><ManageJobsPage /></RoleRoute>} />
      <Route path="/recruiter/jobs/new" element={<RoleRoute allow={[ROLES.RECRUITER]}><CreateJobPage /></RoleRoute>} />
      <Route path="/recruiter/jobs/:id/edit" element={<RoleRoute allow={[ROLES.RECRUITER]}><CreateJobPage /></RoleRoute>} />
      <Route path="/recruiter/jobs/:id/applicants" element={<RoleRoute allow={[ROLES.RECRUITER]}><JobApplicationsPage /></RoleRoute>} />
      <Route path="/recruiter/candidates" element={<RoleRoute allow={[ROLES.RECRUITER]}><CandidatesPage /></RoleRoute>} />
      <Route path="/recruiter/company" element={<RoleRoute allow={[ROLES.RECRUITER]}><CompanyProfilePage /></RoleRoute>} />
      <Route path="/recruiter/analytics" element={<RoleRoute allow={[ROLES.RECRUITER]}><RecruiterAnalyticsPage /></RoleRoute>} />

      {/* Admin — dashboard manages its own DashboardLayout; the remaining pages below
          still render bare content, so they're wrapped here until their owners update them */}
      <Route path="/admin" element={<RoleRoute allow={[ROLES.ADMIN]}><AdminDashboardPage /></RoleRoute>} />
      <Route path="/admin/certificates" element={<RoleRoute allow={[ROLES.ADMIN]}><DashboardLayout role="admin"><CertificateApprovalPage /></DashboardLayout></RoleRoute>} />
      <Route path="/admin/certificates/:certificateId" element={<RoleRoute allow={[ROLES.ADMIN]}><DashboardLayout role="admin"><CertificateDetailsPage /></DashboardLayout></RoleRoute>} />
      <Route path="/admin/students" element={<RoleRoute allow={[ROLES.ADMIN]}><DashboardLayout role="admin"><StudentManagementPage /></DashboardLayout></RoleRoute>} />
      <Route path="/admin/recruiters" element={<RoleRoute allow={[ROLES.ADMIN]}><RecruiterManagementPage /></RoleRoute>} />
      <Route path="/admin/jobs" element={<RoleRoute allow={[ROLES.ADMIN]}><JobModerationPage /></RoleRoute>} />
      <Route path="/admin/analytics" element={<RoleRoute allow={[ROLES.ADMIN]}><AdminAnalyticsPage /></RoleRoute>} />

      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
    {/* AI chatbot: floating button on every page, only for signed-in users */}
    {isAuthenticated && <ChatWidget />}
    </>
  );
}