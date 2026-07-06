import { motion } from 'framer-motion';
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';

const Contact = () => {
  return (
    <div className="pt-5 mt-5 container mb-5">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-5">
        <h1 className="fw-bold text-main">Contact Support</h1>
        <p className="text-muted lead max-w-2xl mx-auto">We are here to help you with your placement queries 24/7.</p>
      </motion.div>

      <div className="row g-5">
        <div className="col-lg-5">
          <div className="premium-card p-4 h-100 bg-primary text-white">
            <h3 className="fw-bold mb-4">Get In Touch</h3>
            <p className="opacity-75 mb-5">Fill out the form and our team will get back to you within 24 hours.</p>
            
            <div className="d-flex flex-column gap-4">
              <div className="d-flex align-items-center gap-3">
                <FiPhone size={24} />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="d-flex align-items-center gap-3">
                <FiMail size={24} />
                <span>contact@hirovate.com</span>
              </div>
              <div className="d-flex align-items-center gap-3">
                <FiMapPin size={24} />
                <span>123 Innovation Drive, Tech Park<br/>Silicon Valley, CA 94043</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-7">
          <div className="premium-card p-4 h-100">
            <form>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label text-muted small fw-semibold">Your Name</label>
                  <input type="text" className="form-control" placeholder="John Doe" />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted small fw-semibold">Email Address</label>
                  <input type="email" className="form-control" placeholder="john@example.com" />
                </div>
                <div className="col-12">
                  <label className="form-label text-muted small fw-semibold">Subject</label>
                  <input type="text" className="form-control" placeholder="How can we help?" />
                </div>
                <div className="col-12">
                  <label className="form-label text-muted small fw-semibold">Message</label>
                  <textarea className="form-control" rows="5" placeholder="Write your message here..."></textarea>
                </div>
                <div className="col-12 mt-4">
                  <button type="button" className="btn btn-primary px-5 py-2 fw-medium">Send Message</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
