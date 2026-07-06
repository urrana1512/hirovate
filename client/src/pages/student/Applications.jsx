import { useState, useEffect } from 'react';
import PageTransition from '../../components/PageTransition';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FiCheckCircle, FiFileText, FiClock, FiXCircle, FiTrendingUp } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get('/student/applications');
        setApplications(res.data.data || []);
      } catch (error) {
        toast.error('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'selected':
        return <span className="badge bg-success-light text-success px-3 py-2 rounded-pill"><FiCheckCircle className="me-1"/> Selected</span>;
      case 'rejected':
        return <span className="badge bg-danger-light text-danger px-3 py-2 rounded-pill"><FiXCircle className="me-1"/> Rejected</span>;
      case 'interview_scheduled':
        return <span className="badge bg-warning-light text-warning px-3 py-2 rounded-pill"><FiClock className="me-1"/> Interview Scheduled</span>;
      case 'shortlisted':
        return <span className="badge bg-info-light text-info px-3 py-2 rounded-pill"><FiTrendingUp className="me-1"/> Shortlisted</span>;
      default:
        return <span className="badge bg-primary-light text-primary px-3 py-2 rounded-pill"><FiClock className="me-1"/> Applied</span>;
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
          <h2 className="fw-bold text-primary mb-1">My Applications</h2>
          <p className="text-muted mb-0">Track the current status of all your recruitment processes in real-time.</p>
        </div>
      </div>

      <div className="premium-card p-4">
        {applications.length > 0 ? (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th className="ps-4">Company</th>
                  <th>Job Role</th>
                  <th>Interview Schedule</th>
                  <th>Status</th>
                  <th className="pe-4 text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(app => (
                  <tr key={app._id}>
                    <td className="ps-4">
                      <div className="d-flex align-items-center gap-3">
                        <img 
                          src={app.company?.logoUrl || app.company?.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(app.company?.companyName || 'C')}&background=random`} 
                          alt="logo"
                          className="rounded"
                          style={{ width: 44, height: 44, objectFit: 'cover' }}
                        />
                        <div>
                          <h6 className="fw-bold mb-0 text-dark">{app.company?.companyName}</h6>
                          <span className="text-muted small">{app.company?.industry}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      {app.job ? (
                        <div>
                          <p className="fw-semibold mb-0 small text-dark">{app.job?.title}</p>
                          <span className="text-muted small">{app.job?.role}</span>
                        </div>
                      ) : (
                        <span className="text-muted small">—</span>
                      )}
                    </td>
                    <td>
                      {app.slot ? (
                        <div>
                          <p className="fw-semibold mb-0 small">{app.slot.startTime} — {app.slot.endTime}</p>
                          <span className="text-muted small">{app.slot.venue}</span>
                        </div>
                      ) : (
                        <div>
                          <p className="fw-semibold mb-0 small text-primary">Direct Application</p>
                          <span className="text-muted small">Venue: Main Placements Hall</span>
                        </div>
                      )}
                    </td>
                    <td>
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="pe-4 text-end">
                      {app.status === 'interview_scheduled' ? (
                        <Link to={`/student/admit-card/${app._id}`} className="btn btn-sm btn-outline-primary fw-medium">
                          <FiFileText className="me-1"/> View Admit Card
                        </Link>
                      ) : (
                        <button className="btn btn-sm btn-light fw-medium" disabled>
                          No Action Required
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-5">
            <FiClock className="text-muted display-4 mb-3" />
            <h5 className="fw-bold text-dark">No Applications Found</h5>
            <p className="text-muted small mb-4">You have not applied to any companies yet. Start browsing now.</p>
            <Link to="/student/companies" className="btn btn-primary px-4 py-2">Apply Now</Link>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default Applications;
