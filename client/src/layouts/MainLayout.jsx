import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import './MainLayout.css';

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  // Determine role based on URL path for demo purposes
  const role = location.pathname.startsWith('/admin') ? 'admin' : 
               location.pathname.startsWith('/recruiter') ? 'company' : 'student';

  return (
    <div className="main-layout">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50 d-md-none" 
          style={{ zIndex: 990 }}
          onClick={() => setMobileOpen(false)}
        ></div>
      )}
      
      <Sidebar 
        collapsed={collapsed} 
        toggleSidebar={toggleSidebar} 
        mobileOpen={mobileOpen}
        role={role}
      />
      
      <div className="main-wrapper">
        <Navbar toggleMobileSidebar={toggleMobileSidebar} />
        
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
