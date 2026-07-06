import { useState, useEffect } from 'react';
import PageTransition from '../../components/PageTransition';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { FiCalendar, FiMapPin, FiCompass } from 'react-icons/fi';

const StudentDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [eventSettings, setEventSettings] = useState({
    startDate: '2027-03-30',
    endDate: '2027-03-31',
    eventName: 'Hirovate 2027',
    organizer: 'Hirovate Technologies'
  });
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const settingsRes = await api.get('/settings');
        if (settingsRes.data.success && settingsRes.data.data) {
          setEventSettings(settingsRes.data.data);
        }

        const res = await api.get('/student/dashboard');
        setData(res.data.data);
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
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
          <h2 className="fw-bold text-primary mb-1">Welcome back, {user.name?.split(' ')[0] || 'Student'}! 👋</h2>
          <p className="text-muted mb-0">Here is your placement activity overview.</p>
        </div>
        <Link to="/student/jobs" className="btn btn-accent premium-card">Browse Jobs</Link>
      </div>

      {/* Dynamic Announcement Banner */}
      <div className="alert alert-primary border-0 rounded-4 p-4 mb-4 d-flex align-items-center justify-content-between flex-wrap gap-3 position-relative overflow-hidden shadow-sm" style={{ background: 'linear-gradient(45deg, var(--primary-color), var(--primary-dark))' }}>
        <div className="position-absolute top-0 end-0 bg-white opacity-10 rounded-circle" style={{ width: 150, height: 150, transform: 'translate(20%, -20%)' }}></div>
        <div className="z-1 text-white">
          <span className="badge bg-white text-primary mb-2 px-3 py-1.5 rounded-pill fw-bold text-uppercase tracking-wider" style={{ fontSize: '0.7rem' }}>Official Event Notice</span>
          <h4 className="fw-bold text-white mb-1">{eventSettings.eventName}</h4>
          <p className="mb-0 text-white opacity-90 small">Organized & Managed by <strong>{eventSettings.organizer}</strong> | Drive Dates: <strong>{new Date(eventSettings.startDate).toLocaleDateString()} — {new Date(eventSettings.endDate).toLocaleDateString()}</strong></p>
        </div>
        <Link to="/student/jobs" className="btn btn-light text-primary fw-bold px-4 py-2.5 rounded-pill shadow-sm z-1">Explore Openings</Link>
      </div>

      <div className="row g-4 mb-4">
        {[
          { title: 'Applied Companies', count: data?.applicationsCount || 0, color: 'primary' },
          { title: 'Upcoming Interviews', count: data?.upcomingInterviewsCount || 0, color: 'warning' },
          { title: 'Resume Score', count: `${data?.resumeScore || 0}%`, color: 'success' },
          { title: 'Events Attended', count: 0, color: 'info' } // Mock for now
        ].map((stat, index) => (
          <div className="col-md-6 col-lg-3" key={index}>
            <div className="premium-card p-4 h-100 border-start border-4" style={{ borderLeftColor: `var(--${stat.color}-color)` }}>
              <p className="text-muted mb-2 fw-medium">{stat.title}</p>
              <h3 className="fw-bold mb-0">{stat.count}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="premium-card p-4 mb-4">
            <h5 className="fw-bold mb-4">Activity Timeline</h5>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <AreaChart data={data?.timeline || []} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary-color)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="var(--primary-color)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="title" stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
                  <YAxis stroke="var(--text-muted)" />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
                  <Area type="monotone" dataKey="id" stroke="var(--primary-color)" fillOpacity={1} fill="url(#colorApps)" name="Activity Intensity" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="premium-card p-4">
            <h5 className="fw-bold mb-4">Skill Analytics</h5>
            <div style={{ width: '100%', height: 250 }}>
              <ResponsiveContainer>
                <BarChart data={data?.skillAnalytics || []} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
                  <YAxis stroke="var(--text-muted)" />
                  <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
                  <Bar dataKey="value" fill="var(--accent-color)" radius={[4, 4, 0, 0]} name="Skill Level (%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="premium-card p-4 h-100">
            <h5 className="fw-bold mb-3">Profile Completion</h5>
            <div className="mb-2 d-flex justify-content-between small">
              <span className="text-muted">Progress</span>
              <span className="fw-bold text-success">{data?.profileCompletion || 10}%</span>
            </div>
            <div className="progress mb-4" style={{ height: '8px' }}>
              <div className="progress-bar bg-success" role="progressbar" style={{ width: `${data?.profileCompletion || 10}%` }}></div>
            </div>

            <h5 className="fw-bold mb-4">Upcoming Schedule</h5>
            <div className="d-flex flex-column gap-3">
              {data?.upcomingInterviewsCount > 0 ? (
                <div className="p-3 border rounded-3 position-relative overflow-hidden">
                  <div className="position-absolute top-0 start-0 w-100 h-100 bg-accent opacity-10"></div>
                  <h6 className="fw-bold text-accent mb-1">Interview Scheduled</h6>
                  <p className="small text-muted mb-2">Check your slots tab for details</p>
                </div>
              ) : (
                <div className="p-4 text-center border rounded-3 bg-light">
                  <p className="text-muted mb-0 small">No upcoming interviews</p>
                </div>
              )}
            </div>

            <hr className="my-4" />
            
            <p className="small text-muted mt-3">
              Keep your profile updated and apply to more companies to increase your chances.
            </p>
            <Link to="/student/profile" className="btn btn-outline-primary w-100 mt-2">Update Profile</Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default StudentDashboard;
