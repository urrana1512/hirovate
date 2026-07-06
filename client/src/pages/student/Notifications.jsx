import { useState, useEffect } from 'react';
import PageTransition from '../../components/PageTransition';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FiBell, FiCheck, FiTrash2, FiClock } from 'react-icons/fi';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/student/notifications');
      setNotifications(res.data.data || []);
    } catch (error) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/student/notifications/${id}/read`);
      toast.success('Notification marked as read');
      fetchNotifications();
    } catch (error) {
      toast.error('Failed to update notification');
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
          <h2 className="fw-bold text-primary mb-1">Alerts & Announcements</h2>
          <p className="text-muted mb-0">Stay updated on important placement deadlines, drive reminders, and company slots.</p>
        </div>
      </div>

      <div className="premium-card p-4">
        {notifications.length > 0 ? (
          <div className="d-flex flex-column gap-3">
            {notifications.map(notif => (
              <div 
                key={notif._id} 
                className={`p-3 border rounded-3 d-flex justify-content-between align-items-start ${notif.isRead ? 'bg-light opacity-75' : 'bg-primary-light border-primary'}`}
              >
                <div>
                  <h6 className="fw-bold mb-1 text-dark d-flex align-items-center gap-2">
                    <FiBell className="text-primary" /> {notif.title}
                  </h6>
                  <p className="text-dark small mb-2">{notif.message}</p>
                  <span className="text-muted small d-flex align-items-center gap-1">
                    <FiClock /> {new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                {!notif.isRead && (
                  <button 
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => handleMarkAsRead(notif._id)}
                  >
                    <FiCheck className="me-1"/> Mark Read
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5">
            <FiBell className="text-muted display-4 mb-3" />
            <h5 className="fw-bold text-dark">No Notifications Yet</h5>
            <p className="text-muted small mb-0">We will notify you here when drive updates or interview slots are booked.</p>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default Notifications;
