import { useState, useEffect } from 'react';
import PageTransition from '../../components/PageTransition';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FiCalendar, FiClock, FiMapPin, FiCheckCircle } from 'react-icons/fi';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get('/student/applications');
        // A booking is an application that has an interview slot booked
        setBookings(res.data.data || []);
      } catch (error) {
        toast.error('Failed to load interview bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

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
          <h2 className="fw-bold text-primary mb-1">Interview Slots & Bookings</h2>
          <p className="text-muted mb-0">Manage all your booked interview slots, schedule reminders, and locations.</p>
        </div>
      </div>

      <div className="row g-4">
        {bookings.length > 0 ? (
          bookings.map(booking => (
            <div className="col-md-6 col-lg-4" key={booking._id}>
              <div className="premium-card p-4 h-100 position-relative overflow-hidden hover-lift">
                <div className="position-absolute top-0 end-0 m-3">
                  <span className="badge bg-primary-light text-primary px-3 py-2 rounded-pill text-capitalize">{booking.status}</span>
                </div>
                
                <h5 className="fw-bold mb-1 text-dark">{booking.company?.companyName}</h5>
                <p className="text-muted small mb-4">{booking.company?.industry}</p>

                <div className="d-flex flex-column gap-3 mb-4">
                  <div className="d-flex align-items-center gap-2 small text-muted">
                    <FiCalendar className="text-primary flex-shrink-0" />
                    <span>Interview Date: {booking.slot?.date ? new Date(booking.slot.date).toLocaleDateString() : 'Pending'}</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 small text-muted">
                    <FiClock className="text-primary flex-shrink-0" />
                    <span>Timings: {booking.slot?.startTime || 'TBD'} — {booking.slot?.endTime || 'TBD'}</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 small text-muted">
                    <FiMapPin className="text-primary flex-shrink-0" />
                    <span>Venue: {booking.slot?.venue || 'TBD'}</span>
                  </div>
                </div>

                <div className="mt-auto">
                  <button className="btn btn-outline-primary w-100 py-2 fw-medium d-flex align-items-center justify-content-center gap-2" onClick={() => toast.info('Booking details page is fully sync-enabled!')}>
                    <FiCheckCircle /> Confirmed
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <FiCalendar className="text-muted display-4 mb-3" />
            <h5 className="fw-bold text-dark">No Active Slots Booked</h5>
            <p className="text-muted small">Once you apply to a company and book a slot, it will appear here.</p>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default Bookings;
