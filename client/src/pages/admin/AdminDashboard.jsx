import { useState, useEffect } from 'react';
import PageTransition from '../../components/PageTransition';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FiUsers, FiBriefcase, FiCheckSquare, FiPieChart, FiActivity, FiTrendingUp } from 'react-icons/fi';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalRecruiters: 0,
    totalCompanies: 0,
    totalJobs: 0,
    totalApplications: 0,
    totalSlots: 0,
    pendingRecruiters: []
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/dashboard');
      setStats(res.data.data);
    } catch (error) {
      toast.error('Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.put(`/admin/users/${id}/status`, { status: 'approved' });
      toast.success('Recruiter account approved successfully!');
      fetchStats();
    } catch (error) {
      toast.error('Failed to approve account');
    }
  };

  const trendData = [
    { name: 'Mon', active: 30 },
    { name: 'Tue', active: 45 },
    { name: 'Wed', active: 28 },
    { name: 'Thu', active: 64 },
    { name: 'Fri', active: 40 }
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

  const cards = [
    { title: 'Registered Students', count: stats.totalStudents, icon: <FiUsers />, color: 'primary' },
    { title: 'Hiring Recruiters', count: stats.totalRecruiters, icon: <FiUsers />, color: 'info' },
    { title: 'Mapped vacancies', count: stats.totalJobs, icon: <FiBriefcase />, color: 'success' },
    { title: 'Drive Bookings', count: stats.totalSlots, icon: <FiCheckSquare />, color: 'warning' },
  ];

  return (
    <PageTransition>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-primary mb-1">Placement Control Center</h2>
          <p className="text-muted mb-0">Monitor platform growth, verify incoming accounts, and coordinate drive schedules.</p>
        </div>
      </div>

      <div className="row g-4 mb-4">
        {cards.map((card, i) => (
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

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="premium-card p-4 h-100">
            <h5 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2"><FiActivity className="text-primary"/> Campus Activity Funnel</h5>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary-color)" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="var(--primary-color)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
                  <YAxis stroke="var(--text-muted)" />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
                  <Area type="monotone" dataKey="active" stroke="var(--primary-color)" strokeWidth={2} fillOpacity={1} fill="url(#colorActive)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="premium-card p-4 h-100 d-flex flex-column">
            <h5 className="fw-bold text-dark mb-3"><FiTrendingUp className="text-primary me-2"/> Approvals Required</h5>
            
            <div className="d-flex flex-column gap-3 mt-2 overflow-auto" style={{ maxHeight: 280 }}>
              {stats.pendingRecruiters.length > 0 ? (
                stats.pendingRecruiters.map(rec => (
                  <div key={rec._id} className="p-3 border rounded-3 bg-light d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="fw-bold mb-1 small text-dark">{rec.name}</h6>
                      <span className="text-muted small d-block" style={{ fontSize: '0.75rem' }}>{rec.email}</span>
                    </div>
                    <button className="btn btn-sm btn-primary" onClick={() => handleApprove(rec._id)}>
                      Approve
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-muted small text-center my-auto">No pending recruiter approvals.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default AdminDashboard;
