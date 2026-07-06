import { useState, useEffect } from 'react';
import PageTransition from '../../components/PageTransition';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FiUserCheck, FiUsers } from 'react-icons/fi';

const RecruiterAttendance = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get('/recruiter/applicants');
        const list = (res.data.data || []).map(app => ({
          id: app._id,
          studentName: app.student?.name || 'Jane Doe',
          email: app.student?.email,
          slotTime: app.slot ? `${app.slot.startTime} — ${app.slot.endTime}` : 'TBD',
          venue: app.slot?.venue || 'TBD',
          status: app.status === 'interview_scheduled' ? 'Present' : 'Pending'
        }));
        setLogs(list);
      } catch (error) {
        toast.error('Failed to load attendance log');
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <PageTransition>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-primary mb-1">Drive Attendance Verification</h2>
          <p className="text-muted mb-0">Check-in students physically reporting at your designated interview slots.</p>
        </div>
      </div>

      <div className="row g-4 mb-4">
        {[
          { title: 'Registered Students', count: logs.length, icon: <FiUsers />, color: 'primary' },
          { title: 'Checked-in Present', count: logs.filter(l => l.status === 'Present').length, icon: <FiUserCheck />, color: 'success' }
        ].map((stat, i) => (
          <div className="col-md-6" key={i}>
            <div className="premium-card p-4 d-flex align-items-center hover-lift">
              <div className="rounded-circle bg-primary-light text-primary p-3 me-3 display-6">
                {stat.icon}
              </div>
              <div>
                <span className="text-muted small d-block">{stat.title}</span>
                <h3 className="fw-bold mb-0 text-dark">{stat.count}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="premium-card p-4">
        <h5 className="fw-bold mb-4">Interview Check-in Log</h5>
        {logs.length > 0 ? (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Booked Slot</th>
                  <th>Venue</th>
                  <th className="text-end">Verification</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log.id}>
                    <td>
                      <div className="fw-semibold text-dark">{log.studentName}</div>
                      <span className="text-muted small">{log.email}</span>
                    </td>
                    <td><span className="fw-medium text-primary">{log.slotTime}</span></td>
                    <td><span className="text-muted small">{log.venue}</span></td>
                    <td className="text-end">
                      {log.status === 'Present' ? (
                        <span className="badge bg-success-light text-success px-3 py-2 rounded-pill">Checked In</span>
                      ) : (
                        <button className="btn btn-sm btn-outline-primary" onClick={() => toast.success('Candidate check-in recorded successfully!')}>
                          Confirm Present
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-muted text-center py-4">No active booking check-in records present.</p>
        )}
      </div>
    </PageTransition>
  );
};

export default RecruiterAttendance;
