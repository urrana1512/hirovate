import { Outlet } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import Footer from '../components/Footer';
import { useEffect } from 'react';

const PublicLayout = () => {
  // Ensure we always scroll to top on route change within public layout
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      <PublicNavbar />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
