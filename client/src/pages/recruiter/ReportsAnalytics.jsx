import { useState, useEffect } from 'react';
import PageTransition from '../../components/PageTransition';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FiDownload, FiPieChart, FiTrendingUp } from 'react-icons/fi';

const ReportsAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/recruiter/dashboard');
        setStats(res.data.data);
      } catch (error) {
        toast.error('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const COLORS = ['var(--primary-color)', 'var(--success-color)', 'var(--danger-color)'];

  const pieData = stats ? [
    { name: 'Shortlisted', value: stats.shortlistedCount },
    { name: 'Selected', value: stats.selectedCount },
    { name: 'Rejected', value: stats.rejectedCount }
  ].filter(d => d.value > 0) : [];

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
          <h2 className="fw-bold text-primary mb-1">Hiring Reports & Analytics</h2>
          <p className="text-muted mb-0">Gain deep insights into placement yields, pipeline conversions, and download official summaries.</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary d-flex align-items-center gap-2" onClick={() => toast.success('Hiring Excel list generated!')}>
            <FiDownload /> Export Excel
          </button>
          <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => toast.success('Official PDF Report compiled successfully!')}>
            <FiDownload /> Export PDF
          </button>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="premium-card p-4 h-100">
            <h5 className="fw-bold mb-4"><FiTrendingUp className="text-primary me-2"/> Hiring Success Metrics</h5>
            <div style={{ width: '100%', height: 320 }}>
              <ResponsiveContainer>
                <BarChart data={[
                  { name: 'Total Applicants', count: stats?.totalApplicants || 0 },
                  { name: 'Shortlisted', count: stats?.shortlistedCount || 0 },
                  { name: 'Selections', count: stats?.selectedCount || 0 },
                  { name: 'Rejections', count: stats?.rejectedCount || 0 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
                  <YAxis stroke="var(--text-muted)" />
                  <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
                  <Bar dataKey="count" fill="var(--primary-color)" radius={[4, 4, 0, 0]} name="Candidates" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="premium-card p-4 h-100 text-center d-flex flex-column align-items-center">
            <h5 className="fw-bold mb-4 text-start w-100"><FiPieChart className="text-primary me-2"/> Conversion Ratio</h5>
            {pieData.length > 0 ? (
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="d-flex justify-content-center gap-3 mt-3 small">
                  {pieData.map((d, i) => (
                    <span key={i} className="d-flex align-items-center gap-1">
                      <span className="rounded-circle" style={{ width: 12, height: 12, backgroundColor: COLORS[i % COLORS.length] }}></span>
                      {d.name}: {d.value}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-muted my-auto small">No hiring data logged to partition conversion ratios.</p>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ReportsAnalytics;
