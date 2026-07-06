import { useState } from 'react';
import PageTransition from '../../components/PageTransition';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FiSettings, FiLock, FiBell } from 'react-icons/fi';

const Settings = () => {
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
      toast.success('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-primary mb-1">Account & Privacy Settings</h2>
          <p className="text-muted mb-0">Manage security credentials, change your password, and toggle notification alerts.</p>
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
                {loading ? 'Updating Credentials...' : 'Save Password'}
              </button>
            </form>
          </div>
        </div>

        {/* Notifications & System Preferences */}
        <div className="col-lg-6">
          <div className="premium-card p-4 bg-white h-100">
            <h5 className="fw-bold mb-4 text-dark"><FiBell className="me-2 text-primary"/> System Preferences</h5>
            
            <div className="d-flex flex-column gap-3 mt-2">
              <div className="form-check form-switch p-3 border rounded-3 bg-light d-flex justify-content-between align-items-center">
                <div className="ps-2">
                  <h6 className="fw-bold mb-1 small">Email Notifications</h6>
                  <p className="text-muted small mb-0">Receive drive reminder letters over official mail.</p>
                </div>
                <input className="form-check-input" type="checkbox" defaultChecked />
              </div>

              <div className="form-check form-switch p-3 border rounded-3 bg-light d-flex justify-content-between align-items-center">
                <div className="ps-2">
                  <h6 className="fw-bold mb-1 small">SMS Interview Alerts</h6>
                  <p className="text-muted small mb-0">Get slot verification and OTP details over phone SMS.</p>
                </div>
                <input className="form-check-input" type="checkbox" defaultChecked />
              </div>

              <div className="form-check form-switch p-3 border rounded-3 bg-light d-flex justify-content-between align-items-center">
                <div className="ps-2">
                  <h6 className="fw-bold mb-1 small">WhatsApp Placement Channel</h6>
                  <p className="text-muted small mb-0">Opt-in to real-time company shortlist feeds on WhatsApp.</p>
                </div>
                <input className="form-check-input" type="checkbox" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Settings;
