import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FiMail, FiArrowLeft } from 'react-icons/fi';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await axios.post(`http://${window.location.hostname}:5000/api/auth/forgot-password`, { email });
      toast.success(res.data.message || 'OTP sent to your email');
      navigate(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 mt-5 mb-5">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="row justify-content-center">
        <div className="col-md-7 col-lg-5">
          <div className="premium-card p-4 p-md-5">
            <Link to="/login" className="text-muted text-decoration-none d-inline-flex align-items-center mb-4 hover-primary">
              <FiArrowLeft className="me-2" /> Back to Login
            </Link>
            
            <div className="text-center mb-4">
              <img src="/logo-light.png" alt="Hirovate Logo" className="logo-light-only mb-3" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '12px' }} />
              <img src="/logo-dark.png" alt="Hirovate Logo" className="logo-dark-only mb-3" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '12px' }} />
              <h2 className="fw-bold text-main mb-2">Forgot Password?</h2>
              <p className="text-muted">Enter the email address associated with your account and we'll send you an OTP to reset your password.</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label text-muted small fw-semibold">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted border-end-0"><FiMail /></span>
                  <input 
                    type="email" 
                    className="form-control border-start-0 ps-0" 
                    placeholder="name@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-100 py-3 fw-bold mb-3" disabled={loading}>
                {loading ? 'Sending OTP...' : 'Send Reset OTP'}
              </button>
            </form>
          </div>
        </div>
      </motion.div>
      <style>{`.hover-primary:hover { color: var(--primary-color) !important; }`}</style>
    </div>
  );
};

export default ForgotPassword;
