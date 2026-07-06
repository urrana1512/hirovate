import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AnimatePresence } from 'framer-motion';
import MainLayout from './layouts/MainLayout';
import PublicLayout from './layouts/PublicLayout';
import GuestGuard from './components/GuestGuard';
import AuthGuard from './components/AuthGuard';
import LandingPage from './pages/public/LandingPage';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import FAQs from './pages/public/FAQs';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyOTP from './pages/auth/VerifyOTP';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Student Panel Imports
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import ResumeBuilder from './pages/student/ResumeBuilder';
import ResumeAnalyzer from './pages/student/ResumeAnalyzer';
import CompanyListing from './pages/student/CompanyListing';
import CompanyDetails from './pages/student/CompanyDetails';
import Jobs from './pages/student/Jobs';
import Applications from './pages/student/Applications';
import Bookings from './pages/student/Bookings';
import AdmitCard from './pages/student/AdmitCard';
import Attendance from './pages/student/Attendance';
import Notifications from './pages/student/Notifications';
import Events from './pages/student/Events';
import Certificates from './pages/student/Certificates';
import Feedback from './pages/student/Feedback';
import Settings from './pages/student/Settings';
import HelpSupport from './pages/student/HelpSupport';

// Recruiter Panel Imports
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import CompanyProfileSetup from './pages/recruiter/CompanyProfileSetup';
import JobManagement from './pages/recruiter/JobManagement';
import ApplicantManagement from './pages/recruiter/ApplicantManagement';
import InterviewManagement from './pages/recruiter/InterviewManagement';
import ManageSlots from './pages/recruiter/ManageSlots';
import ShortlistedCandidates from './pages/recruiter/ShortlistedCandidates';
import RecruiterAttendance from './pages/recruiter/RecruiterAttendance';
import RecruiterNotifications from './pages/recruiter/RecruiterNotifications';
import ReportsAnalytics from './pages/recruiter/ReportsAnalytics';
import RecruiterEvents from './pages/recruiter/RecruiterEvents';
import RecruiterFeedback from './pages/recruiter/RecruiterFeedback';
import RecruiterSettings from './pages/recruiter/RecruiterSettings';
import RecruiterHelp from './pages/recruiter/RecruiterHelp';
import StudentLiveQueue from './pages/student/StudentLiveQueue';
import QueueDashboard from './pages/recruiter/QueueDashboard';

// Admin Panel Imports
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentManagement from './pages/admin/StudentManagement';
import RecruiterManagement from './pages/admin/RecruiterManagement';
import CompanyManagement from './pages/admin/CompanyManagement';
import AdminJobManagement from './pages/admin/JobManagement';
import ApplicationsManagement from './pages/admin/ApplicationsManagement';
import InterviewSlotManagement from './pages/admin/InterviewSlotManagement';
import AttendanceManagement from './pages/admin/AttendanceManagement';
import EventsManagement from './pages/admin/EventsManagement';
import NotificationsManagement from './pages/admin/NotificationsManagement';
import FeedbackManagement from './pages/admin/FeedbackManagement';
import AdminReportsAnalytics from './pages/admin/ReportsAnalytics';
import SystemSettings from './pages/admin/SystemSettings';
import ActivityLogs from './pages/admin/ActivityLogs';
import AdminHelpSupport from './pages/admin/HelpSupport';

function App() {
  return (
    <div className="app-container">
      <AnimatePresence mode="wait">
        <Routes>
          {/* Public Routes wrapped in PublicLayout */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="faqs" element={<FAQs />} />
            <Route path="events" element={<div className="pt-5 mt-5 container text-center"><h1>Events Coming Soon</h1></div>} />
            <Route path="companies" element={<div className="pt-5 mt-5 container text-center"><h1>Companies Coming Soon</h1></div>} />
            <Route path="login" element={<GuestGuard><Login /></GuestGuard>} />
            <Route path="register" element={<GuestGuard><Register /></GuestGuard>} />
            <Route path="verify-otp" element={<GuestGuard><VerifyOTP /></GuestGuard>} />
            <Route path="forgot-password" element={<GuestGuard><ForgotPassword /></GuestGuard>} />
            <Route path="reset-password" element={<GuestGuard><ResetPassword /></GuestGuard>} />
          </Route>
          
          {/* Student Routes wrapped in MainLayout */}
          <Route path="/student" element={<AuthGuard allowedRoles={['student']}><MainLayout /></AuthGuard>}>
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="resume-builder" element={<ResumeBuilder />} />
            <Route path="resume-analyzer" element={<ResumeAnalyzer />} />
            <Route path="companies" element={<CompanyListing />} />
            <Route path="companies/:id" element={<CompanyDetails />} />
            <Route path="jobs" element={<Jobs />} />
            <Route path="applications" element={<Applications />} />
            <Route path="admit-card/:id" element={<AdmitCard />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="events" element={<Events />} />
            <Route path="certificates" element={<Certificates />} />
            <Route path="feedback" element={<Feedback />} />
            <Route path="settings" element={<Settings />} />
            <Route path="help" element={<HelpSupport />} />
            <Route path="queue" element={<StudentLiveQueue />} />
          </Route>

          {/* Recruiter Routes wrapped in MainLayout */}
          <Route path="/recruiter" element={<AuthGuard allowedRoles={['company']}><MainLayout /></AuthGuard>}>
            <Route path="dashboard" element={<RecruiterDashboard />} />
            <Route path="profile" element={<CompanyProfileSetup />} />
            <Route path="jobs" element={<JobManagement />} />
            <Route path="applicants" element={<ApplicantManagement />} />
            <Route path="interviews" element={<InterviewManagement />} />
            <Route path="shortlisted" element={<ShortlistedCandidates />} />
            <Route path="attendance" element={<RecruiterAttendance />} />
            <Route path="notifications" element={<RecruiterNotifications />} />
            <Route path="reports" element={<ReportsAnalytics />} />
            <Route key="recruiter-events" path="events" element={<RecruiterEvents />} />
            <Route path="feedback" element={<RecruiterFeedback />} />
            <Route path="settings" element={<RecruiterSettings />} />
            <Route path="help" element={<RecruiterHelp />} />
            <Route path="queue" element={<QueueDashboard />} />
          </Route>

          {/* Admin Routes wrapped in MainLayout */}
          <Route path="/admin" element={<AuthGuard allowedRoles={['admin']}><MainLayout /></AuthGuard>}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="students" element={<StudentManagement />} />
            <Route path="recruiters" element={<RecruiterManagement />} />
            <Route path="companies" element={<CompanyManagement />} />
            <Route path="jobs" element={<AdminJobManagement />} />
            <Route path="applications" element={<ApplicationsManagement />} />
            <Route path="attendance" element={<AttendanceManagement />} />
            <Route path="events" element={<EventsManagement />} />
            <Route path="notifications" element={<NotificationsManagement />} />
            <Route path="feedback" element={<FeedbackManagement />} />
            <Route path="reports" element={<AdminReportsAnalytics />} />
            <Route path="settings" element={<SystemSettings />} />
            <Route path="logs" element={<ActivityLogs />} />
            <Route path="help" element={<AdminHelpSupport />} />
          </Route>
        </Routes>
      </AnimatePresence>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}

export default App;
