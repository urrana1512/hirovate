import { useState } from 'react';
import PageTransition from '../../components/PageTransition';
import { FiHelpCircle, FiSend, FiUser, FiInfo } from 'react-icons/fi';
import { toast } from 'react-toastify';

const HelpSupport = () => {
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');

  const handleCreateTicket = (e) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) {
      return toast.warn('Please fill out all ticket fields!');
    }
    toast.success('Your support ticket has been created! Our support team will reply within 24h.');
    setTicketSubject('');
    setTicketMessage('');
  };

  const faqs = [
    { q: 'How do I schedule an interview slot?', a: 'Once a company shortlists you, navigate to the "Companies" or "Bookings" panel, click "Book Slot," select your preferred time, and confirm.' },
    { q: 'What is the profile strength threshold to apply for jobs?', a: 'You need at least 60% profile completion score. Upload your resume and details in the "My Profile" tab to reach 100% completion instantly.' },
    { q: 'Where do I find my placement drive Admit Card?', a: 'Go to "My Applications." If your status is "Interview Scheduled," a button to generate and view your Admit Card will appear next to the listing.' }
  ];

  return (
    <PageTransition>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-primary mb-1">Help & Student Support</h2>
          <p className="text-muted mb-0">Browse common FAQ guidelines or raise a dynamic coordination ticket directly to administrators.</p>
        </div>
      </div>

      <div className="row g-4">
        {/* FAQs */}
        <div className="col-lg-7">
          <div className="premium-card p-4 bg-white">
            <h5 className="fw-bold mb-4 text-dark"><FiHelpCircle className="me-2 text-primary"/> Placement Portal FAQs</h5>
            
            <div className="d-flex flex-column gap-3">
              {faqs.map((faq, i) => (
                <div key={i} className="p-3 border rounded-3 bg-light">
                  <h6 className="fw-bold mb-2 text-dark">Q: {faq.q}</h6>
                  <p className="text-muted small mb-0">A: {faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Support Ticket form */}
        <div className="col-lg-5">
          <div className="premium-card p-4 bg-white">
            <h5 className="fw-bold mb-4 text-dark"><FiSend className="me-2 text-primary" /> Raise Support Ticket</h5>
            
            <form onSubmit={handleCreateTicket}>
              <div className="mb-3">
                <label className="form-label small">Ticket Issue / Subject</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="e.g., Unable to select interview slot"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label small">Describe your issue in detail</label>
                <textarea 
                  className="form-control" 
                  rows="6"
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  placeholder="Describe your issue so coordinators can investigate..."
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-100 py-3 fw-bold">
                Submit Support Ticket
              </button>
            </form>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default HelpSupport;
