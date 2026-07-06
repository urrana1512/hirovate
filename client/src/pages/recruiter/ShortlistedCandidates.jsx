import { useState, useEffect } from 'react';
import PageTransition from '../../components/PageTransition';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FiCheckCircle, FiAward } from 'react-icons/fi';

const ShortlistedCandidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await api.get('/recruiter/applicants');
        const filtered = (res.data.data || []).filter(app => ['shortlisted', 'selected'].includes(app.status));
        setCandidates(filtered);
      } catch (error) {
        toast.error('Failed to load shortlisted pool');
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  return (
    <PageTransition>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-primary mb-1">Shortlisted & Selected Talents</h2>
          <p className="text-muted mb-0">Review your high-potential applicants and final placement offers.</p>
        </div>
      </div>

      <div className="premium-card p-4">
        {candidates.length > 0 ? (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th className="ps-4">Candidate</th>
                  <th>CGPA Score</th>
                  <th>University</th>
                  <th>Current Stage</th>
                  <th className="pe-4 text-end">Offer Status</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map(cand => (
                  <tr key={cand._id}>
                    <td className="ps-4">
                      <div className="d-flex align-items-center gap-3">
                        <div className="rounded-circle bg-success-light text-success d-flex align-items-center justify-content-center fw-bold" style={{ width: 42, height: 42 }}>
                          {cand.student?.name?.charAt(0)}
                        </div>
                        <div>
                          <h6 className="fw-bold mb-0 text-dark">{cand.student?.name}</h6>
                          <span className="text-muted small">{cand.student?.email}</span>
                        </div>
                      </div>
                    </td>
                    <td><strong className="text-dark">{cand.studentProfile?.cgpa || 'N/A'}</strong></td>
                    <td><span className="text-muted small">{cand.studentProfile?.university || 'N/A'}</span></td>
                    <td>
                      <span className="badge bg-primary-light text-primary px-3 py-2 rounded-pill text-capitalize">{cand.status}</span>
                    </td>
                    <td className="pe-4 text-end">
                      {cand.status === 'selected' ? (
                        <span className="text-success fw-bold d-flex align-items-center justify-content-end gap-1"><FiCheckCircle /> Offer Letter Issued</span>
                      ) : (
                        <span className="text-muted small">Shortlisted</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-5">
            <FiAward className="text-muted display-4 mb-3" />
            <h5 className="fw-bold text-dark">No Selected Candidates Found</h5>
            <p className="text-muted small">When you update student evaluation statuses to Shortlisted or Selected in the applicants tab, they will populate here.</p>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default ShortlistedCandidates;
