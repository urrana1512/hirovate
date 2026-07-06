import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="pt-5 mt-5 container">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-5">
        <h1 className="fw-bold text-main">About JobFest</h1>
        <p className="text-muted lead max-w-2xl mx-auto">Bridging the gap between academic excellence and corporate success.</p>
      </motion.div>
      
      <div className="row g-5 align-items-center mb-5">
        <div className="col-lg-6">
          <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Team meeting" className="img-fluid rounded-4 shadow" />
        </div>
        <div className="col-lg-6">
          <h2 className="fw-bold mb-4">Our Mission</h2>
          <p className="text-muted fs-5">
            At JobFest, we believe that talent should seamlessly meet opportunity. We've built an enterprise-grade platform that removes the friction from university placements.
          </p>
          <p className="text-muted fs-5 mb-4">
            By automating slot bookings, generating smart admit cards, and providing deep analytics, we empower students to focus on their skills while recruiters find their perfect fit without the administrative overhead.
          </p>
          <div className="d-flex gap-4">
            <div>
              <h3 className="fw-bold text-primary mb-0">50+</h3>
              <span className="text-muted small text-uppercase tracking-wider">Universities</span>
            </div>
            <div>
              <h3 className="fw-bold text-primary mb-0">1M+</h3>
              <span className="text-muted small text-uppercase tracking-wider">Interviews</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
