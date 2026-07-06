import { useState } from 'react';
import PageTransition from '../../components/PageTransition';
import { FiStar, FiMessageSquare } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [anonymous, setAnonymous] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      return toast.warn('Please provide a rating before submitting!');
    }
    if (!feedback.trim()) {
      return toast.warn('Please write a brief feedback comment!');
    }
    toast.success('Thank you! Your feedback has been securely logged.');
    setRating(0);
    setFeedback('');
    setAnonymous(false);
  };

  return (
    <PageTransition>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-primary mb-1">Star Ratings & Placement Feedback</h2>
          <p className="text-muted mb-0">Share your interview experience to help recruiters and future students.</p>
        </div>
      </div>

      <div className="row g-4 justify-content-center">
        <div className="col-lg-6">
          <div className="premium-card p-5 bg-white">
            <h5 className="fw-bold text-center mb-4"><FiMessageSquare className="me-2 text-primary" /> Submit Interview Rating</h5>
            
            <form onSubmit={handleSubmit}>
              <div className="text-center mb-4">
                <p className="text-muted small mb-2">How would you rate the interview coordination?</p>
                <div className="d-flex justify-content-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      className="btn p-0 border-0 bg-transparent"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                    >
                      <FiStar 
                        size={36} 
                        fill={(hover || rating) >= star ? 'var(--warning-color)' : 'transparent'} 
                        stroke={(hover || rating) >= star ? 'var(--warning-color)' : '#cbd5e1'}
                        style={{ transition: 'color 0.2s ease' }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold text-muted">Interview Experience Description</label>
                <textarea 
                  className="form-control" 
                  rows="5"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Share details about the questions asked, venue quality, or interviewer coordination..."
                />
              </div>

              <div className="form-check form-switch mb-4">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  checked={anonymous}
                  onChange={(e) => setAnonymous(e.target.checked)}
                  id="anonymousFeedback" 
                />
                <label className="form-check-label small text-muted" htmlFor="anonymousFeedback">
                  Submit anonymously to recruiters
                </label>
              </div>

              <button type="submit" className="btn btn-primary w-100 py-3 fw-bold">
                Submit Feedback Report
              </button>
            </form>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Feedback;
