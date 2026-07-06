import { useState, useEffect } from 'react';
import PageTransition from '../../components/PageTransition';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FiBriefcase, FiMapPin, FiCalendar } from 'react-icons/fi';

const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get('/admin/jobs');
        setJobs(res.data.data);
      } catch (error) {
        toast.error('Failed to load posted jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
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
          <h2 className="fw-bold text-primary mb-1">Vacancy Control Room</h2>
          <p className="text-muted mb-0">Inspect active requirements, eligibility criteria, and salary packages posted by companies.</p>
        </div>
      </div>

      <div className="row g-4">
        {jobs.length > 0 ? (
          jobs.map(job => (
            <div className="col-lg-6" key={job._id}>
              <div className="premium-card p-4 h-100 d-flex flex-column hover-lift">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h5 className="fw-bold text-dark mb-1">{job.title}</h5>
                    <span className="badge bg-primary-light text-primary">{job.company?.companyName || 'Jane Doe Tech'}</span>
                  </div>
                  <span className="badge bg-success-light text-success px-3 py-2 rounded-pill text-capitalize">{job.status}</span>
                </div>

                <div className="d-flex flex-column gap-2 mb-4 small text-muted">
                  <div><FiBriefcase className="text-primary me-2"/> Package: <strong>{job.salaryPackage}</strong></div>
                  <div><FiMapPin className="text-primary me-2"/> Location: {job.location} ({job.workMode})</div>
                  <div><FiCalendar className="text-primary me-2"/> Deadline: {new Date(job.deadline).toLocaleDateString()}</div>
                </div>

                <div className="mt-auto d-flex justify-content-between align-items-center pt-2 border-top">
                  <span className="badge bg-primary-light text-primary">{job.openings} Positions</span>
                  <span className="small text-muted">{job.eligibilityCriteria}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <div className="premium-card p-5 text-center">
              <FiBriefcase className="text-muted display-4 mb-3" />
              <h5 className="fw-bold text-dark">No Vacancies Posted</h5>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default JobManagement;
