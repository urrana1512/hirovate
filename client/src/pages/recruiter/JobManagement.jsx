import { useState, useEffect } from 'react';
import PageTransition from '../../components/PageTransition';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FiPlus, FiBriefcase, FiTrash2, FiMapPin, FiCalendar, FiEdit2, FiClock, FiAlertTriangle } from 'react-icons/fi';

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

const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState(null);
  const [eventSettings, setEventSettings] = useState({
    startDate: '2027-03-30',
    endDate: '2027-03-31',
    eventName: 'Hirovate 2027',
    organizer: 'Hirovate Technologies'
  });
  
  // Form modal state
  const [showModal, setShowModal] = useState(false);
  const [editJobId, setEditJobId] = useState(null); // If set, we are updating this vacancy
  
  const [formData, setFormData] = useState({
    title: '',
    role: '',
    salaryPackage: '',
    experienceRequired: '',
    eligibilityCriteria: 'Not Specified',
    location: '',
    workMode: 'on-site',
    deadline: '',
    openings: 1,
    availability: []
  });

  // Calculate the dates array between start & end dates
  const getEventDatesArray = (start, end) => {
    const dates = [];
    let current = new Date(start);
    const stop = new Date(end);
    
    while (current <= stop) {
      dates.push(new Date(current).toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  const fetchSettingsJobsAndProfile = async () => {
    try {
      const settingsRes = await api.get('/settings');
      let currentSettings = eventSettings;
      if (settingsRes.data.success && settingsRes.data.data) {
        setEventSettings(settingsRes.data.data);
        currentSettings = settingsRes.data.data;
      }

      // Initialize default availability timings based on active Hirovate dates
      const days = getEventDatesArray(currentSettings.startDate, currentSettings.endDate);
      const defaultAvails = days.map((day, idx) => ({
        date: day,
        startTime: idx === 0 ? '10:00 AM' : '09:00 AM',
        endTime: idx === 0 ? '05:00 PM' : '04:00 PM',
        attending: true
      }));

      setFormData(prev => ({
        ...prev,
        deadline: currentSettings.startDate,
        availability: defaultAvails
      }));

      const profileRes = await api.get('/recruiter/profile');
      setCompany(profileRes.data.data);

      const res = await api.get('/recruiter/jobs');
      setJobs(res.data.data || []);
    } catch (error) {
      toast.error('Failed to load active jobs or recruiter profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettingsJobsAndProfile();
  }, []);

  const handleToggleCompanyClosed = async () => {
    const actionMsg = company?.status === 'hiring_closed' 
      ? 'Are you sure you want to reopen your recruitment drive?' 
      : 'Are you sure you want to CLOSE your entire recruitment drive? This will close all active job vacancies and alert all candidates that your placements have concluded!';
      
    if (!window.confirm(actionMsg)) return;

    try {
      const res = await api.put('/recruiter/toggle-status');
      setCompany(res.data.data);
      toast.success(res.data.data.status === 'hiring_closed' ? 'Recruitment drive closed globally!' : 'Recruitment drive reopened!');
      
      // Reload jobs
      const jobsRes = await api.get('/recruiter/jobs');
      setJobs(jobsRes.data.data || []);
    } catch (error) {
      toast.error('Failed to update company status');
    }
  };

  const handleToggleJobStatus = async (jobId, currentStatus) => {
    try {
      const nextStatus = currentStatus === 'closed' ? 'active' : 'closed';
      await api.put(`/recruiter/jobs/${jobId}`, { status: nextStatus });
      toast.success(nextStatus === 'closed' ? 'Interview closed for this role!' : 'Interview reopened!');
      
      const res = await api.get('/recruiter/jobs');
      setJobs(res.data.data || []);
    } catch (error) {
      toast.error('Failed to toggle interview status');
    }
  };

  const handleOpenCreateModal = () => {
    if (company?.status === 'hiring_closed') {
      return toast.warn('Reopen your recruitment drive to post new vacancies!');
    }
    setEditJobId(null);
    const days = getEventDatesArray(eventSettings.startDate, eventSettings.endDate);
    const defaultAvails = days.map((day, idx) => ({
      date: day,
      startTime: idx === 0 ? '10:00 AM' : '09:00 AM',
      endTime: idx === 0 ? '05:00 PM' : '04:00 PM',
      attending: true
    }));

    setFormData({
      title: '',
      role: '',
      salaryPackage: '',
      experienceRequired: '',
      eligibilityCriteria: 'Not Specified',
      location: '',
      workMode: 'on-site',
      deadline: eventSettings.startDate,
      openings: 1,
      availability: defaultAvails
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (job) => {
    setEditJobId(job._id);
    
    // Map existing availability or fallback to event default days
    const days = getEventDatesArray(eventSettings.startDate, eventSettings.endDate);
    const avails = days.map((day) => {
      const match = job.availability?.find(a => new Date(a.date).toISOString().split('T')[0] === day);
      return {
        date: day,
        startTime: match ? match.startTime : '09:00 AM',
        endTime: match ? match.endTime : '05:00 PM',
        attending: match ? true : false
      };
    });

    setFormData({
      title: job.title,
      role: job.role,
      salaryPackage: job.salaryPackage,
      experienceRequired: job.experienceRequired,
      eligibilityCriteria: job.eligibilityCriteria || 'Not Specified',
      location: job.location,
      workMode: job.workMode,
      deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : eventSettings.startDate,
      openings: job.openings,
      availability: avails
    });
    setShowModal(true);
  };

  const handleAvailabilityChange = (index, field, value) => {
    const updated = [...formData.availability];
    updated[index][field] = value;
    setFormData({ ...formData, availability: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Automatically inherit timing from company attendance profile, filtering out absent days
    const activeAvails = company?.attendanceTimings?.filter(t => t.attending).map(t => ({
      date: t.date,
      startTime: t.startTime,
      endTime: t.endTime,
      attending: t.attending
    })) || [];

    const payload = {
      ...formData,
      availability: activeAvails
    };

    try {
      if (editJobId) {
        await api.put(`/recruiter/jobs/${editJobId}`, payload);
        toast.success('Hiring vacancy details updated successfully!');
      } else {
        await api.post('/recruiter/jobs', payload);
        toast.success('New vacancy successfully posted!');
      }
      setShowModal(false);
      
      const res = await api.get('/recruiter/jobs');
      setJobs(res.data.data || []);
    } catch (error) {
      toast.error('Failed to save job vacancy');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job vacancy?')) return;
    try {
      await api.delete(`/recruiter/jobs/${id}`);
      toast.success('Hiring vacancy deleted successfully');
      const res = await api.get('/recruiter/jobs');
      setJobs(res.data.data || []);
    } catch (error) {
      toast.error('Failed to delete vacancy');
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
          <h2 className="fw-bold text-primary mb-1">Job Openings</h2>
          <p className="text-muted mb-0">Publish new vacancies, check salary details, and handle active requisitions.</p>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <button 
            className={`btn d-flex align-items-center gap-2 px-4 py-2 fw-bold text-white shadow-sm ${company?.status === 'hiring_closed' ? 'btn-success' : 'btn-danger'}`}
            onClick={handleToggleCompanyClosed}
          >
            {company?.status === 'hiring_closed' ? 'Open Recruitment Drive' : 'Company Closed (End Drive)'}
          </button>
          <button 
            className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2" 
            onClick={handleOpenCreateModal}
            disabled={company?.status === 'hiring_closed'}
          >
            <FiPlus /> Post Job opening
          </button>
        </div>
      </div>

      {company?.status === 'hiring_closed' && (
        <div className="alert alert-danger border-0 rounded-3 p-3 mb-4 d-flex align-items-center gap-3">
          <FiAlertTriangle className="fs-3 text-danger"/>
          <div>
            <h6 className="fw-bold mb-1">Recruitment Drive Closed</h6>
            <span className="small">Your company status is currently set to <strong>Company Closed</strong>. All current openings are disabled and students are notified that your recruitment session has concluded. Click <strong>"Open Recruitment Drive"</strong> above to resume.</span>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content premium-card p-4 border-0">
              <div className="modal-header border-0 pb-0">
                <div>
                  <h5 className="modal-title fw-bold text-dark">{editJobId ? 'Edit Hiring Vacancy' : 'Publish New Vacancy'}</h5>
                  <p className="text-muted small mb-0">Manage parameters and specific interview schedules.</p>
                </div>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit} className="mt-3">
                <div className="modal-body py-2 overflow-auto" style={{ maxHeight: '70vh' }}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small">Job Title</label>
                      <input type="text" className="form-control" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Software Engineer Intern" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small">Job Role Category</label>
                      <input type="text" className="form-control" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} placeholder="e.g. Frontend Development" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small">Salary package (LPA)</label>
                      <input type="text" className="form-control" value={formData.salaryPackage} onChange={e => setFormData({ ...formData, salaryPackage: e.target.value })} placeholder="e.g. 12 LPA" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small">Experience Required</label>
                      <input type="text" className="form-control" value={formData.experienceRequired} onChange={e => setFormData({ ...formData, experienceRequired: e.target.value })} placeholder="e.g. Fresher / 0-1 years" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small">Location</label>
                      <input type="text" className="form-control" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} placeholder="e.g. Ahmedabad, Gujarat" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small">Work Mode</label>
                      <select className="form-select" value={formData.workMode} onChange={e => setFormData({ ...formData, workMode: e.target.value })}>
                        <option value="on-site">On-Site</option>
                        <option value="remote">Remote</option>
                        <option value="hybrid">Hybrid</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small">Hiring Deadline</label>
                      <input type="date" className="form-control" value={formData.deadline} onChange={e => setFormData({ ...formData, deadline: e.target.value })} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small">Number of Openings</label>
                      <input type="number" className="form-control" value={formData.openings} onChange={e => setFormData({ ...formData, openings: Number(e.target.value) })} required />
                    </div>

                    {/* Interview Availability Day Configurator */}
                    <div className="col-12 mt-4">
                      <div className="p-3 bg-light border border-dashed rounded-3">
                        <div className="d-flex align-items-center gap-2 mb-2 text-primary">
                          <FiClock className="fs-5" />
                          <h6 className="fw-bold mb-0">Interview Placement Timings</h6>
                        </div>
                        <p className="text-muted small mb-3">
                          This job inherits its interview timings automatically from your general **Company Attendance Schedule**.
                        </p>
                        
                        <div className="row g-2">
                          {company?.attendanceTimings && company.attendanceTimings.length > 0 ? (
                            company.attendanceTimings.map((timing, idx) => (
                              <div key={idx} className="col-sm-6">
                                <div className="p-2 bg-white rounded border small d-flex flex-column h-100 justify-content-between">
                                  <div className="d-flex justify-content-between align-items-center mb-1">
                                    <span className="fw-semibold text-dark">Day {idx + 1}: {new Date(timing.date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
                                    <span className={`badge ${timing.attending ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-secondary-subtle text-secondary'} rounded-pill`} style={{ fontSize: '0.65rem' }}>
                                      {timing.attending ? 'Attending' : 'Absent'}
                                    </span>
                                  </div>
                                  {timing.attending ? (
                                    <span className="text-muted fw-bold mt-1" style={{ fontSize: '0.75rem' }}>
                                      {timing.startTime} — {timing.endTime}
                                    </span>
                                  ) : (
                                    <span className="text-muted small italic">Not Scheduled</span>
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="col-12 text-center py-2 text-muted small">
                              No company profile attendance timings found. Configure them in "Company Workspace".
                            </div>
                          )}
                        </div>
                        <span className="small text-muted d-block mt-2 italic" style={{ fontSize: '0.7rem' }}>
                          * To edit these timings, please navigate to your **Company Workspace / Profile Setup** page.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 pt-3">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>Close</button>
                  <button type="submit" className="btn btn-primary">{editJobId ? 'Save Changes' : 'Post Vacancy'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {jobs.length > 0 ? (
        <div className="row g-4">
          {jobs.map(job => {
            const isClosed = job.status === 'closed' || company?.status === 'hiring_closed';
            
            return (
              <div className="col-lg-6" key={job._id}>
                <div 
                  className={`premium-card p-4 h-100 d-flex flex-column hover-lift`}
                  style={isClosed ? { filter: 'grayscale(70%)', opacity: 0.65, border: '2px dashed var(--danger-color)' } : {}}
                >
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h5 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
                        {job.title} 
                        {isClosed && <span className="badge bg-danger text-white rounded-pill px-2 py-1 small" style={{ fontSize: '0.65rem' }}>Closed</span>}
                      </h5>
                      <span className="text-muted small">{job.role}</span>
                    </div>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => handleOpenEditModal(job)} disabled={company?.status === 'hiring_closed'}>
                        <FiEdit2 />
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(job._id)}>
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>

                  <div className="d-flex flex-column gap-2 mb-3 small text-muted">
                    <div><FiBriefcase className="text-primary me-2"/> Package: <strong>{job.salaryPackage}</strong></div>
                    <div><FiMapPin className="text-primary me-2"/> Location: {job.location} ({job.workMode})</div>
                    <div><FiCalendar className="text-primary me-2"/> Deadline: {new Date(job.deadline).toLocaleDateString()}</div>
                  </div>

                  {/* Show Configured Availability timings */}
                  {job.availability && job.availability.length > 0 && (
                    <div className="mb-4 bg-light p-3 rounded-3 border">
                      <span className="text-muted small d-block mb-2 fw-bold"><FiClock className="me-1 text-primary"/> Interview Schedules Availability</span>
                      <div className="d-flex flex-column gap-2">
                        {job.availability.map((avail, idx) => (
                          <div key={idx} className="d-flex justify-content-between align-items-center small text-dark border-bottom pb-1 mb-1 last-mb-0 last-pb-0 last-border-0">
                            <span>{new Date(avail.date).toLocaleDateString()}</span>
                            <span className="badge bg-primary-light text-primary">{avail.startTime} — {avail.endTime}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dynamic Interview Status Toggle at bottom */}
                  <div className="mt-auto d-flex justify-content-between align-items-center pt-3 border-top mt-3">
                    <span className="small text-muted fw-bold">Drive Operations</span>
                    <div className="form-check form-switch d-flex align-items-center gap-2">
                      <input 
                        className="form-check-input cursor-pointer" 
                        type="checkbox" 
                        role="switch"
                        id={`status-toggle-${job._id}`}
                        checked={isClosed}
                        disabled={company?.status === 'hiring_closed'}
                        onChange={() => handleToggleJobStatus(job._id, job.status)}
                        style={{ width: '2.5em', height: '1.25em' }}
                      />
                      <label className={`form-check-label small fw-bold cursor-pointer ${isClosed ? 'text-danger' : 'text-success'}`} htmlFor={`status-toggle-${job._id}`}>
                        {isClosed ? 'Interview Closed' : 'Interview Active'}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="premium-card p-5 text-center">
          <FiBriefcase className="text-muted display-4 mb-3" />
          <h5 className="fw-bold text-dark">No Active Job Openings</h5>
          <p className="text-muted small mb-0">Publish your first job vacancy using the "Post Job opening" button above.</p>
        </div>
      )}
    </PageTransition>
  );
};

export default JobManagement;
