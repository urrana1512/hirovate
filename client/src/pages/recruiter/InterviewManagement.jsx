import { useState, useEffect } from 'react';
import PageTransition from '../../components/PageTransition';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FiPlus, FiCalendar, FiSliders, FiClock, FiMapPin } from 'react-icons/fi';

const InterviewManagement = () => {
  const [interviews, setInterviews] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form modal
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    student: '',
    application: '',
    roundName: 'Technical Round 1',
    interviewType: 'technical',
    date: '',
    timeSlot: '',
    venue: 'Interview Booth A',
    panelName: 'Tech Panel A'
  });

  const fetchData = async () => {
    try {
      const [resInt, resApp] = await Promise.all([
        api.get('/recruiter/interviews'),
        api.get('/recruiter/applicants')
      ]);
      setInterviews(resInt.data.data);
      // Filter only shortlisted applicants for scheduling interviews
      setApplicants((resApp.data.data || []).filter(app => app.status === 'shortlisted'));
    } catch (error) {
      toast.error('Failed to load interview dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSelectStudent = (appId) => {
    const selectedApp = applicants.find(app => app._id === appId);
    if (selectedApp && selectedApp.student) {
      setFormData({
        ...formData,
        application: appId,
        student: selectedApp.student._id
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.student || !formData.application) {
      return toast.warn('Please select a candidate first!');
    }
    try {
      await api.post('/recruiter/interviews', formData);
      toast.success('Interview round scheduled successfully!');
      setShowModal(false);
      setFormData({
        student: '',
        application: '',
        roundName: 'Technical Round 1',
        interviewType: 'technical',
        date: '',
        timeSlot: '',
        venue: 'Interview Booth A',
        panelName: 'Tech Panel A'
      });
      fetchData();
    } catch (error) {
      toast.error('Failed to schedule interview');
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
          <h2 className="fw-bold text-primary mb-1">Interview Panel Coordinator</h2>
          <p className="text-muted mb-0">Designate panels, map tech/HR rounds, and schedule interviews for shortlisted talents.</p>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2" onClick={() => setShowModal(true)}>
          <FiPlus /> Schedule Round
        </button>
      </div>

      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content premium-card p-4 border-0">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold text-dark">Schedule Interview Round</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit} className="mt-3">
                <div className="modal-body py-2">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small">Select Candidate</label>
                      <select className="form-select" onChange={e => handleSelectStudent(e.target.value)} required>
                        <option value="">-- Choose Candidate --</option>
                        {applicants.map(app => (
                          <option key={app._id} value={app._id}>
                            {app.student?.name} (CGPA: {app.studentProfile?.cgpa || 'N/A'})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small">Round Name</label>
                      <input type="text" className="form-control" value={formData.roundName} onChange={e => setFormData({ ...formData, roundName: e.target.value })} required />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small">Interview Category</label>
                      <select className="form-select" value={formData.interviewType} onChange={e => setFormData({ ...formData, interviewType: e.target.value })}>
                        <option value="technical">Technical Round</option>
                        <option value="hr">HR Round</option>
                        <option value="gd">Group Discussion</option>
                        <option value="online">Online Assessment</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small">Date</label>
                      <input type="date" className="form-control" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} required />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small">Time Slot</label>
                      <input type="text" className="form-control" value={formData.timeSlot} onChange={e => setFormData({ ...formData, timeSlot: e.target.value })} placeholder="e.g. 10:00 AM — 10:30 AM" required />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small">Panel Coordinator Name</label>
                      <input type="text" className="form-control" value={formData.panelName} onChange={e => setFormData({ ...formData, panelName: e.target.value })} required />
                    </div>

                    <div className="col-md-12">
                      <label className="form-label small">Venue / Link</label>
                      <input type="text" className="form-control" value={formData.venue} onChange={e => setFormData({ ...formData, venue: e.target.value })} required />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 pt-3">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>Close</button>
                  <button type="submit" className="btn btn-primary">Schedule Round</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {interviews.length > 0 ? (
        <div className="row g-4">
          {interviews.map(int => (
            <div className="col-lg-6" key={int._id}>
              <div className="premium-card p-4 h-100 d-flex flex-column hover-lift">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h5 className="fw-bold text-dark mb-1">{int.roundName}</h5>
                    <span className="badge bg-primary-light text-primary text-capitalize">{int.interviewType}</span>
                  </div>
                  <span className="badge bg-success-light text-success text-capitalize px-3 py-2 rounded-pill">{int.status}</span>
                </div>

                <hr className="my-3" />

                <div className="d-flex flex-column gap-2 mb-3 small text-muted">
                  <div><FiSliders className="text-primary me-2"/> Evaluator: <strong>{int.panelName}</strong></div>
                  <div><FiCalendar className="text-primary me-2"/> Date: {new Date(int.date).toLocaleDateString()}</div>
                  <div><FiClock className="text-primary me-2"/> Time: {int.timeSlot}</div>
                  <div><FiMapPin className="text-primary me-2"/> Venue: {int.venue}</div>
                </div>

                <div className="mt-auto pt-2 border-top d-flex align-items-center gap-3">
                  <div className="rounded-circle bg-primary-light text-primary d-flex align-items-center justify-content-center fw-bold" style={{ width: 36, height: 36 }}>
                    {int.student?.name?.charAt(0)}
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0 text-dark small">{int.student?.name}</h6>
                    <span className="text-muted small" style={{ fontSize: '0.75rem' }}>{int.student?.email}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="premium-card p-5 text-center">
          <FiCalendar className="text-muted display-4 mb-3" />
          <h5 className="fw-bold text-dark">No Scheduled Interviews</h5>
          <p className="text-muted small">Once you move candidates to the Shortlisted status and click "Schedule Round", you can coordinate them here.</p>
        </div>
      )}
    </PageTransition>
  );
};

export default InterviewManagement;
