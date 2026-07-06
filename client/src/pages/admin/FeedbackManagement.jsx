import { useState, useEffect } from 'react';
import PageTransition from '../../components/PageTransition';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FiStar, FiMessageSquare } from 'react-icons/fi';

const FeedbackManagement = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await api.get('/admin/feedbacks');
        setFeedbacks(res.data.data);
      } catch (error) {
        toast.error('Failed to load ratings');
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  if (loading) {
    return (
      <PageTransition>
        <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-primary mb-1">Recruiter Feedbacks</h2>
          <p className="text-muted mb-0">Evaluate five-star reviews, suggest usability upgrades, and inspect comments from recruiters.</p>
        </div>
      </div>

      <div className="premium-card p-4">
        {feedbacks.length > 0 ? (
          <div className="d-flex flex-column gap-3">
            {feedbacks.map(f => (
              <div key={f._id} className="p-3 border rounded-3 bg-light d-flex justify-content-between align-items-start flex-wrap gap-3">
                <div>
                  <h6 className="fw-bold mb-1 text-dark d-flex align-items-center gap-2">
                    <FiMessageSquare className="text-primary"/> {f.company?.companyName || 'Syndell Technologies'}
                  </h6>
                  <p className="text-muted small mb-0">{f.comment}</p>
                  <span className="badge bg-primary-light text-primary mt-2 text-capitalize">{f.category?.replace('_', ' ')}</span>
                </div>
                <div className="d-flex align-items-center gap-1 text-warning">
                  {[...Array(f.rating)].map((_, i) => (
                    <FiStar key={i} fill="var(--warning-color)" stroke="var(--warning-color)"/>
                  ))}
                  {[...Array(5 - f.rating)].map((_, i) => (
                    <FiStar key={i} stroke="#cbd5e1" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5">
            <FiStar className="text-muted display-4 mb-3" />
            <h5 className="fw-bold text-dark">No Platform Ratings Submitted</h5>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default FeedbackManagement;
