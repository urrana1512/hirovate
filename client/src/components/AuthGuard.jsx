import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const AuthGuard = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const location = useLocation();

  if (!token || !user) {
    // Not logged in, redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if route is restricted by role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Role not authorized, redirect to their respective dashboard
    if (user.role === 'admin') {
      toast.error('You do not have permission to access this page.');
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.role === 'company') {
      toast.error('You do not have permission to access this page.');
      return <Navigate to="/recruiter/dashboard" replace />;
    } else if (user.role === 'student') {
      toast.error('You do not have permission to access this page.');
      return <Navigate to="/student/dashboard" replace />;
    } else {
      // Stale or invalid role in localStorage, clear it to break infinite loops
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      toast.error('Invalid session or role. Please login again.');
      return <Navigate to="/login" replace />;
    }
  }

  // Authorized, return components
  return children;
};

export default AuthGuard;
