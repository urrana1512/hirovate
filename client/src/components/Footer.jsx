import { Link } from 'react-router-dom';
import { FiBriefcase, FiTwitter, FiLinkedin, FiInstagram, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-4 mt-auto">
      <div className="container pt-4">
        <div className="row g-4 mb-5">
          <div className="col-lg-4 pe-lg-5">
            <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none text-white mb-3">
              <img src="/logo-dark.png" alt="Hirovate Logo" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px' }} />
              <div>
                <span className="fw-bold fs-4 d-block lh-1">Hirovate</span>
                <span className="text-muted small" style={{ fontSize: '0.75rem' }}>Empowering Placement Drives</span>
              </div>
            </Link>
            <p className="text-muted mb-4" style={{ lineHeight: '1.8' }}>
              The premium corporate placement platform connecting top tier students with industry-leading companies through seamless interview scheduling and recruitment management.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="btn btn-outline-light rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                <FiTwitter />
              </a>
              <a href="#" className="btn btn-outline-light rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                <FiLinkedin />
              </a>
              <a href="#" className="btn btn-outline-light rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                <FiInstagram />
              </a>
            </div>
          </div>

          <div className="col-lg-2 col-md-4">
            <h5 className="fw-bold mb-4">Quick Links</h5>
            <ul className="list-unstyled d-flex flex-column gap-3">
              <li><Link to="/about" className="text-muted text-decoration-none hover-primary">About Us</Link></li>
              <li><Link to="/companies" className="text-muted text-decoration-none hover-primary">Companies</Link></li>
              <li><Link to="/events" className="text-muted text-decoration-none hover-primary">Events</Link></li>
              <li><Link to="/contact" className="text-muted text-decoration-none hover-primary">Contact</Link></li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-4">
            <h5 className="fw-bold mb-4">Legal</h5>
            <ul className="list-unstyled d-flex flex-column gap-3">
              <li><Link to="/terms" className="text-muted text-decoration-none hover-primary">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-muted text-decoration-none hover-primary">Privacy Policy</Link></li>
              <li><Link to="/faqs" className="text-muted text-decoration-none hover-primary">FAQs</Link></li>
            </ul>
          </div>

          <div className="col-lg-4 col-md-4">
            <h5 className="fw-bold mb-4">Contact Info</h5>
            <ul className="list-unstyled d-flex flex-column gap-3 text-muted">
              <li className="d-flex align-items-start gap-3">
                <FiMapPin className="text-primary mt-1" size={20} />
                <span><strong>Hirovate HQ</strong><br />123 Innovation Drive, Tech Park<br />Silicon Valley, CA 94043</span>
              </li>
              <li className="d-flex align-items-center gap-3">
                <FiPhone className="text-primary" size={20} />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="d-flex align-items-center gap-3">
                <FiMail className="text-primary" size={20} />
                <span><a href="mailto:contact@hirovate.com" className="text-muted text-decoration-none">contact@hirovate.com</a></span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-top border-secondary pt-4 mt-4 d-flex flex-column flex-md-row justify-content-between align-items-center text-muted small">
          <p className="mb-2 mb-md-0">&copy; {new Date().getFullYear()} Hirovate. All rights reserved.</p>
          <p className="mb-0">Designed with <span className="text-danger">♥</span> for Students & Recruiters</p>
        </div>
      </div>
      <style>{`
        .hover-primary { transition: color 0.2s; }
        .hover-primary:hover { color: var(--primary-color) !important; }
      `}</style>
    </footer>
  );
};

export default Footer;
