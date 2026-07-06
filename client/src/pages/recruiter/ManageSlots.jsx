import { useState, useEffect } from 'react';
import PageTransition from '../../components/PageTransition';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FiPlus, FiCalendar, FiClock, FiTrash2 } from 'react-icons/fi';

const parseTimeParts = (timeStr) => {
  const defaultVal = { hour: '09', minute: '00', ampm: 'AM' };
  if (!timeStr) return defaultVal;
  
  if (timeStr.includes(':') && !timeStr.toLowerCase().includes('am') && !timeStr.toLowerCase().includes('pm')) {
    const parts = timeStr.trim().split(':');
    let h = parseInt(parts[0], 10);
    const m = parts[1].slice(0, 2);
    let ampm = 'AM';
    if (h >= 12) {
      ampm = 'PM';
      if (h > 12) h -= 12;
    }
    if (h === 0) h = 12;
    return {
      hour: String(h).padStart(2, '0'),
      minute: m.padStart(2, '0'),
      ampm
    };
  }

  const matches = timeStr.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
  if (!matches) return defaultVal;
  return {
    hour: matches[1].padStart(2, '0'),
    minute: matches[2].padStart(2, '0'),
    ampm: matches[3].toUpperCase()
  };
};

const TimeSelectGroup = ({ value, onChange, disabled }) => {
  const { hour, minute, ampm } = parseTimeParts(value);

  const hours = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  const minutes = ['00', '15', '30', '45'];
  const ampms = ['AM', 'PM'];

  const handlePartChange = (part, val) => {
    let newHour = hour;
    let newMinute = minute;
    let newAmpm = ampm;

    if (part === 'hour') newHour = val;
    if (part === 'minute') newMinute = val;
    if (part === 'ampm') newAmpm = val;

    onChange(`${newHour}:${newMinute} ${newAmpm}`);
  };

  return (
    <div className="d-flex gap-1 align-items-center">
      <select 
        className="form-select form-select-sm" 
        value={hour} 
        onChange={(e) => handlePartChange('hour', e.target.value)}
        disabled={disabled}
        style={{ width: '68px' }}
      >
        {hours.map(h => <option key={h} value={h}>{h}</option>)}
      </select>
      <span className="text-dark fw-bold">:</span>
      <select 
        className="form-select form-select-sm" 
        value={minute} 
        onChange={(e) => handlePartChange('minute', e.target.value)}
        disabled={disabled}
        style={{ width: '68px' }}
      >
        {minutes.map(m => <option key={m} value={m}>{m}</option>)}
      </select>
      <select 
        className="form-select form-select-sm fw-bold" 
        value={ampm} 
        onChange={(e) => handlePartChange('ampm', e.target.value)}
        disabled={disabled}
        style={{ width: '72px' }}
      >
        {ampms.map(a => <option key={a} value={a}>{a}</option>)}
      </select>
    </div>
  );
};

