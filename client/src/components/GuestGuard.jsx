import { Navigate } from 'react-router-dom';

const GuestGuard = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (token && user) {
    // User is already logged in, redirect them to their respective dashboard
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.role === 'company') {
      return <Navigate to="/recruiter/dashboard" replace />;
    } else if (user.role === 'student') {
      return <Navigate to="/student/dashboard" replace />;
    } else {
      // Invalid user role or data in localStorage, clear it
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  return children;
};

export default GuestGuard;
