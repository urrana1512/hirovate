import { useState, useEffect } from 'react';
import PageTransition from '../../components/PageTransition';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FiAward, FiPlus, FiTrash, FiExternalLink } from 'react-icons/fi';

const Certificates = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCert, setNewCert] = useState({ name: '', issuer: '', date: '', url: '' });

  const fetchProfile = async () => {
    try {
      const res = await api.get('/student/profile');
      setProfile(res.data.data);
    } catch (error) {
      toast.error('Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newCert.name || !newCert.issuer) {
      return toast.warn('Certification name and issuer are required!');
    }
    try {
      const updatedCerts = [...(profile.certifications || []), newCert];
      await api.put('/student/profile', { certifications: updatedCerts });
      toast.success('Certificate added successfully!');
      setNewCert({ name: '', issuer: '', date: '', url: '' });
      setShowAddForm(false);
      fetchProfile();
    } catch (error) {
      toast.error('Failed to add certificate');
    }
  };

  const handleDelete = async (index) => {
    try {
      const updatedCerts = [...(profile.certifications || [])];
      updatedCerts.splice(index, 1);
      await api.put('/student/profile', { certifications: updatedCerts });
      toast.success('Certificate deleted successfully');
      fetchProfile();
    } catch (error) {
      toast.error('Failed to delete certificate');
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

  const certificates = profile?.certifications || [];

  return (
    <PageTransition>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-primary mb-1">My Certifications</h2>
          <p className="text-muted mb-0">Manage, preview, and showcase your professional course credentials.</p>
        </div>
        <button 
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <FiPlus /> {showAddForm ? 'Hide Form' : 'Add Certification'}
        </button>
      </div>

      {showAddForm && (
        <div className="premium-card p-4 mb-4 bg-white border border-primary">
          <h5 className="fw-bold mb-3 text-dark">Add New Certificate</h5>
          <form onSubmit={handleAdd}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Certification Title</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={newCert.name}
                  onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
                  placeholder="e.g., AWS Cloud Practitioner"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Issuing Authority</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={newCert.issuer}
                  onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                  placeholder="e.g., Amazon Web Services"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Credential URL (optional)</label>
                <input 
                  type="url" 
                  className="form-control" 
                  value={newCert.url}
                  onChange={(e) => setNewCert({ ...newCert, url: e.target.value })}
                  placeholder="e.g., https://creds.com/aws123"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Issue Date</label>
                <input 
                  type="date" 
                  className="form-control" 
                  value={newCert.date}
                  onChange={(e) => setNewCert({ ...newCert, date: e.target.value })}
                />
              </div>
              <div className="col-12 text-end mt-4">
                <button type="submit" className="btn btn-primary px-4 py-2">Add Credentials</button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="row g-4">
        {certificates.length > 0 ? (
          certificates.map((cert, index) => (
            <div className="col-md-6 col-lg-4" key={index}>
              <div className="premium-card p-4 h-100 hover-lift d-flex flex-column">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="p-3 rounded bg-primary-light text-primary">
                    <FiAward size={28} />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1 text-dark">{cert.name}</h5>
                    <span className="text-muted small">{cert.issuer}</span>
                  </div>
                </div>

                <p className="text-muted small mb-4">
                  Issued: {cert.date ? new Date(cert.date).toLocaleDateString() : 'N/A'}
                </p>

                <div className="d-flex gap-2 mt-auto">
                  {cert.url && (
                    <a 
                      href={cert.url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="btn btn-sm btn-outline-primary flex-grow-1 py-2 fw-medium d-flex align-items-center justify-content-center gap-1"
                    >
                      <FiExternalLink /> Verify
                    </a>
                  )}
                  <button 
                    className="btn btn-sm btn-outline-danger py-2"
                    onClick={() => handleDelete(index)}
                  >
                    <FiTrash />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <FiAward className="text-muted display-4 mb-3" />
            <h5 className="fw-bold text-dark">No Certificates Added Yet</h5>
            <p className="text-muted small">Showcase your verified technical course badges to recruiters today.</p>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default Certificates;
