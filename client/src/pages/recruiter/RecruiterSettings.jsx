import { useState } from 'react';
import PageTransition from '../../components/PageTransition';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FiLock, FiBell, FiTrash2 } from 'react-icons/fi';

const RecruiterSettings = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error('Passwords do not match!');
    }
    setLoading(true);
    try {
      await api.put('/student/change-password', { currentPassword, newPassword });
      toast.success('Recruiter password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-primary mb-1">Company settings & Preferences</h2>
          <p className="text-muted mb-0">Update account credentials, configure notification channels, and handle privacy parameters.</p>
        </div>
      </div>

      <div className="row g-4">
        {/* Security Password Form */}
        <div className="col-lg-6">
          <div className="premium-card p-4 bg-white">
            <h5 className="fw-bold mb-4 text-dark"><FiLock className="me-2 text-primary" /> Update Password</h5>
            <form onSubmit={handlePasswordChange}>
              <div className="mb-3">
                <label className="form-label small">Current Password</label>
                <input 
                  type="password" 
                  className="form-control" 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label small">New Password</label>
                <input 
                  type="password" 
                  className="form-control" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="form-label small">Confirm New Password</label>
                <input 
                  type="password" 
                  className="form-control" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100 py-3 fw-bold" disabled={loading}>
                {loading ? 'Saving...' : 'Save Password'}
              </button>
            </form>
          </div>
        </div>

        {/* System Preferences */}
        <div className="col-lg-6">
          <div className="premium-card p-4 bg-white h-100 d-flex flex-column">
            <h5 className="fw-bold mb-4 text-dark"><FiBell className="me-2 text-primary"/> Alert Configurations</h5>
            
            <div className="d-flex flex-column gap-3 mt-2">
              <div className="form-check form-switch p-3 border rounded-3 bg-light d-flex justify-content-between align-items-center">
                <div className="ps-2">
                  <h6 className="fw-bold mb-1 small">Email Shortlists</h6>
                  <p className="text-muted small mb-0">Get email copies of candidates matching your filter requirements.</p>
                </div>
                <input className="form-check-input" type="checkbox" defaultChecked />
              </div>

              <div className="form-check form-switch p-3 border rounded-3 bg-light d-flex justify-content-between align-items-center">
                <div className="ps-2">
                  <h6 className="fw-bold mb-1 small">Slot Overbook Blocks</h6>
                  <p className="text-muted small mb-0">Halt booking intakes if capacity limits are breached.</p>
                </div>
                <input className="form-check-input" type="checkbox" defaultChecked />
              </div>
            </div>

            <hr className="my-4" />

            <div className="mt-auto">
              <button className="btn btn-outline-danger w-100 py-3 d-flex align-items-center justify-content-center gap-2" onClick={() => toast.info('Deletion request queued to admin boards!')}>
                <FiTrash2 /> Request Account Deactivation
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default RecruiterSettings;
