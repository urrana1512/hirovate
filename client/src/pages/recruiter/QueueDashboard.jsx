import { useState, useEffect } from 'react';
import PageTransition from '../../components/PageTransition';
import api from '../../services/api';
import { socket } from '../../services/socket';
import { toast } from 'react-toastify';
import { FiPlay, FiPause, FiUserCheck, FiUserMinus, FiChevronRight, FiGrid, FiClock, FiCheckCircle, FiUsers, FiAward } from 'react-icons/fi';

const QueueDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [venue, setVenue] = useState('Interview Room A');
  const [loading, setLoading] = useState(false);
  const [queueData, setQueueData] = useState(null);

  // Fetch recruiter's jobs on mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get('/recruiter/jobs');
        setJobs(res.data.data || []);
        if (res.data.data?.length > 0) {
          setSelectedJobId(res.data.data[0]._id);
        }
      } catch (err) {
        toast.error('Failed to load active jobs');
      }
    };
    fetchJobs();
  }, []);

  // Fetch queue details for selected job
  const fetchQueueDetails = async (jobId) => {
    if (!jobId) return;
    setLoading(true);
    try {
      const res = await api.get(`/queue/recruiter/${jobId}`);
      setQueueData(res.data.data);
    } catch (err) {
      toast.error('Failed to fetch queue details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedJobId) {
      fetchQueueDetails(selectedJobId);
      
      // Connect and join socket room for company real-time events
      socket.emit('join_company_room', selectedJobId);

      const handleQueueUpdate = (payload) => {
        if (payload.jobId === selectedJobId) {
          console.log('[Socket] Queue update received via WebSocket');
          fetchQueueDetails(selectedJobId);
        }
      };

      socket.on('queue_updated', handleQueueUpdate);

      return () => {
        socket.off('queue_updated', handleQueueUpdate);
      };
    }
  }, [selectedJobId]);

  const handleStartSession = async () => {
    if (!selectedJobId) {
      toast.warning('Please select a job role first!');
      return;
    }
    try {
      const res = await api.post('/queue/start', { jobId: selectedJobId, venue });
      toast.success('Live interview drive successfully started!');
      setQueueData(res.data.data);
      fetchQueueDetails(selectedJobId);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start queue session');
    }
  };

  const handleNextCandidate = async () => {
    if (!queueData?.queue?._id) return;
    try {
      const res = await api.post('/queue/next', { queueId: queueData.queue._id });
      toast.success(res.data.message);
      fetchQueueDetails(selectedJobId);
    } catch (err) {
      toast.error('Failed to call next candidate');
    }
  };

  const handleSkipCandidate = async () => {
    if (!queueData?.queue?._id) return;
    try {
      await api.post('/queue/skip', { queueId: queueData.queue._id });
      toast.success('Candidate delayed in queue successfully!');
      fetchQueueDetails(selectedJobId);
    } catch (err) {
      toast.error('Failed to delay candidate');
    }
  };

  const handleMarkAbsent = async () => {
    if (!queueData?.queue?._id) return;
    try {
      await api.post('/queue/absent', { queueId: queueData.queue._id });
      toast.warning('Candidate marked absent! Calling next in line...');
      fetchQueueDetails(selectedJobId);
    } catch (err) {
      toast.error('Failed to mark candidate absent');
    }
  };

  const handleToggleQueue = async (status) => {
    if (!queueData?.queue?._id) return;
    try {
      await api.put('/queue/toggle', { queueId: queueData.queue._id, status });
      toast.info(`Queue session is now ${status === 'paused' ? 'Paused' : 'Active'}`);
      fetchQueueDetails(selectedJobId);
    } catch (err) {
      toast.error('Failed to update queue status');
    }
  };

  return (
    <PageTransition>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-primary mb-1">Live Queue Workspace</h2>
          <p className="text-muted mb-0">Direct live drives, promote applicant lines, and announce candidates automatically.</p>
        </div>
        
        {/* Job Selection Dropdown */}
        <div className="d-flex align-items-center gap-2">
          <label className="fw-bold text-dark small mb-0">Job Drive:</label>
          <select 
            className="form-select form-select-sm premium-input" 
            style={{ minWidth: 220 }}
            value={selectedJobId} 
            onChange={(e) => setSelectedJobId(e.target.value)}
          >
            {jobs.map(j => (
              <option key={j._id} value={j._id}>{j.title} ({j.type})</option>
            ))}
          </select>
        </div>
      </div>

      {loading && !queueData ? (
        <div className="d-flex justify-content-center align-items-center py-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : !queueData?.queue ? (
        /* Empty/Start Session Panel */
        <div className="premium-card p-5 text-center max-w-md mx-auto my-4">
          <FiGrid className="text-muted display-4 mb-3" />
          <h4 className="fw-bold text-dark">No Active Queue Session</h4>
          <p className="text-muted small mb-4">
            Begin the live drive to automatically enroll all drive candidates in the placement workspace.
          </p>
          <div className="d-flex flex-column gap-3 max-w-xs mx-auto" style={{ maxWidth: 320 }}>
            <div>
              <label className="form-label small fw-bold text-dark d-block text-start">Allocated Venue / Room</label>
              <input 
                type="text" 
                className="form-control form-control-sm premium-input"
                placeholder="e.g. Lab 2B, First Floor"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
              />
            </div>
            <button className="btn btn-primary d-flex align-items-center justify-content-center gap-2" onClick={handleStartSession}>
              <FiPlay className="fs-5" /> Start Live Placement Drive
            </button>
          </div>
        </div>
      ) : (
        /* Active Queue Panel */
        <div className="row g-4">
          {/* Active / Current Interviewing Candidate */}
          <div className="col-lg-8">
            <div className="premium-card p-4 mb-4 border-primary border-start border-4 shadow-sm">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="badge bg-danger text-white px-3 py-2 rounded-pill animate-pulse">
                  ● LIVE INTERVIEW
                </span>
                <div className="d-flex gap-2">
                  {queueData.queue.queueStatus === 'active' ? (
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => handleToggleQueue('paused')}>
                      <FiPause className="me-1" /> Pause Line
                    </button>
                  ) : (
                    <button className="btn btn-sm btn-outline-success" onClick={() => handleToggleQueue('active')}>
                      <FiPlay className="me-1" /> Resume Line
                    </button>
                  )}
                </div>
              </div>

              {queueData.queue.currentCandidate ? (
                <div className="row align-items-center">
                  <div className="col-md-7">
                    <h5 className="fw-bold text-dark mb-1">
                      {queueData.queue.currentCandidate.student?.name}
                    </h5>
                    <p className="text-muted small mb-3">{queueData.queue.currentCandidate.student?.email}</p>
                    
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      <span className="badge bg-primary-light text-primary">
                        CGPA: {queueData.queue.currentCandidate.studentProfile?.cgpa || '8.5'}
                      </span>
                      <span className="badge bg-success-light text-success">
                        Grade: {queueData.queue.currentCandidate.studentProfile?.courseGrade || 'A+'}
                      </span>
                      <span className="badge bg-info-light text-info text-capitalize">
                        Course: {queueData.queue.currentCandidate.studentProfile?.courseName || 'Fullstack'}
                      </span>
                    </div>

                    <div className="d-flex gap-2 mt-4">
                      <button className="btn btn-primary btn-sm px-4 fw-bold shadow" onClick={handleNextCandidate}>
                        <FiUserCheck className="me-2" /> Complete & Call Next
                      </button>
                      <button className="btn btn-outline-danger btn-sm" onClick={handleMarkAbsent}>
                        <FiUserMinus className="me-2" /> Mark Absent
                      </button>
                    </div>
                  </div>
                  <div className="col-md-5 text-center mt-3 mt-md-0 border-start ps-4">
                    <div className="d-flex flex-column align-items-center justify-content-center h-100">
                      <FiClock className="text-primary display-4 mb-2" />
                      <span className="fw-bold text-muted small d-block">Estimated Waiting Time</span>
                      <h4 className="fw-bold text-primary mb-0">{queueData.queue.estimatedWaitTime} Minutes</h4>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <FiUsers className="text-muted display-4 mb-2" />
                  <h6 className="fw-bold text-dark">Queue Active — No Active Candidate called yet</h6>
                  <p className="text-muted small mb-3">Click below to call the very first student from the queue.</p>
                  <button className="btn btn-primary btn-sm px-4 fw-bold" onClick={handleNextCandidate}>
                    <FiUserCheck className="me-2" /> Call First Applicant
                  </button>
                </div>
              )}
            </div>

            {/* Quick Analytics Cards */}
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <div className="premium-card p-3 d-flex align-items-center gap-3 bg-white shadow-sm border border-light">
                  <div className="rounded-circle bg-primary-light text-primary d-flex align-items-center justify-content-center" style={{ width: 44, height: 44 }}>
                    <FiUsers className="fs-5" />
                  </div>
                  <div>
                    <h6 className="text-muted small mb-0 fw-medium">Remaining Queue</h6>
                    <h4 className="fw-bold text-dark mb-0">{queueData.analytics.totalWaiting} Candidates</h4>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="premium-card p-3 d-flex align-items-center gap-3 bg-white shadow-sm border border-light">
                  <div className="rounded-circle bg-success-light text-success d-flex align-items-center justify-content-center" style={{ width: 44, height: 44 }}>
                    <FiCheckCircle className="fs-5" />
                  </div>
                  <div>
                    <h6 className="text-muted small mb-0 fw-medium">Completed</h6>
                    <h4 className="fw-bold text-dark mb-0">{queueData.analytics.totalInterviewed} Candidates</h4>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="premium-card p-3 d-flex align-items-center gap-3 bg-white shadow-sm border border-light">
                  <div className="rounded-circle bg-danger-light text-danger d-flex align-items-center justify-content-center" style={{ width: 44, height: 44 }}>
                    <FiAward className="fs-5" />
                  </div>
                  <div>
                    <h6 className="text-muted small mb-0 fw-medium">Completion Ratio</h6>
                    <h4 className="fw-bold text-dark mb-0">{queueData.analytics.completionRatio}%</h4>
                  </div>
                </div>
              </div>
            </div>

            {/* Complete Participant Progression Timeline */}
            <div className="premium-card p-4">
              <h6 className="fw-bold mb-3 text-dark">Live Placement Drive Lineup</h6>
              {queueData.participants?.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead>
                      <tr>
                        <th>Queue Position</th>
                        <th>Student Details</th>
                        <th>Course / Grade</th>
                        <th>Drive Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {queueData.participants
                        .sort((a, b) => {
                          if (a.queuePosition === 0) return 1;
                          if (b.queuePosition === 0) return -1;
                          return a.queuePosition - b.queuePosition;
                        })
                        .map((p, index) => (
                          <tr key={p._id} className={p.interviewStatus === 'current' ? 'table-primary-light' : ''}>
                            <td className="ps-3 fw-bold">
                              {p.queuePosition > 0 ? `#${p.queuePosition}` : '—'}
                            </td>
                            <td>
                              <div>
                                <span className="fw-bold text-dark d-block">{p.student?.name}</span>
                                <span className="text-muted small">{p.student?.email}</span>
                              </div>
                            </td>
                            <td>
                              <span className="small text-muted block">{p.studentProfile?.courseName || 'Fullstack'}</span>
                              <span className="badge bg-secondary-light text-secondary ms-2">{p.studentProfile?.courseGrade || 'A'}</span>
                            </td>
                            <td>
                              <span className={`badge text-capitalize px-3 py-1.5 rounded-pill ${
                                p.interviewStatus === 'current' ? 'bg-danger text-white animate-pulse' :
                                p.interviewStatus === 'completed' ? 'bg-success-light text-success' :
                                p.interviewStatus === 'turn_near' ? 'bg-warning-light text-warning' :
                                p.interviewStatus === 'absent' ? 'bg-danger-light text-danger' :
                                'bg-light text-dark'
                              }`}>
                                {p.interviewStatus.replace('_', ' ')}
                              </span>
                            </td>
                            <td>
                              {p.queuePosition === 1 && (
                                <button className="btn btn-sm btn-outline-warning" onClick={handleSkipCandidate}>
                                  Delay
                                </button>
                              )}
                              {p.interviewStatus === 'waiting' && <span className="text-muted small">In Line</span>}
                              {p.interviewStatus === 'completed' && <FiCheckCircle className="text-success fs-5 ms-2" />}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4">
                  <span className="text-muted small">No applicants in queue drive.</span>
                </div>
              )}
            </div>
          </div>

          {/* Right sidebar queue operations summary log */}
          <div className="col-lg-4">
            <div className="premium-card p-4 bg-white h-100 shadow-sm border border-light">
              <h5 className="fw-bold mb-3 text-dark">Dossier Details</h5>
              <p className="text-muted small mb-4">
                Verify candidates before promoting line. Ensure correct attendance marks are registered in real time.
              </p>

              <div className="border rounded p-3 mb-4 bg-light">
                <span className="fw-bold text-muted small d-block mb-1">Company Host</span>
                <span className="fw-medium text-dark">{queueData.queue.company?.companyName}</span>
                <hr className="my-2" />
                <span className="fw-bold text-muted small d-block mb-1">Drive Venue</span>
                <span className="fw-medium text-primary"><FiChevronRight className="me-1"/> {queueData.queue.venue}</span>
              </div>

              <div className="p-3 border border-dashed rounded text-center">
                <FiUsers className="text-muted fs-3 mb-2" />
                <h6 className="fw-bold mb-1">Automated AI Call Broadcasts</h6>
                <p className="text-muted small mb-0">
                  Calling sequences automatically launch via browser speech alerts for candidates with positions 1 and 0.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageTransition>
  );
};

export default QueueDashboard;
