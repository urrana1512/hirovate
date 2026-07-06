import { useState } from 'react';
import PageTransition from '../../components/PageTransition';
import { FiHelpCircle, FiSend } from 'react-icons/fi';
import { toast } from 'react-toastify';

const HelpSupport = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      return toast.warn('All fields are required!');
    }
    toast.success('Query logged to technical developers dashboard!');
    setSubject('');
    setMessage('');
  };

  const faqs = [
    { q: 'How do I unblock a student account?', a: 'Navigate to "Students," locate the target student, and click "Unblock." Their platform permissions are instantly restored.' },
    { q: 'How do I approve newly registered recruiters?', a: 'Go to the main "Dashboard" pending list or open "Recruiters." Click "Authorize" on their account row to allow login clearance.' }
  ];

  return (
    <PageTransition>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-primary mb-1">Administrative Help Desk</h2>
          <p className="text-muted mb-0">Browse common questions or raise a support ticket directly to our system developers.</p>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="premium-card p-4 bg-white">
            <h5 className="fw-bold mb-4 text-dark"><FiHelpCircle className="me-2 text-primary"/> Technical FAQ</h5>
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

        <div className="col-lg-5">
          <div className="premium-card p-4 bg-white">
            <h5 className="fw-bold mb-4 text-dark"><FiSend className="me-2 text-primary" /> System developer ticket</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small">Ticket Subject</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. SMTP configuration failure"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label small">Describe your issue in detail</label>
                <textarea 
                  className="form-control" 
                  rows="6"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your issue..."
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-100 py-3 fw-bold">
                Submit Developer Ticket
              </button>
            </form>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default HelpSupport;