const ManageSlots = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventSettings, setEventSettings] = useState({
    startDate: '2027-03-30',
    endDate: '2027-03-31',
    eventName: 'Hirovate 2027',
    organizer: 'Hirovate Technologies'
  });

  // Modal form states
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    startTime: '09:00 AM',
    endTime: '10:00 AM',
    capacity: 10,
    venue: 'Corporate Interview Desk B'
  });

  const fetchSettingsAndSlots = async () => {
    try {
      const settingsRes = await api.get('/settings');
      if (settingsRes.data.success && settingsRes.data.data) {
        setEventSettings(settingsRes.data.data);
        // Pre-fill date with event start date
        setFormData(prev => ({ ...prev, date: settingsRes.data.data.startDate }));
      }

      const res = await api.get('/recruiter/slots');
      setSlots(res.data.data || []);
    } catch (error) {
      toast.error('Failed to load slots or event dates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettingsAndSlots();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Double check date bounds on client side
    const slotDate = new Date(formData.date);
    const minDate = new Date(eventSettings.startDate);
    const maxDate = new Date(eventSettings.endDate);

    if (slotDate < minDate || slotDate > maxDate) {
      return toast.error(`You can only generate slots between ${minDate.toLocaleDateString()} and ${maxDate.toLocaleDateString()}!`);
    }

    try {
      await api.post('/recruiter/slots', formData);
      toast.success('Interview slot generated successfully!');
      setShowModal(false);
      setFormData({
        date: eventSettings.startDate,
        startTime: '09:00 AM',
        endTime: '10:00 AM',
        capacity: 10,
        venue: 'Corporate Interview Desk B'
      });
      const res = await api.get('/recruiter/slots');
      setSlots(res.data.data || []);
    } catch (error) {
      toast.error('Failed to create slot');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this interview slot?')) return;
    try {
      await api.delete(`/recruiter/slots/${id}`);
      toast.success('Interview slot deleted successfully');
      const res = await api.get('/recruiter/slots');
      setSlots(res.data.data || []);
    } catch (error) {
      toast.error('Failed to delete slot');
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
          <h2 className="fw-bold text-primary mb-1">Interview Slot Planner</h2>
          <p className="text-muted mb-0">Create interview blocks, set max capacities, and select interview halls.</p>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2" onClick={() => setShowModal(true)}>
          <FiPlus /> Add Slot Block
        </button>
      </div>

      {/* Organizer date alert banner */}
      <div className="alert alert-info border-0 rounded-3 p-3 mb-4 d-flex align-items-center gap-3">
        <FiCalendar className="fs-3 text-info"/>
        <div>
          <h6 className="fw-bold mb-1">{eventSettings.eventName} Schedule Notice</h6>
          <span className="small text-muted">Organized by <strong>{eventSettings.organizer}</strong>. Placements are hosted for only <strong>{Math.ceil((new Date(eventSettings.endDate) - new Date(eventSettings.startDate)) / (1000 * 60 * 60 * 24)) + 1} days</strong> from <strong>{new Date(eventSettings.startDate).toLocaleDateString()}</strong> to <strong>{new Date(eventSettings.endDate).toLocaleDateString()}</strong>.</span>
        </div>
      </div>

      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content premium-card p-4 border-0">
              <div className="modal-header border-0 pb-0">
                <div>
                  <h5 className="modal-title fw-bold text-dark">Add Seating Slot</h5>
                  <span className="text-muted small">Choose your days and times within the Hirovate dates.</span>
                </div>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit} className="mt-3">
                <div className="modal-body py-2">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label small">Drive Day Date</label>
                      <input 
                        type="date" 
                        className="form-control" 
                        value={formData.date} 
                        onChange={e => setFormData({ ...formData, date: e.target.value })} 
                        min={eventSettings.startDate}
                        max={eventSettings.endDate}
                        required 
                      />
                      <span className="small text-muted d-block mt-1" style={{ fontSize: '0.75rem' }}>Only dates between <strong>{new Date(eventSettings.startDate).toLocaleDateString()}</strong> and <strong>{new Date(eventSettings.endDate).toLocaleDateString()}</strong> are allowed.</span>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small d-block">Start Time</label>
                      <TimeSelectGroup value={formData.startTime} onChange={val => setFormData({ ...formData, startTime: val })} />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small d-block">End Time</label>
                      <TimeSelectGroup value={formData.endTime} onChange={val => setFormData({ ...formData, endTime: val })} />
                    </div>

                    <div className="col-12">
                      <label className="form-label small">Max Seating Capacity</label>
                      <input type="number" className="form-control" value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: Number(e.target.value) })} required />
                    </div>

                    <div className="col-12">
                      <label className="form-label small">Interview Venue</label>
                      <input type="text" className="form-control" value={formData.venue} onChange={e => setFormData({ ...formData, venue: e.target.value })} required />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 pt-3">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>Close</button>
                  <button type="submit" className="btn btn-primary">Create Slot</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

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

                  <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                    <FiClock className="text-primary"/> {slot.startTime} — {slot.endTime}
                  </h6>

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
          <h5 className="fw-bold text-dark">No Seating Slots Configured</h5>
          <p className="text-muted small">Configure date & time blocks above within the active Hirovate period.</p>
        </div>
      )}
    </PageTransition>
  );
};

export default ManageSlots;
