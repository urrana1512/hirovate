import { useState } from 'react';
import PageTransition from '../../components/PageTransition';
import { FiCalendar, FiMapPin, FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';

const EventsManagement = () => {
  const [events, setEvents] = useState([
    { id: 'e1', title: 'Mega Campus Drive 2026', date: 'May 25, 2026', venue: 'Convention Hall A', description: 'Annual coordinated campus placements with 50+ participating corporate companies.' },
    { id: 'e2', title: 'Technical Keynotes & Seminars', date: 'May 28, 2026', venue: 'Academic Seminar Hall', description: 'Introduce corporate hiring flows and packages to engineering graduating classes.' }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', date: '', venue: '', description: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setEvents([...events, { id: Date.now().toString(), ...formData }]);
    toast.success('Placement Event published successfully!');
    setShowModal(false);
    setFormData({ title: '', date: '', venue: '', description: '' });
  };

  return (
    <PageTransition>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-primary mb-1">Campus Placement Drives</h2>
          <p className="text-muted mb-0">Schedule megaplacement events, coordinate technical workshops, and issue registration slots.</p>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2" onClick={() => setShowModal(true)}>
          <FiPlus /> Create Event
        </button>
      </div>

      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content premium-card p-4 border-0">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold text-dark">Publish Campus Event</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit} className="mt-3">
                <div className="modal-body py-2">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label small">Event Title</label>
                      <input type="text" className="form-control" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                    </div>

                    <div className="col-12">
                      <label className="form-label small">Drive Date</label>
                      <input type="text" className="form-control" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} placeholder="e.g. May 30, 2026" required />
                    </div>

                    <div className="col-12">
                      <label className="form-label small">Venue Room</label>
                      <input type="text" className="form-control" value={formData.venue} onChange={e => setFormData({ ...formData, venue: e.target.value })} required />
                    </div>

                    <div className="col-12">
                      <label className="form-label small">Description</label>
                      <textarea className="form-control" rows="4" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 pt-3">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>Close</button>
                  <button type="submit" className="btn btn-primary">Publish Drive</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="row g-4">
        {events.map(ev => (
          <div className="col-md-6" key={ev.id}>
            <div className="premium-card p-4 h-100 d-flex flex-column hover-lift">
              <h5 className="fw-bold text-dark mb-2">{ev.title}</h5>
              <p className="text-muted small mb-4">{ev.description}</p>

              <div className="d-flex flex-column gap-2 mt-auto small text-muted">
                <div><FiCalendar className="text-primary me-2"/> {ev.date}</div>
                <div><FiMapPin className="text-primary me-2"/> Venue: {ev.venue}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageTransition>
  );
};

export default EventsManagement;
