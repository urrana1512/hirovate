import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FiCheckCircle } from 'react-icons/fi';

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get('userId');

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Focus previous input on backspace
    if (e.key === 'Backspace' && !otp[index] && e.target.previousSibling) {
      e.target.previousSibling.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      return toast.error('Please enter a valid 6-digit OTP');
    }

    if (!userId) {
      return toast.error('Invalid verification session. Please register again.');
    }

    setLoading(true);
    try {
      const res = await axios.post(`http://${window.location.hostname}:5000/api/auth/verify-otp`, {
        userId,
        otp: otpValue
      });
      
      toast.success(res.data.message || 'OTP Verified successfully!');
      // After verification, they are pending approval, so redirect to login where they will see the status message if they try to login immediately.
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 mt-5 mb-5">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="premium-card p-4 p-md-5 text-center">
            <img src="/logo-light.png" alt="Hirovate Logo" className="logo-light-only mb-4" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '12px' }} />
            <img src="/logo-dark.png" alt="Hirovate Logo" className="logo-dark-only mb-4" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '12px' }} />
            <h3 className="fw-bold text-main mb-2">Verify Your Account</h3>
            <p className="text-muted mb-4">We've sent a 6-digit verification code to your email and phone number.</p>

            <form onSubmit={handleSubmit}>
              <div className="d-flex justify-content-center gap-2 mb-4">
                {otp.map((data, index) => {
                  return (
                    <input
                      className="form-control text-center fw-bold fs-4"
                      type="text"
                      name="otp"
                      maxLength="1"
                      key={index}
                      value={data}
                      onChange={e => handleChange(e.target, index)}
                      onKeyDown={e => handleKeyDown(e, index)}
                      onFocus={e => e.target.select()}
                      style={{ width: '50px', height: '60px', padding: 0 }}
                      required
                    />
                  );
                })}
              </div>

              <button type="submit" className="btn btn-primary w-100 py-3 fw-bold mb-3" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify Account'}
              </button>
            </form>

            <p className="text-muted small mb-0">
              Didn't receive the code? <button className="btn btn-link p-0 text-primary fw-semibold text-decoration-none">Resend OTP</button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyOTP;
