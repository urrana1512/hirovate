import { useState, useEffect } from 'react';
import PageTransition from '../../components/PageTransition';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FiBriefcase, FiGlobe, FiMapPin } from 'react-icons/fi';

const CompanyManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await api.get('/admin/companies');
        setCompanies(res.data.data);
      } catch (error) {
        toast.error('Failed to load companies');
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  if (loading) {
    return (
      <PageTransition>
        <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-primary mb-1">Company Listings</h2>
          <p className="text-muted mb-0">Review active corporate accounts, inspect industrial fields, and check website handles.</p>
        </div>
      </div>

      <div className="row g-4">
        {companies.length > 0 ? (
          companies.map(c => (
            <div className="col-md-6 col-lg-4" key={c._id}>
              <div className="premium-card p-4 h-100 d-flex flex-column hover-lift">
                <div className="d-flex align-items-center gap-3 mb-3">
                  {c.logoUrl ? (
                    <img 
                      src={c.logoUrl} 
                      alt="Logo" 
                      className="rounded-circle border shadow-sm" 
                      style={{ width: 44, height: 44, objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="rounded-circle bg-primary-light text-primary d-flex align-items-center justify-content-center fw-bold" style={{ width: 44, height: 44 }}>
                      {c.companyName?.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h6 className="fw-bold mb-1 text-dark">{c.companyName}</h6>
                    <span className="badge bg-primary-light text-primary text-capitalize">{c.industry}</span>
                  </div>
                </div>

                <p className="text-muted small mb-4">{c.description || 'About the company...'}</p>

                <div className="d-flex flex-column gap-2 mb-4 mt-auto small text-muted">
                  <div><FiGlobe className="me-2 text-primary" /> <a href={c.website} target="_blank" rel="noreferrer" className="text-decoration-none">{c.website}</a></div>
                  <div><FiMapPin className="me-2 text-primary" /> {c.location}</div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <div className="premium-card p-5 text-center">
              <FiBriefcase className="text-muted display-4 mb-3" />
              <h5 className="fw-bold text-dark">No Active Companies</h5>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default CompanyManagement;
