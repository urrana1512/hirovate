import { useState, useEffect } from 'react';
import PageTransition from '../../components/PageTransition';
import { FiCheckSquare, FiServer, FiCalendar, FiUser } from 'react-icons/fi';
import api from '../../services/api';
import { toast } from 'react-toastify';

const SystemSettings = () => {
  const [eventName, setEventName] = useState('JobFest 2027');
  const [organizer, setOrganizer] = useState('TOPS Technologies');
  const [startDate, setStartDate] = useState('2027-03-30');
  const [endDate, setEndDate] = useState('2027-03-31');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/admin/settings');
        const { eventName: evName, organizer: orgName, startDate: start, endDate: end } = res.data.data;
        setEventName(evName || 'JobFest 2027');
        setOrganizer(orgName || 'TOPS Technologies');
        setStartDate(start || '2027-03-30');
        setEndDate(end || '2027-03-31');
      } catch (error) {
        toast.error('Failed to load system settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.put('/admin/settings', {
        eventName,
        organizer,
        startDate,
        endDate
      });
      toast.success('System configurations successfully updated!');
    } catch (error) {
      toast.error('Failed to save settings');
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
          <h2 className="fw-bold text-primary mb-1">Platform System Configurations</h2>
          <p className="text-muted mb-0">Configure dynamic JobFest drive dates, event branding, organizers, and years.</p>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <form onSubmit={handleSave} className="premium-card p-4 bg-white">
            <h5 className="fw-bold mb-4 text-dark"><FiServer className="text-primary me-2"/> Active JobFest Setup</h5>
            
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="form-label small">Event Branding Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="e.g. JobFest 2027"
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label small">Organizer Title</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={organizer}
                  onChange={(e) => setOrganizer(e.target.value)}
                  placeholder="e.g. TOPS Technologies"
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label small"><FiCalendar className="me-1 text-primary"/> Event Start Date</label>
                <input 
                  type="date" 
                  className="form-control" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label small"><FiCalendar className="me-1 text-primary"/> Event End Date</label>
                <input 
                  type="date" 
                  className="form-control" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary px-4 py-3 fw-bold d-flex align-items-center gap-2">
              <FiCheckSquare /> Save Configurations
            </button>
          </form>
        </div>

        <div className="col-lg-4">
          <div className="premium-card p-4 h-100 bg-white">
            <h5 className="fw-bold mb-3 text-dark">Active Config Status</h5>
            <p className="text-muted small">The dates and organizer configurations saved here will instantly customize the date selection restrictions for all student bookings and recruiter slot planners globally.</p>
            <hr />
            <div className="mb-3">
              <span className="text-muted small d-block">Organized By</span>
              <strong>{organizer}</strong>
            </div>
            <div className="mb-3">
              <span className="text-muted small d-block">Configured Duration</span>
              <strong>{new Date(startDate).toLocaleDateString()} — {new Date(endDate).toLocaleDateString()}</strong>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default SystemSettings;
