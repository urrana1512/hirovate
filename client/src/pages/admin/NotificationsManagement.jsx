import { useState } from 'react';
import PageTransition from '../../components/PageTransition';
import { FiSend, FiBell } from 'react-icons/fi';
import { toast } from 'react-toastify';

const NotificationsManagement = () => {
  const [broadcasts, setBroadcasts] = useState([
    { id: 'b1', title: 'Drive Registrations Gated', body: 'Campus Mega drive registrations close by tomorrow 5:00 PM.', time: '1 hour ago' },
    { id: 'b2', title: 'Recruiter Guidelines Loaded', body: 'Placement officers released official lab allocations to company panels.', time: '2 hours ago' }
  ]);

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return toast.warn('All fields are required!');
    setBroadcasts([{ id: Date.now().toString(), title, body, time: 'Just Now' }, ...broadcasts]);
    toast.success('Alert broadcasted to all student & company panels!');
    setTitle('');
    setBody('');
  };

  return (
    <PageTransition>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-primary mb-1">Alert Broadcasting Central</h2>
          <p className="text-muted mb-0">Broadcast campus alerts, coordinate drive announcements, and check platform inbox logs.</p>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="premium-card p-4 bg-white">
            <h5 className="fw-bold mb-4 text-dark"><FiSend className="me-2 text-primary" /> Send Announcement</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small">Announcement Title</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Server Maintenance Notice"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label small">Broadcast Alert Details</label>
                <textarea 
                  className="form-control" 
                  rows="6"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Describe your announcement..."
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-100 py-3 fw-bold">
                Broadcast Announcement
              </button>
            </form>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="premium-card p-4 bg-white h-100">
            <h5 className="fw-bold mb-4 text-dark"><FiBell className="me-2 text-primary"/> Active Broadcast Logs</h5>
            <div className="d-flex flex-column gap-3 overflow-auto" style={{ maxHeight: 420 }}>
              {broadcasts.map(b => (
                <div key={b.id} className="p-3 border rounded-3 bg-light">
                  <h6 className="fw-bold mb-1 text-dark">{b.title}</h6>
                  <p className="text-muted small mb-0">{b.body}</p>
                  <span className="text-muted small d-block mt-2" style={{ fontSize: '0.7rem' }}>{b.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default NotificationsManagement;
