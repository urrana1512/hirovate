import { useState } from 'react';
import PageTransition from '../../components/PageTransition';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FiStar, FiMessageSquare } from 'react-icons/fi';

const RecruiterFeedback = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [category, setCategory] = useState('platform_experience');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      return toast.warn('Please provide a rating before submitting!');
    }
    if (!comment.trim()) {
      return toast.warn('Please write a brief comment!');
    }
    setSubmitting(true);
    try {
      await api.post('/recruiter/feedback', { rating, comment, category });
      toast.success('Thank you! Recruiter feedback logged successfully.');
      setRating(0);
      setComment('');
    } catch (error) {
      toast.error('Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-primary mb-1">Star Ratings & Recruiter Feedback</h2>
          <p className="text-muted mb-0">Rate the student coordination process or provide suggestions regarding platform utilities.</p>
        </div>
      </div>

      <div className="row justify-content-center g-4">
        <div className="col-lg-6">
          <div className="premium-card p-5 bg-white shadow-sm">
            <h5 className="fw-bold text-center mb-4"><FiMessageSquare className="me-2 text-primary" /> Recruiter Rating</h5>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label small fw-semibold text-muted">Feedback Category</label>
                <select 
                  className="form-select" 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="platform_experience">Platform Usability</option>
                  <option value="interview_process">Student Coordination</option>
                  <option value="event">Placement Drive Event</option>
                </select>
              </div>

              <div className="text-center mb-4">
                <p className="text-muted small mb-2">How would you evaluate your experience?</p>
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
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold text-muted">Brief Remarks / Suggestions</label>
                <textarea 
                  className="form-control" 
                  rows="5"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details about the coordinator response, college labs quality, or platform recommendations..."
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-100 py-3 fw-bold" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Post Feedback Report'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default RecruiterFeedback;
