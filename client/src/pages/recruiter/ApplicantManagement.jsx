import { useState, useEffect } from 'react';
import PageTransition from '../../components/PageTransition';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FiUsers, FiAward, FiXCircle, FiCheckCircle, FiClock } from 'react-icons/fi';

const ApplicantManagement = () => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);

  const fetchApplicants = async () => {
    try {
      const res = await api.get('/recruiter/applicants');
      setApplicants(res.data.data);
    } catch (error) {
      toast.error('Failed to load candidate applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/recruiter/applicants/${id}/status`, { status });
      toast.success(`Candidate status updated to: ${status}`);
      fetchApplicants();
    } catch (error) {
      toast.error('Failed to update candidate status');
    }
  };

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

  const handlePreviewResume = (resumeDataUrl) => {
    if (!resumeDataUrl) return;
    
    if (resumeDataUrl.startsWith('data:')) {
      try {
        const parts = resumeDataUrl.split(',');
        const mime = parts[0].match(/:(.*?);/)[1];
        const bstr = atob(parts[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while(n--){
          u8arr[n] = bstr.charCodeAt(n);
        }
        const blob = new Blob([u8arr], { type: mime });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      } catch (e) {
        window.open(resumeDataUrl, '_blank');
      }
    } else {
      window.open(resumeDataUrl, '_blank');
    }
  };

  return (
    <PageTransition>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-primary mb-1">Candidate ATS Board</h2>
          <p className="text-muted mb-0">Evaluate student applications, inspect CGPAs, and trigger shortlist or selection boards.</p>
        </div>
      </div>

      <div className="premium-card p-4">
        {applicants.length > 0 ? (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th className="ps-4">Student</th>
                  <th>CGPA Score</th>
                  <th>Course Grade</th>
                  <th>Contact</th>
                  <th>Job Role</th>
                  <th>Status</th>
                  <th className="pe-4 text-end">Evaluate</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map(app => (
                  <tr key={app._id}>
                    <td className="ps-4">
                      <div className="d-flex align-items-center gap-3">
                        {app.studentProfile?.profileImageUrl ? (
                          <img 
                            src={app.studentProfile.profileImageUrl} 
                            alt="Profile" 
                            className="rounded-circle border" 
                            style={{ width: 40, height: 40, objectFit: 'cover' }}
                          />
                        ) : (
                          <div className="rounded-circle bg-primary-light text-primary d-flex align-items-center justify-content-center fw-bold" style={{ width: 40, height: 40 }}>
                            {app.student?.name?.charAt(0) || 'S'}
                          </div>
                        )}
                        <div>
                          <h6 className="fw-bold mb-0 text-dark">{app.student?.name}</h6>
                          <span className="text-muted small d-block">{app.student?.email}</span>
                          <span 
                            className="badge bg-primary-light text-primary cursor-pointer mt-1" 
                            style={{ cursor: 'pointer', fontSize: '0.7rem' }}
                            onClick={() => setSelectedApp(app)}
                          >
                            Inspect Profile
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <strong className="text-dark">{app.studentProfile?.cgpa || 'N/A'}</strong>
                    </td>
                    <td>
                      <span className="badge bg-success-light text-success fw-bold px-2 py-1.5 rounded">
                        {app.studentProfile?.cgpa ? (
                          app.studentProfile.cgpa >= 9.0 ? 'O' :
                          app.studentProfile.cgpa >= 8.0 ? 'A+' :
                          app.studentProfile.cgpa >= 7.0 ? 'A' :
                          app.studentProfile.cgpa >= 6.0 ? 'B+' : 'B'
                        ) : 'A'}
                      </span>
                    </td>
                    <td>
                      <span className="text-muted small">{app.studentProfile?.contactNumber || app.student?.phone || 'N/A'}</span>
                    </td>
                    <td>
                      <span className="badge bg-primary-light text-primary px-3 py-2 rounded-pill fw-semibold">
                        {app.job?.role || app.job?.title || 'Software Developer'}
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-primary-light text-primary px-3 py-2 rounded-pill text-capitalize">{app.status}</span>
                    </td>
                    <td className="pe-4 text-end">
                      <div className="d-flex justify-content-end gap-2 align-items-center">
                        {app.status === 'applied' && (
                          <>
                            <button className="btn btn-sm btn-outline-warning d-flex align-items-center gap-1" disabled style={{ opacity: 0.8 }}>
                              <FiClock /> Pending
                            </button>
                            <button className="btn btn-sm btn-outline-success d-flex align-items-center gap-1" onClick={() => handleUpdateStatus(app._id, 'shortlisted')}>
                              <FiAward /> Shortlist
                            </button>
                            <button className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1" onClick={() => handleUpdateStatus(app._id, 'rejected')}>
                              <FiXCircle /> Reject
                            </button>
                          </>
                        )}
                        {app.status === 'shortlisted' && (
                          <>
                            <button className="btn btn-sm btn-outline-warning d-flex align-items-center gap-1" onClick={() => handleUpdateStatus(app._id, 'applied')}>
                              <FiClock /> Pending
                            </button>
                            <button className="btn btn-sm btn-success d-flex align-items-center gap-1" onClick={() => handleUpdateStatus(app._id, 'selected')}>
                              <FiCheckCircle /> Select
                            </button>
                            <button className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1" onClick={() => handleUpdateStatus(app._id, 'rejected')}>
                              <FiXCircle /> Reject
                            </button>
                          </>
                        )}
                        {app.status === 'selected' && (
                          <>
                            <button className="btn btn-sm btn-success d-flex align-items-center gap-1" disabled style={{ opacity: 0.8 }}>
                              <FiCheckCircle /> Selected
                            </button>
                            <button className="btn btn-sm btn-outline-warning d-flex align-items-center gap-1" onClick={() => handleUpdateStatus(app._id, 'applied')}>
                              <FiClock /> Mark Pending
                            </button>
                          </>
                        )}
                        {app.status === 'rejected' && (
                          <>
                            <button className="btn btn-sm btn-danger d-flex align-items-center gap-1" disabled style={{ opacity: 0.8 }}>
                              <FiXCircle /> Rejected
                            </button>
                            <button className="btn btn-sm btn-outline-warning d-flex align-items-center gap-1" onClick={() => handleUpdateStatus(app._id, 'applied')}>
                              <FiClock /> Mark Pending
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-5">
            <FiUsers className="text-muted display-4 mb-3" />
            <h5 className="fw-bold text-dark">No Active Applications</h5>
            <p className="text-muted small">As soon as students book interview slots for your posted vacancies, they will display here.</p>
          </div>
        )}
      </div>

      {/* Candidate Dossier Inspection Modal */}
      {selectedApp && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '1rem' }}>
              <div className="modal-header bg-primary text-white border-0 py-3" style={{ borderTopLeftRadius: '1rem', borderTopRightRadius: '1rem' }}>
                <h5 className="modal-title fw-bold">🎓 Candidate Placements Dossier</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedApp(null)} aria-label="Close"></button>
              </div>
              <div className="modal-body p-4" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
                <div className="text-center mb-4 bg-light p-3 rounded shadow-sm">
                  <img 
                    src={selectedApp.studentProfile?.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedApp.student?.name || 'User')}&background=2b5c8f&color=fff&size=80`} 
                    alt="Candidate Avatar" 
                    className="rounded-circle mb-2 border border-3 border-white shadow-sm"
                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                  />
                  <h4 className="fw-bold text-dark mb-0">{selectedApp.student?.name}</h4>
                  <p className="text-muted mb-1">{selectedApp.student?.email} • {selectedApp.student?.phone || 'Contact pending'}</p>
                  
                  {/* Hirovate Verified Grades */}
                  <div className="d-flex justify-content-center gap-2 mt-2">
                    <span className="badge bg-success-light text-success fw-bold px-3 py-1.5 rounded-pill">
                      Hirovate Course: {selectedApp.studentProfile?.courseName || 'Full Stack Placement Prep'}
                    </span>
                    <span className="badge bg-warning-light text-warning fw-bold px-3 py-1.5 rounded-pill">
                      Hirovate Grade: {selectedApp.studentProfile?.courseGrade || 'A+ Grade'}
                    </span>
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <h6 className="fw-bold text-primary mb-2">Personal Details</h6>
                    <div className="p-3 border rounded bg-white shadow-sm" style={{ minHeight: '160px' }}>
                      <div className="row g-2">
                        <div className="col-4 small text-muted">Full Name:</div>
                        <div className="col-8 small fw-semibold text-dark">
                          {selectedApp.studentProfile?.salutation || ''} {selectedApp.studentProfile?.firstName || selectedApp.student?.name || ''} {selectedApp.studentProfile?.lastName || ''}
                        </div>
                        <div className="col-4 small text-muted">Contact:</div>
                        <div className="col-8 small fw-semibold text-dark">{selectedApp.studentProfile?.contactNumber || selectedApp.student?.phone || 'N/A'}</div>
                        <div className="col-4 small text-muted">Email:</div>
                        <div className="col-8 small fw-semibold text-dark">{selectedApp.studentProfile?.email || selectedApp.student?.email || 'N/A'}</div>
                        <div className="col-4 small text-muted">DOB:</div>
                        <div className="col-8 small fw-semibold text-dark">{selectedApp.studentProfile?.dob || 'N/A'}</div>
                        <div className="col-4 small text-muted">Gender:</div>
                        <div className="col-8 small fw-semibold text-dark">{selectedApp.studentProfile?.gender || 'N/A'}</div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <h6 className="fw-bold text-primary mb-2">Address Details</h6>
                    <div className="p-3 border rounded bg-white shadow-sm" style={{ minHeight: '160px' }}>
                      <div className="row g-2">
                        <div className="col-4 small text-muted">State/City:</div>
                        <div className="col-8 small fw-semibold text-dark">{selectedApp.studentProfile?.addressDetails?.state || 'N/A'}, {selectedApp.studentProfile?.addressDetails?.city || 'N/A'}</div>
                        <div className="col-4 small text-muted">Area/Pin:</div>
                        <div className="col-8 small fw-semibold text-dark">{selectedApp.studentProfile?.addressDetails?.area || 'N/A'} - {selectedApp.studentProfile?.addressDetails?.pincode || 'N/A'}</div>
                        <div className="col-4 small text-muted">Address:</div>
                        <div className="col-8 small fw-semibold text-dark" style={{ wordBreak: 'break-all' }}>{selectedApp.studentProfile?.addressDetails?.address || 'N/A'}</div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-12 mt-2">
                    <h6 className="fw-bold text-primary mb-2">Applied Vacancy Details</h6>
                    <div className="p-3 border rounded bg-white shadow-sm d-flex justify-content-between align-items-center">
                      <div>
                        <span className="text-muted small d-block">Applied Placements Role</span>
                        <span className="fw-bold text-dark fs-5">{selectedApp.job?.role || selectedApp.job?.title || 'General Vacancy'}</span>
                      </div>
                      <div className="text-end">
                        <span className="text-muted small d-block">Current Drive Status</span>
                        <span className="badge bg-primary-light text-primary px-3 py-1.5 text-capitalize fw-bold fs-6 mt-1">{selectedApp.status}</span>
                      </div>
                    </div>
                  </div>

                  {/* Multiple Qualifications */}
                  <div className="col-12 mt-3">
                    <h6 className="fw-bold text-primary mb-2">Qualifications & Score Sheets</h6>
                    {selectedApp.studentProfile?.educations?.length > 0 ? (
                      <div className="table-responsive border rounded bg-white p-2">
                        <table className="table table-sm table-hover align-middle mb-0">
                          <thead className="bg-light">
                            <tr>
                              <th>Degree</th>
                              <th>School / Board</th>
                              <th>Passing Year</th>
                              <th className="text-end">Result</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedApp.studentProfile.educations.map((edu, idx) => (
                              <tr key={idx}>
                                <td className="fw-semibold text-dark">{edu.degree}</td>
                                <td className="text-muted">{edu.school}</td>
                                <td>{edu.year}</td>
                                <td className="text-end">
                                  <span className="badge bg-primary text-white px-2 py-1">
                                    {edu.scoreType}: {edu.scoreValue}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="p-3 border rounded text-center bg-light">
                        <span className="text-muted small">No secondary qualifications declared. Primary CGPA: {selectedApp.studentProfile?.cgpa || 'N/A'}</span>
                      </div>
                    )}
                  </div>

                  {/* Skills */}
                  <div className="col-12 mt-3">
                    <h6 className="fw-bold text-primary mb-2">Skills & Technologies</h6>
                    <div className="d-flex flex-wrap gap-2 p-3 border rounded bg-white">
                      {selectedApp.studentProfile?.skills?.length > 0 ? (
                        selectedApp.studentProfile.skills.map((s, idx) => (
                          <span key={idx} className="badge bg-primary-light text-primary px-3 py-2 rounded-pill fw-medium">{s}</span>
                        ))
                      ) : (
                        <span className="text-muted small">No technologies mentioned.</span>
                      )}
                    </div>
                  </div>

                  {/* Resume & Links */}
                  <div className="col-12 mt-3">
                    <h6 className="fw-bold text-primary mb-2">Resume & Placement links</h6>
                    <div className="p-3 border rounded bg-white d-flex flex-column gap-2">
                      {selectedApp.studentProfile?.resumeUrl ? (
                        <div className="d-flex align-items-center justify-content-between p-2 border rounded bg-light">
                          <span className="small fw-semibold text-dark">Active Placement Resume (Word/PDF):</span>
                          <button type="button" onClick={() => handlePreviewResume(selectedApp.studentProfile.resumeUrl)} className="btn btn-sm btn-primary">
                            Download / View Resume
                          </button>
                        </div>
                      ) : (
                        <span className="text-muted small">Resume link not provided.</span>
                      )}

                      {/* Socials */}
                      <div className="d-flex gap-2 mt-2">
                        {selectedApp.studentProfile?.socialLinks?.linkedin && (
                          <a href={selectedApp.studentProfile.socialLinks.linkedin} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary flex-fill">LinkedIn Profile</a>
                        )}
                        {selectedApp.studentProfile?.socialLinks?.github && (
                          <a href={selectedApp.studentProfile.socialLinks.github} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-dark flex-fill">GitHub Portfolio</a>
                        )}
                        {selectedApp.studentProfile?.socialLinks?.portfolio && (
                          <a href={selectedApp.studentProfile.socialLinks.portfolio} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-secondary flex-fill">Personal Website</a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer bg-light border-0 py-3" style={{ borderBottomLeftRadius: '1rem', borderBottomRightRadius: '1rem' }}>
                <button type="button" className="btn btn-secondary px-4 fw-bold" onClick={() => setSelectedApp(null)}>Close inspection</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageTransition>
  );
};

export default ApplicantManagement;
