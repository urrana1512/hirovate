import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FiLock, FiCheckCircle } from 'react-icons/fi';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('email');

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && e.target.previousSibling) {
      e.target.previousSibling.focus();
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      return toast.error('Please enter the 6-digit OTP');
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    if (!email) {
      return toast.error('Invalid session. Please initiate forgot password again.');
    }

    setLoading(true);
    try {
      const res = await axios.post(`http://${window.location.hostname}:5000/api/auth/reset-password`, {
        email,
        otp: otpValue,
        newPassword: formData.newPassword
      });
      
      toast.success(res.data.message || 'Password reset successfully!');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 mt-5 mb-5">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="row justify-content-center">
        <div className="col-md-7 col-lg-5">
          <div className="premium-card p-4 p-md-5">
            <div className="text-center mb-4">
              <img src="/logo.png" alt="JobFest Logo" className="mb-3" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '12px' }} />
              <h3 className="fw-bold text-main mb-2">Create New Password</h3>
              <p className="text-muted">Enter the 6-digit OTP sent to {email || 'your email'} and choose a new password.</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label text-muted small fw-semibold text-center w-100 mb-3">6-Digit OTP</label>
                <div className="d-flex justify-content-center gap-2 mb-2">
                  {otp.map((data, index) => (
                    <input
                      className="form-control text-center fw-bold fs-5 px-0"
                      type="text"
                      maxLength="1"
                      key={index}
                      value={data}
                      onChange={e => handleOtpChange(e.target, index)}
                      onKeyDown={e => handleKeyDown(e, index)}
                      onFocus={e => e.target.select()}
                      style={{ width: '45px', height: '50px' }}
                      required
                    />
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label text-muted small fw-semibold">New Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted border-end-0"><FiLock /></span>
                  <input type="password" name="newPassword" className="form-control border-start-0 ps-0" placeholder="••••••••" onChange={handleChange} required minLength="6" />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label text-muted small fw-semibold">Confirm New Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted border-end-0"><FiLock /></span>
                  <input type="password" name="confirmPassword" className="form-control border-start-0 ps-0" placeholder="••••••••" onChange={handleChange} required minLength="6" />
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-100 py-3 fw-bold mb-3" disabled={loading}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
