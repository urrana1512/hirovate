import { useState, useEffect } from 'react';
import { FiSearch, FiBell, FiMoon, FiSun, FiMenu } from 'react-icons/fi';
import api from '../services/api';

const Navbar = ({ toggleMobileSidebar }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [profileImg, setProfileImg] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.body.setAttribute('data-theme', 'dark');
    }

    const fetchProfileImg = async () => {
      try {
        if (user.role === 'student') {
          const res = await api.get('/student/profile');
          if (res.data.data?.profileImageUrl) {
            setProfileImg(res.data.data.profileImageUrl);
          }
        } else if (user.role === 'recruiter' || user.role === 'company') {
          const res = await api.get('/recruiter/profile');
          if (res.data.data?.logoUrl) {
            setProfileImg(res.data.data.logoUrl);
          }
        }
      } catch (err) {
        // Fallback gracefully
      }
    };
    if (user.role) {
      fetchProfileImg();
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.body.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <header className="top-navbar">
      <div className="d-flex align-items-center">
        <button className="icon-btn d-md-none me-3" onClick={toggleMobileSidebar}>
          <FiMenu />
        </button>
        <div className="navbar-search">
          <FiSearch className="text-muted" />
          <input type="text" placeholder="Search companies, jobs, events..." />
        </div>
      </div>

      <div className="navbar-actions">
        <button className="icon-btn" onClick={toggleTheme}>
          {isDarkMode ? <FiSun /> : <FiMoon />}
        </button>
        <button className="icon-btn position-relative">
          <FiBell />
          <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
            <span className="visually-hidden">New alerts</span>
          </span>
        </button>
        
        <button className="user-profile-btn ms-2">
          <img 
            src={profileImg || `https://ui-avatars.com/api/?name=${user.name ? encodeURIComponent(user.name) : 'User'}&background=2b5c8f&color=fff`} 
            alt="User Avatar" 
            className="user-avatar"
            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '50%' }}
          />
          <div className="user-info d-none d-sm-block text-start">
            <span className="user-name">{user.name || 'User'}</span>
            <span className="user-role text-capitalize">{user.role || 'Guest'}</span>
          </div>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
