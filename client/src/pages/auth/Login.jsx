import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await axios.post(`http://${window.location.hostname}:5000/api/auth/login`, formData);
      
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      toast.success('Logged in successfully!');
      
      // Redirect based on role
      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'company') navigate('/recruiter/dashboard');
      else navigate('/student/dashboard');
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 mt-5 mb-5">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="row justify-content-center">
        <div className="col-md-7 col-lg-5">
          <div className="premium-card p-4 p-md-5">
            <div className="text-center mb-4">
              <img src="/logo.png" alt="JobFest Logo" className="mb-3" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '12px' }} />
              <h2 className="fw-bold text-main mb-1">Welcome Back</h2>
              <p className="text-muted">Enter your credentials to access your account.</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label text-muted small fw-semibold">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted border-end-0"><FiMail /></span>
                  <input type="email" name="email" className="form-control border-start-0 ps-0" placeholder="name@example.com" onChange={handleChange} required />
                </div>
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label text-muted small fw-semibold mb-0">Password</label>
                  <Link to="/forgot-password" className="small text-primary text-decoration-none fw-medium">Forgot Password?</Link>
                </div>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted border-end-0"><FiLock /></span>
                  <input type="password" name="password" className="form-control border-start-0 ps-0" placeholder="••••••••" onChange={handleChange} required />
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-100 py-3 fw-bold mb-4" disabled={loading}>
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>

            <div className="text-center text-muted small">
              Don't have an account? <Link to="/register" className="text-primary fw-semibold text-decoration-none">Sign up here</Link>
            </div>
            
            <div className="mt-4 pt-4 border-top text-center">
               <p className="text-muted small mb-0">For demo purposes, the admin login is: <br/><strong>jobfestadmin@gmail.com / jobfest@123</strong></p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
