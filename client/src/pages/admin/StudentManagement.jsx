import { useState, useEffect } from 'react';
import PageTransition from '../../components/PageTransition';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FiUsers, FiCheckCircle, FiSlash, FiAward } from 'react-icons/fi';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [courseName, setCourseName] = useState('');
  const [courseGrade, setCourseGrade] = useState('A+');
  const [showModal, setShowModal] = useState(false);

  const fetchStudents = async () => {
    try {
      const res = await api.get('/admin/students');
      setStudents(res.data.data);
    } catch (error) {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/admin/users/${id}/status`, { status });
      toast.success(`Student status updated to: ${status}`);
      fetchStudents();
    } catch (error) {
      toast.error('Failed to update student status');
    }
  };

  const handleSaveCredentials = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/students/${selectedStudent._id}/profile`, {
        courseName,
        courseGrade
      });
      toast.success('TOPS Placement credentials assigned successfully!');
      setShowModal(false);
      fetchStudents();
    } catch (error) {
      toast.error('Failed to update placement credentials');
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

  return (
    <PageTransition>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-primary mb-1">Student Management Board</h2>
          <p className="text-muted mb-0">Review student CGPAs, university enrollments, and toggle account verifications.</p>
        </div>
      </div>

      <div className="premium-card p-4">
        {students.length > 0 ? (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th className="ps-4">Student</th>
                  <th>CGPA</th>
                  <th>Contact</th>
                  <th>TOPS Course</th>
                  <th>TOPS Grade</th>
                  <th>Status</th>
                  <th className="pe-4 text-end">Moderate</th>
                </tr>
              </thead>
              <tbody>
                {students.map(st => (
                  <tr key={st._id}>
                    <td className="ps-4">
                      <div className="d-flex align-items-center gap-3">
                        {st.profile?.profileImageUrl ? (
                          <img 
                            src={st.profile.profileImageUrl} 
                            alt="Profile" 
                            className="rounded-circle border" 
                            style={{ width: 40, height: 40, objectFit: 'cover' }}
                          />
                        ) : (
                          <div className="rounded-circle bg-primary-light text-primary d-flex align-items-center justify-content-center fw-bold" style={{ width: 40, height: 40 }}>
                            {st.name?.charAt(0)}
                          </div>
                        )}
                        <div>
                          <h6 className="fw-bold mb-0 text-dark">{st.name}</h6>
                          <span className="text-muted small">{st.email}</span>
                        </div>
                      </div>
                    </td>
                    <td><strong>{st.profile?.cgpa || 'N/A'}</strong></td>
                    <td><span className="text-muted small">{st.profile?.contactNumber || st.phone || 'N/A'}</span></td>
                    <td><span className="fw-semibold text-primary">{st.profile?.courseName || 'Python Full Stack'}</span></td>
                    <td>
                      <span className="badge bg-success-light text-success fw-bold">
                        {st.profile?.courseGrade || 'A+'}
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-primary-light text-primary px-3 py-2 rounded-pill text-capitalize">{st.status}</span>
                    </td>
                    <td className="pe-4 text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <button 
                          className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                          onClick={() => {
                            setSelectedStudent(st);
                            setCourseName(st.profile?.courseName || '');
                            setCourseGrade(st.profile?.courseGrade || 'A+');
                            setShowModal(true);
                          }}
                        >
                          <FiAward /> Assign TOPS
                        </button>
                        {st.status !== 'approved' && (
                          <button className="btn btn-sm btn-outline-success d-flex align-items-center gap-1" onClick={() => handleUpdateStatus(st._id, 'approved')}>
                            <FiCheckCircle /> Verify
                          </button>
                        )}
                        {st.status !== 'blocked' ? (
                          <button className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1" onClick={() => handleUpdateStatus(st._id, 'blocked')}>
                            <FiSlash /> Block
                          </button>
                        ) : (
                          <button className="btn btn-sm btn-outline-success d-flex align-items-center gap-1" onClick={() => handleUpdateStatus(st._id, 'approved')}>
                            Unblock
                          </button>
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
            <h5 className="fw-bold text-dark">No Registered Students</h5>
          </div>
        )}
      </div>

      {/* Admin Assign Credentials Modal */}
      {showModal && selectedStudent && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '1rem' }}>
              <div className="modal-header bg-primary text-white border-0 py-3" style={{ borderTopLeftRadius: '1rem', borderTopRightRadius: '1rem' }}>
                <h5 className="modal-title fw-bold">🎓 Assign TOPS Placements Credentials</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)} aria-label="Close"></button>
              </div>
              <form onSubmit={handleSaveCredentials}>
                <div className="modal-body p-4">
                  <p className="text-muted small">Update verified placement program course name and performance grades for <strong>{selectedStudent.name}</strong>.</p>
                  
                  <div className="mb-3">
                    <label className="form-label fw-semibold">TOPS Course Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={courseName} 
                      onChange={(e) => setCourseName(e.target.value)} 
                      placeholder="e.g. Python Full Stack Development" 
                      required 
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">TOPS Placement Grade</label>
                    <select 
                      className="form-select" 
                      value={courseGrade} 
                      onChange={(e) => setCourseGrade(e.target.value)}
                    >
                      <option value="O">O (Outstanding)</option>
                      <option value="A+">A+ (Excellent)</option>
                      <option value="A">A (Very Good)</option>
                      <option value="B+">B+ (Good)</option>
                      <option value="B">B (Pass)</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer bg-light border-0 py-3" style={{ borderBottomLeftRadius: '1rem', borderBottomRightRadius: '1rem' }}>
                  <button type="button" className="btn btn-secondary px-4 fw-bold" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary px-4 fw-bold">Save Credentials</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </PageTransition>
  );
};

export default StudentManagement;
