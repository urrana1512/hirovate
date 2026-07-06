import { useState, useEffect } from 'react';
import PageTransition from '../../components/PageTransition';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FiUsers, FiCheckCircle, FiSlash } from 'react-icons/fi';

const RecruiterManagement = () => {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecruiters = async () => {
    try {
      const res = await api.get('/admin/recruiters');
      setRecruiters(res.data.data);
    } catch (error) {
      toast.error('Failed to load recruiters');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruiters();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/admin/users/${id}/status`, { status });
      toast.success(`Recruiter status updated to: ${status}`);
      fetchRecruiters();
    } catch (error) {
      toast.error('Failed to update recruiter status');
    }
  };

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
          <h2 className="fw-bold text-primary mb-1">Recruiter Verification</h2>
          <p className="text-muted mb-0">Evaluate company coordinators, check official domains, and authorize dashboard clearances.</p>
        </div>
      </div>

      <div className="premium-card p-4">
        {recruiters.length > 0 ? (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th className="ps-4">Recruiter</th>
                  <th>Company Hub</th>
                  <th>Industry</th>
                  <th>Status</th>
                  <th className="pe-4 text-end">Moderate</th>
                </tr>
              </thead>
              <tbody>
                {recruiters.map(rec => (
                  <tr key={rec._id}>
                    <td className="ps-4">
                      <div className="d-flex align-items-center gap-3">
                        {rec.profile?.logoUrl ? (
                          <img 
                            src={rec.profile.logoUrl} 
                            alt="Logo" 
                            className="rounded-circle border" 
                            style={{ width: 40, height: 40, objectFit: 'cover' }}
                          />
                        ) : (
                          <div className="rounded-circle bg-primary-light text-primary d-flex align-items-center justify-content-center fw-bold" style={{ width: 40, height: 40 }}>
                            {rec.name?.charAt(0)}
                          </div>
                        )}
                        <div>
                          <h6 className="fw-bold mb-0 text-dark">{rec.name}</h6>
                          <span className="text-muted small">{rec.email}</span>
                        </div>
                      </div>
                    </td>
                    <td><strong>{rec.profile?.companyName || 'N/A'}</strong></td>
                    <td><span className="text-muted small">{rec.profile?.industry || 'N/A'}</span></td>
                    <td>
                      <span className="badge bg-primary-light text-primary px-3 py-2 rounded-pill text-capitalize">{rec.status}</span>
                    </td>
                    <td className="pe-4 text-end">
                      <div className="d-flex justify-content-end gap-2">
                        {rec.status !== 'approved' && (
                          <button className="btn btn-sm btn-outline-success d-flex align-items-center gap-1" onClick={() => handleUpdateStatus(rec._id, 'approved')}>
                            <FiCheckCircle /> Authorize
                          </button>
                        )}
                        {rec.status !== 'blocked' ? (
                          <button className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1" onClick={() => handleUpdateStatus(rec._id, 'blocked')}>
                            <FiSlash /> Block
                          </button>
                        ) : (
                          <button className="btn btn-sm btn-outline-success d-flex align-items-center gap-1" onClick={() => handleUpdateStatus(rec._id, 'approved')}>
                            Unblock
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-5">
            <FiUsers className="text-muted display-4 mb-3" />
            <h5 className="fw-bold text-dark">No Corporate Recruiters</h5>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default RecruiterManagement;
