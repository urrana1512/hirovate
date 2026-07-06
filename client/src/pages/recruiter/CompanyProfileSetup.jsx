import { useState, useEffect } from 'react';
import PageTransition from '../../components/PageTransition';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FiSave, FiEdit, FiGlobe, FiMapPin, FiUser } from 'react-icons/fi';

const parseTimeParts = (timeStr) => {
  const defaultVal = { hour: '09', minute: '00', ampm: 'AM' };
  if (!timeStr) return defaultVal;
  
  // If it's 24h clock, convert it to 12h AM/PM for selector compatibility
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

const CompanyProfileSetup = () => {
  const [profile, setProfile] = useState({
    companyName: '',
    industry: '',
    location: '',
    website: '',
    description: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/recruiter/profile');
        setProfile(res.data.data);
      } catch (error) {
        toast.error('Failed to load profile details');
      }
    };
    fetchProfile();
  }, []);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
    if (!allowedExtensions.exec(file.name)) {
      toast.error('Only JPG, JPEG, or PNG images are allowed!');
      e.target.value = '';
      return;
    }

    if (file.size > 1024 * 1024) {
      toast.error('Image size must be strictly under 1MB!');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setProfile(prev => ({
        ...prev,
        logoUrl: reader.result
      }));
    };
    reader.readAsDataURL(file);
    toast.success('Logo loaded successfully!');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/recruiter/profile', profile);
      setProfile(res.data.data);
      setIsEditing(false);
      toast.success('Company profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageTransition>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-primary mb-1">Company Workspace</h2>
          <p className="text-muted mb-0">Configure company bio, official urls, and location maps for student view boards.</p>
        </div>
        {!isEditing && (
          <button className="btn btn-outline-primary d-flex align-items-center gap-2" onClick={() => setIsEditing(true)}>
            <FiEdit /> Edit Details
          </button>
        )}
      </div>

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="premium-card p-4 text-center">
            {!isEditing ? (
              profile.logoUrl ? (
                <img 
                  src={profile.logoUrl} 
                  alt="Company Logo" 
                  className="rounded-circle mb-3 border border-4 border-light shadow-sm"
                  style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                />
              ) : (
                <div className="rounded-circle bg-primary-light text-primary mx-auto mb-3 d-flex align-items-center justify-content-center fw-bold" style={{ width: 80, height: 80, fontSize: '2rem' }}>
                  {profile.companyName?.charAt(0) || 'C'}
                </div>
              )
            ) : (
              <div className="position-relative d-inline-block mx-auto mb-3">
                {profile.logoUrl ? (
                  <img 
                    src={profile.logoUrl} 
                    alt="Company Logo" 
                    className="rounded-circle border border-4 border-light shadow-sm"
                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                  />
                ) : (
                  <div className="rounded-circle bg-primary-light text-primary d-flex align-items-center justify-content-center fw-bold" style={{ width: 80, height: 80, fontSize: '2rem' }}>
                    {profile.companyName?.charAt(0) || 'C'}
                  </div>
                )}
                <label 
                  className="btn btn-sm btn-primary rounded-circle position-absolute bottom-0 end-0 d-flex align-items-center justify-content-center" 
                  style={{ width: 28, height: 28, cursor: 'pointer', padding: 0 }}
                  title="Change Company Logo"
                >
                  <span style={{ fontSize: '1.1rem', lineHeight: '24px', fontWeight: 'bold' }}>+</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="d-none" 
                    onChange={handleLogoChange} 
                  />
                </label>
              </div>
            )}
            <h5 className="fw-bold text-dark mb-1">{profile.companyName}</h5>
            <span className="badge bg-primary-light text-primary mb-4 px-3 py-2 rounded-pill text-capitalize">{profile.industry || 'Tech'}</span>

            <hr className="my-4" />

            <div className="text-start d-flex flex-column gap-3 small text-muted">
              <div className="d-flex align-items-center gap-2"><FiGlobe /> <a href={profile.website} target="_blank" rel="noreferrer" className="text-decoration-none">{profile.website || 'N/A'}</a></div>
              <div className="d-flex align-items-center gap-2"><FiMapPin /> <span>{profile.location || 'N/A'}</span></div>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="premium-card p-4">
            <form onSubmit={handleSave}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">Company Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={profile.companyName} 
                    onChange={e => setProfile({ ...profile, companyName: e.target.value })}
                    disabled={!isEditing} 
                    required 
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">Industry Domain</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={profile.industry} 
                    onChange={e => setProfile({ ...profile, industry: e.target.value })}
                    disabled={!isEditing} 
                    required 
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">Website Link</label>
                  <input 
                    type="url" 
                    className="form-control" 
                    value={profile.website} 
                    onChange={e => setProfile({ ...profile, website: e.target.value })}
                    disabled={!isEditing} 
                    required 
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">Headquarters Location</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={profile.location} 
                    onChange={e => setProfile({ ...profile, location: e.target.value })}
                    disabled={!isEditing} 
                    required 
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-semibold text-muted">Corporate Description</label>
                  <textarea 
                    className="form-control" 
                    rows="6"
                    value={profile.description} 
                    onChange={e => setProfile({ ...profile, description: e.target.value })}
                    disabled={!isEditing} 
                    required 
                  />
                </div>

                {/* JobFest Driving Days Attendance Hours */}
                <div className="col-12 mt-4">
                  <h6 className="fw-bold text-primary border-bottom pb-2 mb-3">JobFest Attendance Schedules</h6>
                  <div className="row g-3">
                    {profile.attendanceTimings && profile.attendanceTimings.length > 0 ? (
                      profile.attendanceTimings.map((timing, index) => (
                        <div className="col-md-6" key={index}>
                          <div className="p-3 border rounded-3 bg-light">
                            <div className="d-flex align-items-center justify-content-between mb-2">
                              <span className="fw-bold text-dark">Day {index + 1}: {new Date(timing.date).toLocaleDateString()}</span>
                              {isEditing ? (
                                <div className="form-check form-switch ms-0">
                                  <input 
                                    className="form-check-input" 
                                    type="checkbox" 
                                    checked={timing.attending} 
                                    onChange={(e) => {
                                      const updated = [...profile.attendanceTimings];
                                      updated[index].attending = e.target.checked;
                                      setProfile({ ...profile, attendanceTimings: updated });
                                    }}
                                  />
                                </div>
                              ) : (
                                <span className={`badge ${timing.attending ? 'bg-success' : 'bg-secondary'} rounded-pill`}>
                                  {timing.attending ? 'Attending' : 'Not Attending'}
                                </span>
                              )}
                            </div>

                            {timing.attending && (
                              <div className="mt-3">
                                <div className="mb-2">
                                  <label className="form-label small mb-1 text-muted d-block" style={{ fontSize: '0.75rem' }}>Coming Time</label>
                                  <TimeSelectGroup 
                                    value={timing.startTime}
                                    onChange={(val) => {
                                      const updated = [...profile.attendanceTimings];
                                      updated[index].startTime = val;
                                      setProfile({ ...profile, attendanceTimings: updated });
                                    }}
                                    disabled={!isEditing}
                                  />
                                </div>
                                <div>
                                  <label className="form-label small mb-1 text-muted d-block" style={{ fontSize: '0.75rem' }}>Leaving Time</label>
                                  <TimeSelectGroup 
                                    value={timing.endTime}
                                    onChange={(val) => {
                                      const updated = [...profile.attendanceTimings];
                                      updated[index].endTime = val;
                                      setProfile({ ...profile, attendanceTimings: updated });
                                    }}
                                    disabled={!isEditing}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted small col-12 mb-0">No attendance hours initialized yet. Save details to generate.</p>
                    )}
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="d-flex gap-2 justify-content-end mt-4">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary d-flex align-items-center gap-2" disabled={saving}>
                    <FiSave /> {saving ? 'Saving...' : 'Save Configuration'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default CompanyProfileSetup;
