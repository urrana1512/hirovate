import { useState } from 'react';
import PageTransition from '../../components/PageTransition';
import { FiBell, FiCheck } from 'react-icons/fi';
import { toast } from 'react-toastify';

const RecruiterNotifications = () => {
  const [notifs, setNotifs] = useState([
    { id: '1', title: 'New Application Received', body: 'Jane Doe applied for Software Engineer Intern', time: '10 mins ago', read: false },
    { id: '2', title: 'Interview Slot Booked', body: 'Student Alice Walker booked a slot for Tomorrow 10:00 AM', time: '1 hour ago', read: false }
  ]);

  const handleMarkRead = (id) => {
    setNotifs(notifs.map(n => n.id === id ? { ...n, read: true } : n));
    toast.success('Notification marked as read');
  };

  return (
    <PageTransition>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-primary mb-1">Hiring Alerts</h2>
          <p className="text-muted mb-0">Monitor recruiter actions, new candidate uploads, and system notifications in real-time.</p>
        </div>
      </div>

      <div className="premium-card p-4">
        {notifs.length > 0 ? (
          <div className="d-flex flex-column gap-3">
            {notifs.map(n => (
              <div key={n.id} className={`p-3 border rounded-3 d-flex justify-content-between align-items-center ${n.read ? 'bg-light opacity-75' : 'bg-primary-light border-primary'}`}>
                <div>
                  <h6 className="fw-bold mb-1 text-dark d-flex align-items-center gap-2"><FiBell className="text-primary"/> {n.title}</h6>
                  <p className="text-muted small mb-0">{n.body} • {n.time}</p>
                </div>
                {!n.read && (
                  <button className="btn btn-sm btn-outline-primary" onClick={() => handleMarkRead(n.id)}>
                    <FiCheck className="me-1"/> Mark Read
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted text-center py-4">No active hiring alerts present.</p>
        )}
      </div>
    </PageTransition>
  );
};

export default RecruiterNotifications;
