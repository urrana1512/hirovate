import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiTrendingUp, FiUsers, FiBriefcase, FiAward, FiArrowRight } from 'react-icons/fi';
import './LandingPage.css';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section position-relative overflow-hidden pt-5">
        <div className="container position-relative z-1 pt-5 mt-5">
          <div className="row align-items-center min-vh-75 pt-5">
            <motion.div 
              className="col-lg-6 text-center text-lg-start mb-5 mb-lg-0"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <a href="https://www.tops-int.com/" target="_blank" rel="noreferrer" className="badge bg-primary-light text-primary mb-3 px-3 py-2 rounded-pill fw-semibold text-decoration-none hover-lift">
                Organized by TOPS Technologies 🚀
              </a>
              <h1 className="display-3 fw-bold text-main mb-4 lh-tight">
                Launch Your Career with <span className="text-primary">JobFest</span>
              </h1>
              <p className="lead text-muted mb-5 pe-lg-4">
                The most advanced corporate placement platform connecting top-tier students with industry-leading companies. Seamless interviews, AI resume analysis, and real-time updates.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
                <Link to="/register" className="btn btn-primary btn-lg px-5 py-3 fw-medium premium-card border-0">
                  Join as Student
                </Link>
                <Link to="/register?role=company" className="btn btn-outline-primary btn-lg px-5 py-3 fw-medium">
                  Hire Top Talent
                </Link>
              </div>
            </motion.div>
            <motion.div 
              className="col-lg-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="position-relative">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Students collaborating" 
                  className="img-fluid rounded-4 shadow-lg position-relative z-1"
                />
                <div className="position-absolute top-0 end-0 bg-accent rounded-circle" style={{ width: '300px', height: '300px', filter: 'blur(80px)', opacity: 0.2, transform: 'translate(20%, -20%)' }}></div>
                <div className="position-absolute bottom-0 start-0 bg-primary rounded-circle" style={{ width: '200px', height: '200px', filter: 'blur(60px)', opacity: 0.2, transform: 'translate(-30%, 30%)', zIndex: 0 }}></div>
                
                {/* Floating Card */}
                <motion.div 
                  className="glass-panel position-absolute p-3 rounded-3 shadow-lg d-none d-md-flex align-items-center gap-3"
                  style={{ bottom: '-30px', left: '-40px', zIndex: 2 }}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                >
                  <div className="bg-success text-white p-2 rounded-circle">
                    <FiCheckCircle size={24} />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0">Interview Scheduled</h6>
                    <small className="text-muted">Google - Tomorrow, 10 AM</small>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trusted Companies Marquee */}
      <section className="companies-section py-5 bg-white border-top border-bottom">
        <div className="container text-center">
          <p className="text-muted fw-semibold mb-4 text-uppercase tracking-wider">Trusted by Industry Leaders</p>
          <div className="marquee-wrapper">
            <div className="marquee">
              {['Google', 'Microsoft', 'Amazon', 'Meta', 'Netflix', 'Tesla', 'Adobe', 'Intel'].map((company, i) => (
                <div key={i} className="company-logo mx-4 fw-bold fs-3 text-secondary opacity-50">
                  {company}
                </div>
              ))}
              {/* Duplicate for seamless loop */}
              {['Google', 'Microsoft', 'Amazon', 'Meta', 'Netflix', 'Tesla', 'Adobe', 'Intel'].map((company, i) => (
                <div key={`dup-${i}`} className="company-logo mx-4 fw-bold fs-3 text-secondary opacity-50">
                  {company}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section py-5 my-5">
        <div className="container">
          <div className="row g-4">
            {[
              { icon: <FiUsers />, count: '10,000+', label: 'Students Placed' },
              { icon: <FiBriefcase />, count: '500+', label: 'Top Recruiters' },
              { icon: <FiTrendingUp />, count: '94%', label: 'Success Rate' },
              { icon: <FiAward />, count: '50 LPA', label: 'Highest Package' }
            ].map((stat, i) => (
              <motion.div 
                className="col-6 col-md-3" 
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: { opacity: 1, scale: 1, transition: { delay: i * 0.1 } }
                }}
              >
                <div className="text-center p-4">
                  <div className="text-primary mb-3 display-5">{stat.icon}</div>
                  <h2 className="fw-bold text-main display-5 mb-2">{stat.count}</h2>
                  <p className="text-muted fw-medium">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-5 bg-light">
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold text-main">Enterprise-Grade Features</h2>
            <p className="text-muted fs-5 max-w-2xl mx-auto">Everything you need to streamline the recruitment process from start to finish.</p>
          </div>
          
          <div className="row g-4">
            {[
              { title: 'AI Resume Analyzer', desc: 'Get instant feedback and ATS scoring on your resume to improve your chances.' },
              { title: 'Smart Slot Booking', desc: 'Real-time interview scheduling with conflict detection and automated reminders.' },
              { title: 'QR Attendance', desc: 'Secure, contactless attendance marking for placement drives and seminars.' },
              { title: 'PDF Admit Cards', desc: 'Auto-generated professional admit cards with unique verification QR codes.' },
              { title: 'Recruiter Dashboard', desc: 'Comprehensive applicant tracking and interview pipeline management for companies.' },
              { title: 'Real-time Analytics', desc: 'Live insights and placement statistics for administration and institution heads.' }
            ].map((feature, i) => (
              <div className="col-md-6 col-lg-4" key={i}>
                <div className="premium-card p-4 h-100 bg-white">
                  <div className="bg-primary-light text-primary rounded-3 d-flex align-items-center justify-content-center mb-4" style={{ width: '50px', height: '50px' }}>
                    <FiCheckCircle size={24} />
                  </div>
                  <h4 className="fw-bold mb-3">{feature.title}</h4>
                  <p className="text-muted mb-0">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-5 position-relative overflow-hidden bg-primary text-white text-center">
        <div className="container py-5 position-relative z-1">
          <h2 className="display-5 fw-bold mb-4">Ready to Accelerate Your Career?</h2>
          <p className="lead mb-5 opacity-75 max-w-2xl mx-auto">
            Join thousands of students and top companies already using JobFest to make the perfect match.
          </p>
          <Link to="/register" className="btn btn-light text-primary btn-lg px-5 py-3 fw-bold rounded-pill shadow-lg">
            Get Started Now <FiArrowRight className="ms-2" />
          </Link>
        </div>
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(45deg, var(--primary-dark), var(--primary-color))', zIndex: 0 }}></div>
      </section>
    </div>
  );
};

export default LandingPage;
