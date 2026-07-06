import { useState } from 'react';
import PageTransition from '../../components/PageTransition';
import { FiHelpCircle, FiSend } from 'react-icons/fi';
import { toast } from 'react-toastify';

const RecruiterHelp = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      return toast.warn('All fields are required!');
    }
    toast.success('Support ticket created successfully! Coordinators will address it shortly.');
    setSubject('');
    setMessage('');
  };

  const faqs = [
    { q: 'How do I restrict candidate applications by CGPA?', a: 'When creating a new job role in "Job Openings," configure the "Eligibility Criteria" field (e.g. CGPA >= 8.0) and save it. The system enforces it for student applications.' },
    { q: 'How do I issue offer letters to chosen talents?', a: 'Under "Applicant Tracking," locate the candidates, click the "Select" action, and update status. This triggers final offer confirmation logs.' }
  ];

  return (
    <PageTransition>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-primary mb-1">Recruiter Support & FAQs</h2>
          <p className="text-muted mb-0">Browse common questions or raise a support ticket directly to campus admin offices.</p>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="premium-card p-4 bg-white">
            <h5 className="fw-bold mb-4 text-dark"><FiHelpCircle className="me-2 text-primary"/> Recruiter FAQs</h5>
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
            <h5 className="fw-bold mb-4 text-dark"><FiSend className="me-2 text-primary" /> Raise Ticket</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small">Issue Subject</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Booking conflict in Slot C"
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

export default RecruiterHelp;
