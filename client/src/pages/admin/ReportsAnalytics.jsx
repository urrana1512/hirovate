import { useState, useEffect } from 'react';
import PageTransition from '../../components/PageTransition';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FiDownload, FiTrendingUp } from 'react-icons/fi';

const ReportsAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        setStats(res.data.data);
      } catch (error) {
        toast.error('Failed to load drive statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
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

  const reportsData = [
    { name: 'Students', count: stats?.totalStudents || 0 },
    { name: 'Companies', count: stats?.totalCompanies || 0 },
    { name: 'Job Openings', count: stats?.totalJobs || 0 },
    { name: 'Applications', count: stats?.totalApplications || 0 }
  ];

  return (
    <PageTransition>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-primary mb-1">Campus Placement Reports</h2>
          <p className="text-muted mb-0">Evaluate student conversions, drive registrations, and download excel logs.</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary d-flex align-items-center gap-2" onClick={() => toast.success('Mega Campus Placement drive Excel compiled!')}>
            <FiDownload /> Export Excel
          </button>
          <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => toast.success('Drive Analytics PDF compiled!')}>
            <FiDownload /> Export PDF
          </button>
        </div>
      </div>

      <div className="premium-card p-4">
        <h5 className="fw-bold mb-4"><FiTrendingUp className="text-primary me-2"/> Platform Growth Metrics</h5>
        <div style={{ width: '100%', height: 360 }}>
          <ResponsiveContainer>
            <BarChart data={reportsData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
              <YAxis stroke="var(--text-muted)" />
              <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
              <Bar dataKey="count" fill="var(--primary-color)" radius={[4, 4, 0, 0]} name="Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </PageTransition>
  );
};

export default ReportsAnalytics;
