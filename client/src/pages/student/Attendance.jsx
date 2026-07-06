import { useState, useEffect } from 'react';
import PageTransition from '../../components/PageTransition';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FiCheckSquare, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';

const Attendance = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/student/profile');
        setProfile(res.data.data);
      } catch (error) {
        toast.error('Failed to load attendance records');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const attendanceRecords = profile?.attendanceRecords || [];
  const presentCount = attendanceRecords.filter(r => r.status === 'Present').length;
  const totalCount = attendanceRecords.length;
  const percentage = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 100;

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
          <h2 className="fw-bold text-primary mb-1">My Attendance Tracker</h2>
          <p className="text-muted mb-0">Scan your profile QR code at interview venues to log live attendance status.</p>
        </div>
      </div>

      <div className="row g-4">
        {/* Attendance stats */}
        <div className="col-lg-4">
          <div className="premium-card p-4 text-center">
            <h5 className="fw-bold mb-4"><FiCheckSquare className="me-2 text-primary" /> Overall Attendance</h5>
            <div className="position-relative d-inline-block mb-3">
              {/* Simple HSL dynamic ring */}
              <div 
                className="rounded-circle d-flex align-items-center justify-content-center border border-4 border-success" 
                style={{ width: 140, height: 140, fontSize: '32px', fontWeight: 'bold', color: 'var(--success-color)' }}
              >
                {percentage}%
              </div>
            </div>
            <p className="text-muted small">You attended {presentCount} out of {totalCount} drives.</p>
          </div>
        </div>

        {/* QR Scanner check-in display */}
        <div className="col-lg-4">
          <div className="premium-card p-4 text-center d-flex flex-column align-items-center justify-content-center">
            <h5 className="fw-bold mb-3">My Attendance QR</h5>
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Student:${profile?._id}`} 
              alt="Profile QR"
              className="img-fluid border p-2 bg-light rounded mb-3"
              style={{ maxWidth: '140px' }}
            />
            <p className="text-muted small mb-0">Present this QR to slot coordinators during check-in.</p>
          </div>
        </div>

        {/* Attendance History */}
        <div className="col-lg-4">
          <div className="premium-card p-4 h-100">
            <h5 className="fw-bold mb-4">Verification Logs</h5>
            <div className="d-flex flex-column gap-3">
              {attendanceRecords.length > 0 ? (
                attendanceRecords.map((record, i) => (
                  <div key={i} className="p-3 border rounded-3 bg-light d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="fw-bold mb-1">Placement Event Check-in</h6>
                      <p className="text-muted mb-0 small">{record.date ? new Date(record.date).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    {record.status === 'Present' ? (
                      <span className="badge bg-success-light text-success px-3 py-2 rounded-pill"><FiCheckCircle className="me-1"/> Verified</span>
                    ) : (
                      <span className="badge bg-danger-light text-danger px-3 py-2 rounded-pill"><FiAlertTriangle className="me-1"/> Absent</span>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-4 text-center border rounded-3 bg-light">
                  <p className="text-muted mb-0 small">No attendance records found yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Attendance;
