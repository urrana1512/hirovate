import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FiUser, FiBriefcase, FiMail, FiLock, FiPhone } from 'react-icons/fi';

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract role from query params if passed (e.g. ?role=company)
  const queryParams = new URLSearchParams(location.search);
  const initialRole = queryParams.get('role') === 'company' ? 'company' : 'student';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: initialRole
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setLoading(true);
    try {
      const res = await axios.post(`http://${window.location.hostname}:5000/api/auth/register`, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role
      });
      
      toast.success(res.data.message || 'Registration initiated!');
      // Navigate to OTP verification page, passing the userId
      navigate(`/verify-otp?userId=${res.data.userId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 mt-5 mb-5">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="premium-card p-4 p-md-5">
            <div className="text-center mb-4">
              <img src="/logo-light.png" alt="Hirovate Logo" className="logo-light-only mb-3" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '12px' }} />
              <img src="/logo-dark.png" alt="Hirovate Logo" className="logo-dark-only mb-3" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '12px' }} />
              <h2 className="fw-bold text-main">Create Account</h2>
              <p className="text-muted">Join Hirovate and take the next step in your career.</p>
            </div>

            {/* Role Selection */}
            <div className="d-flex gap-3 mb-4">
              <button 
                type="button" 
                className={`btn flex-grow-1 py-3 ${formData.role === 'student' ? 'btn-primary shadow-sm' : 'btn-light text-muted'}`}
                onClick={() => setFormData({ ...formData, role: 'student' })}
              >
                <FiUser className="me-2" size={20}/> Student
              </button>
              <button 
                type="button" 
                className={`btn flex-grow-1 py-3 ${formData.role === 'company' ? 'btn-primary shadow-sm' : 'btn-light text-muted'}`}
                onClick={() => setFormData({ ...formData, role: 'company' })}
              >
                <FiBriefcase className="me-2" size={20}/> Recruiter
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label text-muted small fw-semibold">{formData.role === 'company' ? 'Company Name' : 'Full Name'}</label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted border-end-0"><FiUser /></span>
                  <input type="text" name="name" className="form-control border-start-0 ps-0" placeholder={formData.role === 'company' ? 'TechCorp Inc.' : 'John Doe'} onChange={handleChange} required />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label text-muted small fw-semibold">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted border-end-0"><FiMail /></span>
                  <input type="email" name="email" className="form-control border-start-0 ps-0" placeholder="name@example.com" onChange={handleChange} required />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label text-muted small fw-semibold">Phone Number</label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted border-end-0"><FiPhone /></span>
                  <input type="tel" name="phone" className="form-control border-start-0 ps-0" placeholder="+1 234 567 8900" onChange={handleChange} required />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label text-muted small fw-semibold">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted border-end-0"><FiLock /></span>
                  <input type="password" name="password" className="form-control border-start-0 ps-0" placeholder="••••••••" onChange={handleChange} required minLength="6" />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label text-muted small fw-semibold">Confirm Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted border-end-0"><FiLock /></span>
                  <input type="password" name="confirmPassword" className="form-control border-start-0 ps-0" placeholder="••••••••" onChange={handleChange} required minLength="6" />
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-100 py-3 fw-bold mb-3" disabled={loading}>
                {loading ? 'Processing...' : 'Create Account'}
              </button>
            </form>

            <div className="text-center text-muted small">
              Already have an account? <Link to="/login" className="text-primary fw-semibold text-decoration-none">Login here</Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
