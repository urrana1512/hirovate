import { NavLink } from 'react-router-dom';
import { 
  FiHome, 
  FiUser, 
  FiBriefcase, 
  FiCalendar, 
  FiCheckSquare, 
  FiPieChart, 
  FiUsers,
  FiSettings,
  FiChevronLeft,
  FiChevronRight,
  FiLogOut,
  FiFileText,
  FiTrendingUp,
  FiLayers,
  FiBell,
  FiBookmark,
  FiAward,
  FiMessageSquare,
  FiHelpCircle,
  FiSliders,
  FiUserCheck,
  FiActivity
} from 'react-icons/fi';

const Sidebar = ({ collapsed, toggleSidebar, mobileOpen, role = 'student' }) => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const studentMenu = [
    { path: '/student/dashboard', name: 'Dashboard', icon: <FiHome /> },
    { path: '/student/queue', name: 'Live Interview Queue', icon: <FiActivity /> },
    { path: '/student/profile', name: 'Profile', icon: <FiUser /> },
    { path: '/student/resume-builder', name: 'Resume Builder', icon: <FiFileText /> },
    { path: '/student/resume-analyzer', name: 'Resume Analyzer', icon: <FiTrendingUp /> },
    { path: '/student/companies', name: 'Companies', icon: <FiBriefcase /> },
    { path: '/student/jobs', name: 'Job Openings', icon: <FiBriefcase /> },
    { path: '/student/applications', name: 'Applications', icon: <FiLayers /> },
    { path: '/student/attendance', name: 'Attendance', icon: <FiCheckSquare /> },
    { path: '/student/notifications', name: 'Notifications', icon: <FiBell /> },
    { path: '/student/events', name: 'Events', icon: <FiBookmark /> },
    { path: '/student/certificates', name: 'Certificates', icon: <FiAward /> },
    { path: '/student/feedback', name: 'Feedback', icon: <FiMessageSquare /> },
    { path: '/student/settings', name: 'Settings', icon: <FiSettings /> },
    { path: '/student/help', name: 'Help & Support', icon: <FiHelpCircle /> },
  ];

  const recruiterMenu = [
    { path: '/recruiter/dashboard', name: 'Company Hub', icon: <FiHome /> },
    { path: '/recruiter/queue', name: 'Live Drive Queue', icon: <FiActivity /> },
    { path: '/recruiter/profile', name: 'Company Profile', icon: <FiUser /> },
    { path: '/recruiter/jobs', name: 'Job Openings', icon: <FiBriefcase /> },
    { path: '/recruiter/applicants', name: 'My Candidates', icon: <FiUsers /> },
    { path: '/recruiter/interviews', name: 'Interview Panel', icon: <FiSliders /> },
    { path: '/recruiter/shortlisted', name: 'Shortlisted Pool', icon: <FiAward /> },
    { path: '/recruiter/attendance', name: 'Drive Attendance', icon: <FiUserCheck /> },
    { path: '/recruiter/notifications', name: 'Hiring Alerts', icon: <FiBell /> },
    { path: '/recruiter/reports', name: 'Hiring Reports', icon: <FiPieChart /> },
    { path: '/recruiter/events', name: 'Placement Events', icon: <FiBookmark /> },
    { path: '/recruiter/feedback', name: 'Feedback Reports', icon: <FiMessageSquare /> },
    { path: '/recruiter/settings', name: 'Preferences', icon: <FiSettings /> },
    { path: '/recruiter/help', name: 'Get Help', icon: <FiHelpCircle /> },
  ];

  const adminMenu = [
    { path: '/admin/dashboard', name: 'Overview Control', icon: <FiPieChart /> },
    { path: '/admin/students', name: 'Students Desk', icon: <FiUsers /> },
    { path: '/admin/recruiters', name: 'Recruiters Desk', icon: <FiUsers /> },
    { path: '/admin/companies', name: 'Company Listings', icon: <FiBriefcase /> },
    { path: '/admin/jobs', name: 'Posted Vacancies', icon: <FiLayers /> },
    { path: '/admin/applications', name: 'Central ATS', icon: <FiSliders /> },
    { path: '/admin/attendance', name: 'Check-in Monitor', icon: <FiUserCheck /> },
    { path: '/admin/events', name: 'Placement Drives', icon: <FiBookmark /> },
    { path: '/admin/notifications', name: 'Alert Broadcasts', icon: <FiBell /> },
    { path: '/admin/feedback', name: 'Ratings & Comments', icon: <FiMessageSquare /> },
    { path: '/admin/reports', name: 'Placements Yield', icon: <FiTrendingUp /> },
    { path: '/admin/settings', name: 'System Options', icon: <FiSettings /> },
    { path: '/admin/logs', name: 'Activity Log', icon: <FiActivity /> },
    { path: '/admin/help', name: 'Developer Help', icon: <FiHelpCircle /> },
  ];

  const menuItems = role === 'admin' ? adminMenu : role === 'company' ? recruiterMenu : studentMenu;

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`} style={{ overflowY: 'auto' }}>
      <div className="sidebar-header" style={{ padding: collapsed ? '1.5rem 0.5rem' : '1.5rem', justifyContent: collapsed ? 'center' : 'space-between' }}>
        <div className="sidebar-logo d-flex align-items-center gap-2">
          <img src="/logo.png" alt="JobFest Logo" style={{ width: '30px', height: '30px', objectFit: 'cover', borderRadius: '6px' }} />
          {!collapsed && <span className="fw-bold fs-4 text-white" style={{ letterSpacing: '0.5px' }}>JobFest</span>}
        </div>
        {!collapsed && (
          <button className="sidebar-toggle-btn d-none d-md-flex" onClick={toggleSidebar}>
            <FiChevronLeft />
          </button>
        )}
        {collapsed && (
          <button className="sidebar-toggle-btn d-none d-md-flex mx-auto" onClick={toggleSidebar} style={{ position: 'absolute', right: '-15px', top: '25px', zIndex: 10 }}>
            <FiChevronRight />
          </button>
        )}
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item, index) => (
          <NavLink 
            key={index} 
            to={item.path} 
            className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
          >
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-text">{item.name}</span>
          </NavLink>
        ))}
        
        <div className="mt-auto pt-4 pb-2">
          <button 
            className="menu-item text-danger border-0 bg-transparent w-100 text-start" 
            onClick={handleLogout}
            style={{ padding: '0.8rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'all 0.3s ease' }}
          >
            <span className="menu-icon"><FiLogOut /></span>
            <span className="menu-text">Log Out</span>
          </button>
          {!collapsed && (
            <div className="text-center mt-3 pt-2 border-top" style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>
              Organized by <br />
              <a href="https://www.tops-int.com/" target="_blank" rel="noreferrer" className="text-decoration-none fw-bold" style={{ color: 'var(--primary-color)' }}>
                TOPS Technologies
              </a>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
