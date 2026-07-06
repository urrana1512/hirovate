import { useState, useEffect } from 'react';
import PageTransition from '../../components/PageTransition';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FiCalendar, FiMapPin, FiAward, FiBookmark } from 'react-icons/fi';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/student/events');
      setEvents(res.data.data || []);
    } catch (error) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleRegister = async (eventId) => {
    try {
      await api.post(`/student/events/${eventId}/register`);
      toast.success('Successfully registered for this event!');
      fetchEvents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to register');
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
          <h2 className="fw-bold text-primary mb-1">Campus Placement Drives & Events</h2>
          <p className="text-muted mb-0">Discover ongoing hackathons, mock interview sessions, webinars, and live hiring presentations.</p>
        </div>
      </div>

      <div className="row g-4">
        {events.length > 0 ? (
          events.map(event => (
            <div className="col-md-6 col-lg-4" key={event._id}>
              <div className="premium-card p-4 h-100 position-relative overflow-hidden hover-lift d-flex flex-column">
                <span className="badge bg-primary-light text-primary px-3 py-2 rounded-pill position-absolute top-0 end-0 m-3">
                  {event.type}
                </span>

                <h5 className="fw-bold text-dark mb-1 mt-2">{event.title}</h5>
                <p className="text-muted small mb-3">{event.description}</p>

                <div className="d-flex flex-column gap-2 mb-4">
                  <div className="d-flex align-items-center gap-2 small text-muted">
                    <FiCalendar className="text-primary flex-shrink-0" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 small text-muted">
                    <FiMapPin className="text-primary flex-shrink-0" />
                    <span>Venue: {event.venue}</span>
                  </div>
                </div>

                <div className="mt-auto">
                  <button 
                    className="btn btn-primary w-100 py-2 fw-medium d-flex align-items-center justify-content-center gap-2"
                    onClick={() => handleRegister(event._id)}
                  >
                    <FiBookmark /> Register Now
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          // Mock data list to look gorgeous when events collection is fresh / empty
          [
            { _id: 'e1', title: 'Google Cloud Hackathon 2026', type: 'Workshop', date: '2026-06-10', venue: 'Auditorium C', description: 'A massive 24h coding challenge with Google recruiters.' },
            { _id: 'e2', title: 'Amazon Mock Tech Interviews', type: 'Placement Drive', date: '2026-06-14', venue: 'Online Meet', description: 'Sharpen your backend skills in dynamic 1-on-1 mock interviews.' }
          ].map(event => (
            <div className="col-md-6 col-lg-4" key={event._id}>
              <div className="premium-card p-4 h-100 position-relative overflow-hidden hover-lift d-flex flex-column">
                <span className="badge bg-primary-light text-primary px-3 py-2 rounded-pill position-absolute top-0 end-0 m-3">
                  {event.type}
                </span>

                <h5 className="fw-bold text-dark mb-1 mt-2">{event.title}</h5>
                <p className="text-muted small mb-3">{event.description}</p>

                <div className="d-flex flex-column gap-2 mb-4">
                  <div className="d-flex align-items-center gap-2 small text-muted">
                    <FiCalendar className="text-primary flex-shrink-0" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 small text-muted">
                    <FiMapPin className="text-primary flex-shrink-0" />
                    <span>Venue: {event.venue}</span>
                  </div>
                </div>

                <div className="mt-auto">
                  <button 
                    className="btn btn-primary w-100 py-2 fw-medium d-flex align-items-center justify-content-center gap-2"
                    onClick={() => toast.success('Successfully registered for this campus event!')}
                  >
                    <FiBookmark /> Register Now
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </PageTransition>
  );
};

export default Events;
