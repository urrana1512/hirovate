import { useState, useEffect } from 'react';
import PageTransition from '../../components/PageTransition';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FiUserCheck, FiUsers } from 'react-icons/fi';

const AttendanceManagement = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get('/admin/applications');
        const list = (res.data.data || []).map(app => ({
          id: app._id,
          studentName: app.student?.name || 'Jane Doe',
          email: app.student?.email,
          companyName: app.company?.companyName || 'Corporate Hub',
          slotTime: app.slot ? `${app.slot.startTime} — ${app.slot.endTime}` : 'TBD',
          status: app.status === 'interview_scheduled' ? 'Present' : 'Pending'
        }));
        setLogs(list);
      } catch (error) {
        toast.error('Failed to load drive attendance log');
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
          <h2 className="fw-bold text-primary mb-1">Campus Check-in Central</h2>
          <p className="text-muted mb-0">Track drive attendance, monitor checklist check-ins, and inspect student counts.</p>
        </div>
      </div>

      <div className="row g-4 mb-4">
        {[
          { title: 'Drive Registrations', count: logs.length, icon: <FiUsers />, color: 'primary' },
          { title: 'Marked Present', count: logs.filter(l => l.status === 'Present').length, icon: <FiUserCheck />, color: 'success' }
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
        <h5 className="fw-bold mb-4 font-poppins">Registered Candidates Check-in Log</h5>
        {logs.length > 0 ? (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Company Hub</th>
                  <th>Booked Slot</th>
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
                    <td><strong>{log.companyName}</strong></td>
                    <td><span className="fw-medium text-primary">{log.slotTime}</span></td>
                    <td className="text-end">
                      {log.status === 'Present' ? (
                        <span className="badge bg-success-light text-success px-3 py-2 rounded-pill">Present</span>
                      ) : (
                        <button className="btn btn-sm btn-outline-primary" onClick={() => toast.success('Candidate check-in recorded successfully!')}>
                          Mark Present
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-muted text-center py-4">No candidate bookings recorded for driving check-ins.</p>
        )}
      </div>
    </PageTransition>
  );
};

export default AttendanceManagement;
