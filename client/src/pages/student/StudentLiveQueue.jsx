import { useState, useEffect, useRef } from 'react';
import PageTransition from '../../components/PageTransition';
import api from '../../services/api';
import { socket } from '../../services/socket';
import { toast } from 'react-toastify';
import { FiClock, FiMapPin, FiUser, FiInfo, FiVolume2, FiPhoneCall, FiPhoneOff, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const StudentLiveQueue = () => {
  const [liveQueue, setLiveQueue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  
  // Call simulator states
  const [incomingCall, setIncomingCall] = useState(false);
  const [callActive, setCallActive] = useState(false);
  const [callerName, setCallerName] = useState('Hirovate Calling...');
  const [callMessage, setCallMessage] = useState('');
  
  const lastStatusRef = useRef('');

  const fetchStudentQueue = async () => {
    try {
      const res = await api.get('/queue/student');
      setLiveQueue(res.data.data);
      
      const notifRes = await api.get('/queue/notifications');
      setNotifications(notifRes.data.data || []);
      
      if (res.data.data) {
        const participant = res.data.data.participant;
        const status = participant.interviewStatus;
        
        // Trigger simulated voice calling sequence on state promotion
        if (status !== lastStatusRef.current) {
          if (status === 'turn_near') {
            triggerVoiceCall(
              `Hello ${participant.studentProfile?.firstName || 'Student'}, your interview turn for ${res.data.data.queue?.company?.companyName} - ${res.data.data.queue?.job?.title} is coming soon. Please be present at your allocated venue: ${res.data.data.queue?.venue}. Thank you for using Hirovate.`
            );
          } else if (status === 'current') {
            triggerVoiceCall(
              `Hello ${participant.studentProfile?.firstName || 'Student'}, your interview turn has arrived! Please report immediately at the interview venue: ${res.data.data.queue?.venue}.`
            );
          }
          lastStatusRef.current = status;
        }
      }
    } catch (err) {
      console.error('Failed to load live student queue drive:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentQueue();

    // Setup real-time Socket.IO listeners
    socket.on('queue_updated', () => {
      console.log('[Socket] Queue status updated in real-time');
      fetchStudentQueue();
    });

    return () => {
      socket.off('queue_updated');
    };
  }, []);

  const triggerVoiceCall = (textMessage) => {
    setCallMessage(textMessage);
    setIncomingCall(true);
    
    // Play mock browser alert ring sound if allowed
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      osc.start();
      setTimeout(() => {
        osc.stop();
      }, 800);
    } catch (e) {
      console.warn('Audio ringtone oscillation blocked by browser interaction policies');
    }
  };

  const handleAcceptCall = () => {
    setIncomingCall(false);
    setCallActive(true);
    
    // Web Speech API Synthesis for natural sound
    if ('speechSynthesis' in window) {
      // Cancel active speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(callMessage);
      utterance.rate = 0.95; // Slightly slower for clear English pronunciation
      utterance.pitch = 1.0;
      
      // Select premium voice if available
      const voices = window.speechSynthesis.getVoices();
      const enVoice = voices.find(v => v.lang.includes('en') && v.name.includes('Google'));
      if (enVoice) utterance.voice = enVoice;

      utterance.onend = () => {
        setCallActive(false);
      };
      
      window.speechSynthesis.speak(utterance);
    } else {
      toast.info('AI Announcement (Text-to-Speech): ' + callMessage);
      setTimeout(() => setCallActive(false), 5000);
    }
  };

  const handleDeclineCall = () => {
    setIncomingCall(false);
    setCallActive(false);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    toast.info('Simulated Call Dismissed.');
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
          <div className="spinner-border text-primary" role="status" />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      {/* 📞 INCOMING SIMULATED CALL OVERLAY */}
      <AnimatePresence>
        {incomingCall && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed-top w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-75"
            style={{ zIndex: 1060 }}
          >
            <motion.div 
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="premium-card p-4 text-center text-white bg-glass border border-secondary"
              style={{ width: 340, background: '#1c1c1e' }}
            >
              <div className="avatar-pulse mb-4 mx-auto d-flex align-items-center justify-content-center bg-primary rounded-circle" style={{ width: 80, height: 80 }}>
                <FiPhoneCall className="fs-1 text-white animate-bounce" />
              </div>
              <h4 className="fw-bold mb-1">{callerName}</h4>
              <p className="text-secondary small mb-4">Live Smart Voice Announcement</p>
              
              <div className="bg-dark rounded p-3 mb-4 text-start border border-secondary" style={{ fontSize: '0.85rem', color: '#eaeaea' }}>
                <FiInfo className="me-1 text-primary"/> Incoming turn voice notifications for your active interview drive.
              </div>

              <div className="d-flex justify-content-around mt-3">
                <button className="btn btn-danger btn-circle rounded-circle" style={{ width: 60, height: 60 }} onClick={handleDeclineCall}>
                  <FiPhoneOff className="fs-4" />
                </button>
                <button className="btn btn-success btn-circle rounded-circle animate-pulse" style={{ width: 60, height: 60 }} onClick={handleAcceptCall}>
                  <FiVolume2 className="fs-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔊 CALL ACTIVE BANNER */}
      {callActive && (
        <div className="alert alert-success d-flex align-items-center justify-content-between p-3 border-0 rounded shadow mb-4" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white' }}>
          <div className="d-flex align-items-center gap-2">
            <FiVolume2 className="fs-4 animate-bounce" />
            <span className="fw-bold small">Active AI Smart Voice Announcement in Progress...</span>
          </div>
          <button className="btn btn-sm btn-outline-light py-1" onClick={handleDeclineCall}>Stop Announcement</button>
        </div>
      )}

      <div className="mb-4">
        <h2 className="fw-bold text-primary mb-1">My Live Interview Turn</h2>
        <p className="text-muted mb-0">Monitor placement drive updates, waiting times, and listen for dynamic voice announcements.</p>
      </div>

      {!liveQueue ? (
        <div className="premium-card p-5 text-center my-4 max-w-md mx-auto">
          <FiClock className="text-muted display-4 mb-3" />
          <h4 className="fw-bold text-dark">No Active Interview Drive Enrolled</h4>
          <p className="text-muted small">
            You will be automatically added here as soon as recruiters start the live queue for your applied job drives.
          </p>
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-lg-8">
            {/* Live Queue Main Board Card */}
            <div className="premium-card p-4 mb-4 border-start border-4 border-primary shadow-sm bg-white">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="badge bg-primary-light text-primary px-3 py-1.5 rounded-pill text-capitalize fw-bold">
                  {liveQueue.participant.interviewStatus.replace('_', ' ')}
                </span>
                <span className="text-muted small">
                  Drive: {liveQueue.queue?.job?.title}
                </span>
              </div>

              <div className="row align-items-center">
                <div className="col-md-6 border-end pe-4">
                  <span className="fw-bold text-muted small d-block mb-1 text-uppercase tracking-wider">Queue Number</span>
                  <div className="d-flex align-items-baseline gap-2">
                    <h1 className="fw-black text-primary display-2 mb-0" style={{ fontWeight: 900 }}>
                      #{liveQueue.participant.queuePosition > 0 ? liveQueue.participant.queuePosition : '—'}
                    </h1>
                  </div>
                  <span className="text-muted small d-block mt-2">
                    {liveQueue.aheadCount > 0 
                      ? `There are ${liveQueue.aheadCount} candidates ahead of you.`
                      : liveQueue.participant.interviewStatus === 'current'
                      ? 'Please report immediately at the venue!'
                      : 'You are next in line!'}
                  </span>
                </div>

                <div className="col-md-6 ps-md-4 mt-3 mt-md-0">
                  <div className="d-flex flex-column gap-3">
                    <div className="d-flex align-items-center gap-3">
                      <div className="rounded-circle bg-primary-light text-primary d-flex align-items-center justify-content-center" style={{ width: 44, height: 44 }}>
                        <FiClock className="fs-5" />
                      </div>
                      <div>
                        <span className="text-muted small d-block">Estimated Waiting Time</span>
                        <h5 className="fw-bold text-dark mb-0">{liveQueue.estimatedWaitMinutes} Minutes</h5>
                      </div>
                    </div>

                    <div className="d-flex align-items-center gap-3">
                      <div className="rounded-circle bg-success-light text-success d-flex align-items-center justify-content-center" style={{ width: 44, height: 44 }}>
                        <FiMapPin className="fs-5" />
                      </div>
                      <div>
                        <span className="text-muted small d-block">Drive Venue</span>
                        <h5 className="fw-bold text-dark mb-0">{liveQueue.queue?.venue}</h5>
                      </div>
                    </div>

                    <div className="d-flex align-items-center gap-3">
                      <div className="rounded-circle bg-info-light text-info d-flex align-items-center justify-content-center" style={{ width: 44, height: 44 }}>
                        <FiUser className="fs-5" />
                      </div>
                      <div>
                        <span className="text-muted small d-block">Company Host</span>
                        <h5 className="fw-bold text-dark mb-0">{liveQueue.queue?.company?.companyName}</h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress bar line */}
              <div className="mt-4 pt-3 border-top">
                <span className="fw-bold text-muted small d-block mb-2">Live Progress Meter</span>
                <div className="progress" style={{ height: 10 }}>
                  <div 
                    className="progress-bar progress-bar-striped progress-bar-animated bg-primary" 
                    role="progressbar" 
                    style={{ width: `${Math.max(10, 100 - (liveQueue.participant.queuePosition * 10))}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Smart voice call triggers */}
            <div className="premium-card p-3 mb-4 bg-primary-light text-primary d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <FiVolume2 className="fs-4 animate-bounce" />
                <span className="small fw-semibold">Interactive Voice Testing Center:</span>
              </div>
              <button 
                className="btn btn-primary btn-sm px-3 rounded-pill fw-bold shadow-sm"
                onClick={() => triggerVoiceCall(`Testing Hirovate AI smart notification. Welcome, ${liveQueue.participant.studentProfile?.firstName || 'Candidate'}. Ready for live drive!`)}
              >
                Test Voice Call Simulator
              </button>
            </div>

            {/* Live Queue Activity Timeline Log */}
            <div className="premium-card p-4 bg-white">
              <h5 className="fw-bold mb-3 text-dark">Live Placement Notifications Drawer</h5>
              {notifications.length > 0 ? (
                <div className="d-flex flex-column gap-3">
                  {notifications.map(n => (
                    <div key={n._id} className="d-flex align-items-start gap-3 p-2 border-bottom">
                      <div className="mt-1">
                        {n.type === 'turn_arrived' ? (
                          <FiAlertCircle className="text-danger fs-4 animate-pulse" />
                        ) : n.type === 'turn_near' ? (
                          <FiVolume2 className="text-warning fs-4" />
                        ) : (
                          <FiCheckCircle className="text-success fs-4" />
                        )}
                      </div>
                      <div>
                        <span className="small fw-bold text-dark block">{n.message}</span>
                        <span className="text-muted block" style={{ fontSize: '0.75rem' }}>{new Date(n.sentAt).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <span className="text-muted small">No notifications logged yet. Keep page open for live logs.</span>
                </div>
              )}
            </div>
          </div>

          {/* Right hand side instructional panel */}
          <div className="col-lg-4">
            <div className="premium-card p-4 bg-white shadow-sm border border-light">
              <h5 className="fw-bold mb-3 text-dark">Queue Instructions</h5>
              <ol className="text-muted small ps-3 mb-0 d-flex flex-column gap-3">
                <li>Keep this live tracker open during the Hirovate placement drive.</li>
                <li>Your queue position and estimated waiting time update automatically via Socket.IO without page refreshes.</li>
                <li>When your turn is near (#1 position), you will receive a simulated <strong>AI voice call alert</strong>. Click the green button to accept and listen to the instructions!</li>
                <li>When your turn arrives, please proceed to <strong>{liveQueue.queue?.venue}</strong> immediately.</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </PageTransition>
  );
};

export default StudentLiveQueue;
