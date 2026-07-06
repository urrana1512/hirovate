import { useState, useEffect } from 'react';
import PageTransition from '../../components/PageTransition';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FiUsers, FiAward, FiCalendar } from 'react-icons/fi';

const ApplicationsManagement = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get('/admin/applications');
        setApplications(res.data.data);
      } catch (error) {
        toast.error('Failed to load student applications');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
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
          <h2 className="fw-bold text-primary mb-1">Central ATS Dashboard</h2>
          <p className="text-muted mb-0">Monitor placement flows, review application statuses, and track active bookings.</p>
        </div>
      </div>

      <div className="premium-card p-4">
        {applications.length > 0 ? (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th className="ps-4">Student</th>
                  <th>Company Hub</th>
                  <th>Drive Slot</th>
                  <th>Status</th>
                  <th className="pe-4 text-end">Stage</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(app => (
                  <tr key={app._id}>
                    <td className="ps-4">
                      <div className="d-flex align-items-center gap-3">
                        {app.studentProfile?.profileImageUrl ? (
                          <img 
                            src={app.studentProfile.profileImageUrl} 
                            alt="Profile" 
                            className="rounded-circle border" 
                            style={{ width: 40, height: 40, objectFit: 'cover' }}
                          />
                        ) : (
                          <div className="rounded-circle bg-primary-light text-primary d-flex align-items-center justify-content-center fw-bold" style={{ width: 40, height: 40 }}>
                            {app.student?.name?.charAt(0)}
                          </div>
                        )}
                        <div>
                          <h6 className="fw-bold mb-0 text-dark">{app.student?.name}</h6>
                          <span className="text-muted small">{app.student?.email}</span>
                        </div>
                      </div>
                    </td>
                    <td><strong>{app.company?.companyName || 'Jane Doe Tech'}</strong></td>
                    <td>
                      <span className="fw-medium text-primary">
                        <FiCalendar className="me-1"/> 
                        {app.slot ? `${app.slot.startTime} — ${app.slot.endTime}` : 'Direct Apply'}
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-primary-light text-primary px-3 py-2 rounded-pill text-capitalize">{app.status}</span>
                    </td>
                    <td className="pe-4 text-end">
                      <span className="text-muted small text-capitalize">{app.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-5">
            <FiUsers className="text-muted display-4 mb-3" />
            <h5 className="fw-bold text-dark">No Active Applications</h5>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default ApplicationsManagement;
