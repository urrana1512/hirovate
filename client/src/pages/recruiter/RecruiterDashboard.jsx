import { useState, useEffect } from 'react';
import PageTransition from '../../components/PageTransition';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import { 
  FiBriefcase, 
  FiUsers, 
  FiAward, 
  FiCalendar, 
  FiClock, 
  FiActivity, 
  FiCompass 
} from 'react-icons/fi';

const RecruiterDashboard = () => {
  const [stats, setStats] = useState({
    totalApplicants: 0,
    shortlistedCount: 0,
    selectedCount: 0,
    rejectedCount: 0,
    activeJobsCount: 0,
    totalSlots: 0,
    capacityLeft: 0,
    trendData: []
  });
  const [eventSettings, setEventSettings] = useState({
    startDate: '2027-03-30',
    endDate: '2027-03-31',
    eventName: 'JobFest 2027',
    organizer: 'TOPS Technologies'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const settingsRes = await api.get('/settings');
        if (settingsRes.data.success && settingsRes.data.data) {
          setEventSettings(settingsRes.data.data);
        }

        const res = await api.get('/recruiter/dashboard');
        setStats(res.data.data);
      } catch (error) {
        toast.error('Failed to load dashboard metrics');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const statCards = [
    { title: 'Active Jobs', count: stats.activeJobsCount, icon: <FiBriefcase />, color: 'primary' },
    { title: 'Total Applicants', count: stats.totalApplicants, icon: <FiUsers />, color: 'info' },
    { title: 'Shortlisted Pool', count: stats.shortlistedCount, icon: <FiAward />, color: 'success' },
    { title: 'Interviews Booked', count: stats.totalSlots, icon: <FiCalendar />, color: 'warning' },
  ];

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
      {/* Welcome Banner */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-primary mb-1">Company Dashboard</h2>
          <p className="text-muted mb-0">Monitor active vacancies, schedule interview boards, and evaluate talent yields.</p>
        </div>
      </div>

      {/* Organizer date alert banner for recruiter */}
      <div className="alert alert-warning border-0 rounded-4 p-4 mb-4 d-flex align-items-center justify-content-between flex-wrap gap-3 position-relative overflow-hidden shadow-sm">
        <div className="position-absolute top-0 end-0 bg-warning opacity-10 rounded-circle" style={{ width: 120, height: 120, transform: 'translate(20%, -20%)' }}></div>
        <div className="z-1">
          <span className="badge bg-warning text-dark mb-2 px-3 py-1.5 rounded-pill fw-bold text-uppercase tracking-wider" style={{ fontSize: '0.7rem' }}>Event Period Verification</span>
          <h4 className="fw-bold text-dark mb-1">{eventSettings.eventName} Placement Drive</h4>
          <p className="mb-0 text-dark opacity-90 small">Coordinated by <strong>{eventSettings.organizer}</strong> | Drive Dates: <strong>{new Date(eventSettings.startDate).toLocaleDateString()} to {new Date(eventSettings.endDate).toLocaleDateString()}</strong></p>
        </div>
        <Link to="/recruiter/slots" className="btn btn-dark text-white fw-bold px-4 py-2.5 rounded-pill shadow-sm z-1">Configure Slots</Link>
      </div>

      {/* Stats Bento Grid */}
      <div className="row g-4 mb-4">
        {statCards.map((card, i) => (
          <div className="col-md-3 col-sm-6" key={i}>
            <div className="premium-card p-4 d-flex align-items-center justify-content-between hover-lift">
              <div>
                <span className="text-muted small d-block mb-1">{card.title}</span>
                <h3 className="fw-bold text-dark mb-0">{card.count}</h3>
              </div>
              <div className={`rounded-circle bg-${card.color}-light text-${card.color} p-3 display-6`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <div className="premium-card p-4 h-100">
            <h5 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2"><FiActivity className="text-primary"/> Daily Traffic Funnel</h5>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <AreaChart data={stats.trendData}>
                  <defs>
                    <linearGradient id="colorApplicants" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary-color)" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="var(--primary-color)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
                  <YAxis stroke="var(--text-muted)" />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
                  <Area type="monotone" dataKey="value" stroke="var(--primary-color)" strokeWidth={2} fillOpacity={1} fill="url(#colorApplicants)" name="Candidates Applied" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="premium-card p-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <h5 className="fw-bold text-dark mb-3">Interview Attendance Yield</h5>
              <p className="text-muted small">Real-time attendance ratio monitored for candidates arriving at booked slots during {eventSettings.eventName}.</p>
              <hr />
              <div className="mb-3">
                <span className="text-muted small d-block">Scheduled Interview Time Slots</span>
                <h4 className="fw-bold text-dark mt-1">{stats.totalSlots} Slots generated</h4>
              </div>
              <div className="mb-3">
                <span className="text-muted small d-block">Configured Capacity Utilized</span>
                <h4 className="fw-bold text-success mt-1">{stats.capacityLeft} Seats Reserved</h4>
              </div>
            </div>
            <Link to="/recruiter/jobs" className="btn btn-outline-primary w-100 py-2.5 fw-bold">Manage Job Vacancies</Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default RecruiterDashboard;
