import { useState, useEffect } from 'react';
import PageTransition from '../../components/PageTransition';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FiActivity, FiUser, FiClock } from 'react-icons/fi';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get('/admin/logs');
        setLogs(res.data.data);
      } catch (error) {
        toast.error('Failed to load activity log');
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
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
          <h2 className="fw-bold text-primary mb-1">Transactional Activity History</h2>
          <p className="text-muted mb-0">Review administrative updates, login histories, and recruiter verifications.</p>
        </div>
      </div>

      <div className="premium-card p-4">
        {logs.length > 0 ? (
          <div className="d-flex flex-column gap-3">
            {logs.map(log => (
              <div key={log._id} className="p-3 border rounded-3 bg-light d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div>
                  <h6 className="fw-bold mb-1 text-dark d-flex align-items-center gap-2">
                    <FiActivity className="text-primary"/> {log.action}
                  </h6>
                  <p className="text-muted small mb-0">{log.details}</p>
                </div>
                <div className="d-flex flex-column align-items-end small text-muted">
                  <span className="d-flex align-items-center gap-1"><FiUser /> {log.user?.email || 'Admin'}</span>
                  <span className="d-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}><FiClock /> {new Date(log.createdAt).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5">
            <FiActivity className="text-muted display-4 mb-3" />
            <h5 className="fw-bold text-dark">No Platform Activities Logged</h5>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default ActivityLogs;
