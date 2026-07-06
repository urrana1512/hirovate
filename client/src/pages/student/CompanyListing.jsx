import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../../components/PageTransition';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FiSearch, FiFilter, FiMapPin, FiBriefcase } from 'react-icons/fi';

const CompanyListing = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await api.get('/companies');
        setCompanies(res.data.data || []);
      } catch (error) {
        toast.error('Failed to load companies');
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          company.industry?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterMode === 'tech' && !company.industry?.toLowerCase().includes('tech')) return false;
    
    return matchesSearch;
  });

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
          <h2 className="fw-bold text-primary mb-1">Discover Companies</h2>
          <p className="text-muted mb-0">Find and apply to top companies hiring on Hirovate.</p>
        </div>
      </div>

      <div className="premium-card p-3 mb-4 d-flex gap-3 flex-wrap">
        <div className="flex-grow-1 position-relative">
          <FiSearch className="position-absolute top-50 translate-middle-y text-muted" style={{ left: '15px' }} />
          <input 
            type="text" 
            className="form-control bg-light border-0" 
            placeholder="Search by company name or industry..." 
            style={{ paddingLeft: '40px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className={`btn ${filterMode === '' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setFilterMode('')}>All</button>
        <button className={`btn ${filterMode === 'tech' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setFilterMode('tech')}>Tech</button>
        <button className="btn btn-outline-secondary"><FiFilter className="me-2"/> More Filters</button>
      </div>

      <div className="row g-4">
        {filteredCompanies.length > 0 ? (
          filteredCompanies.map(company => (
            <div className="col-md-6 col-lg-4" key={company._id}>
              <div 
                className="premium-card h-100 p-4 hover-lift"
                style={company.status === 'hiring_closed' ? { filter: 'grayscale(70%)', opacity: 0.65, border: '2px dashed var(--danger-color)' } : {}}
              >
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <img 
                    src={company.logoUrl || company.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(company.companyName)}&background=random`} 
                    alt={company.companyName}
                    className="rounded-3 shadow-sm"
                    style={{ width: 64, height: 64, objectFit: 'cover' }}
                  />
                  {company.status === 'hiring_closed' ? (
                    <span className="badge bg-danger-light text-danger rounded-pill px-3 py-2">Drive Ended</span>
                  ) : (
                    <span className="badge bg-success-light text-success rounded-pill px-3 py-2">Actively Hiring</span>
                  )}
                </div>
                
                <h5 className="fw-bold mb-1">{company.companyName}</h5>
                <p className="text-muted small mb-3">{company.industry || 'Various Industries'}</p>
                
                <div className="d-flex flex-column gap-2 mb-4">
                  <div className="d-flex align-items-center text-muted small">
                    <FiMapPin className="me-2 text-primary" /> {company.location || 'Multiple Locations'}
                  </div>
                  <div className="d-flex align-items-center text-muted small">
                    <FiBriefcase className="me-2 text-primary" /> {company.description ? 'Multiple Roles' : 'Software Engineer, Analyst'}
                  </div>
                </div>
                
                <div className="mt-auto">
                  <button 
                    className={`btn w-100 py-2 fw-medium ${company.status === 'hiring_closed' ? 'btn-secondary' : 'btn-primary'}`} 
                    onClick={() => navigate(`/student/companies/${company._id}`)}
                  >
                    {company.status === 'hiring_closed' ? 'Drive Concluded' : 'View Details & Apply'}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <h5 className="text-muted">No companies found matching your criteria.</h5>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default CompanyListing;
