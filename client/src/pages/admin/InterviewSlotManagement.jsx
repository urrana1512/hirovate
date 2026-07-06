import { useState, useEffect } from 'react';
import PageTransition from '../../components/PageTransition';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FiCalendar, FiClock, FiUsers, FiTrash2 } from 'react-icons/fi';

const InterviewSlotManagement = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSlots = async () => {
    try {
      const res = await api.get('/admin/slots');
      setSlots(res.data.data);
    } catch (error) {
      toast.error('Failed to load slots');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this slot block?')) return;
    try {
      await api.delete(`/admin/slots/${id}`);
      toast.success('Drive slot removed successfully');
      fetchSlots();
    } catch (error) {
      toast.error('Failed to remove slot');
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
          <h2 className="fw-bold text-primary mb-1">Slot Allocation Monitor</h2>
          <p className="text-muted mb-0">Inspect company slot distributions, capacities, and reservation statuses.</p>
        </div>
      </div>

      {slots.length > 0 ? (
        <div className="row g-4">
          {slots.map(slot => {
            const seatsRemaining = Math.max(0, slot.capacity - (slot.bookedCount || 0));
            const fillRatio = Math.min(100, Math.floor(((slot.bookedCount || 0) / slot.capacity) * 100));

            return (
              <div className="col-md-6 col-lg-4" key={slot._id}>
                <div className="premium-card p-4 h-100 d-flex flex-column hover-lift">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <span className="badge bg-primary-light text-primary px-3 py-2 rounded-pill d-flex align-items-center gap-1">
                      <FiCalendar /> {new Date(slot.date).toLocaleDateString()}
                    </span>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(slot._id)}>
                      <FiTrash2 />
                    </button>
                  </div>

                  <h6 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
                    <FiClock className="text-primary"/> {slot.startTime} — {slot.endTime}
                  </h6>
                  <span className="text-muted small mb-3 d-block">{slot.company?.companyName || 'Corporate Drive'}</span>

                  <p className="text-muted small mb-4">{slot.venue}</p>

                  <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center mb-1 small text-muted">
                      <span>Bookings: <strong>{slot.bookedCount || 0} / {slot.capacity}</strong></span>
                      <span>{seatsRemaining} seats left</span>
                    </div>
                    <div className="progress" style={{ height: 6 }}>
                      <div className="progress-bar bg-primary" role="progressbar" style={{ width: `${fillRatio}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="premium-card p-5 text-center">
          <FiCalendar className="text-muted display-4 mb-3" />
          <h5 className="fw-bold text-dark">No Slots Generated</h5>
        </div>
      )}
    </PageTransition>
  );
};

export default InterviewSlotManagement;
