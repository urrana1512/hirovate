import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FiMenu, FiX, FiBriefcase } from 'react-icons/fi';
import './PublicNavbar.css';

const PublicNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <nav className={`public-navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container d-flex align-items-center justify-content-between h-100">
        
        {/* Logo */}
        <Link to="/" className="navbar-logo d-flex align-items-center gap-2 text-decoration-none">
          <img src="/logo.png" alt="JobFest Logo" style={{ width: '38px', height: '38px', objectFit: 'cover', borderRadius: '8px' }} />
          <span className="fw-bold fs-4 text-primary">JobFest</span>
        </Link>

        {/* Desktop Links */}
        <div className="desktop-menu d-none d-lg-flex align-items-center gap-4">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Home</NavLink>
          <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>About</NavLink>
          <NavLink to="/companies" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Companies</NavLink>
          <NavLink to="/events" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Events</NavLink>
          <NavLink to="/faqs" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>FAQs</NavLink>
          <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Contact</NavLink>
        </div>

        {/* Desktop CTAs */}
        <div className="desktop-ctas d-none d-lg-flex align-items-center gap-3">
          <Link to="/login" className="btn btn-outline-primary fw-medium px-4">Login</Link>
          <Link to="/register" className="btn btn-primary fw-medium px-4 premium-card border-0">Sign Up</Link>
        </div>

        {/* Mobile Toggle */}
        <button className="mobile-toggle d-lg-none btn btn-link text-primary p-0 border-0" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </button>

      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu d-lg-none animate__animated animate__fadeInDown">
          <div className="container py-4 d-flex flex-column gap-3">
            <Link to="/" className="mobile-nav-link" onClick={toggleMobileMenu}>Home</Link>
            <Link to="/about" className="mobile-nav-link" onClick={toggleMobileMenu}>About</Link>
            <Link to="/companies" className="mobile-nav-link" onClick={toggleMobileMenu}>Companies</Link>
            <Link to="/events" className="mobile-nav-link" onClick={toggleMobileMenu}>Events</Link>
            <Link to="/faqs" className="mobile-nav-link" onClick={toggleMobileMenu}>FAQs</Link>
            <Link to="/contact" className="mobile-nav-link" onClick={toggleMobileMenu}>Contact</Link>
            <hr className="text-muted opacity-25" />
            <Link to="/login" className="btn btn-outline-primary w-100" onClick={toggleMobileMenu}>Login</Link>
            <Link to="/register" className="btn btn-primary w-100" onClick={toggleMobileMenu}>Sign Up</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default PublicNavbar;
