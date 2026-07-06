import { useState, useEffect } from 'react';
import PageTransition from '../../components/PageTransition';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FiBook, FiAward, FiFileText, FiLink, FiShield, FiPlus, FiTrash2 } from 'react-icons/fi';

const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [educations, setEducations] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/student/profile');
        setProfile(res.data.data);
        setEducations(res.data.data.educations || []);
        setFormData({
          salutation: res.data.data.salutation || '',
          firstName: res.data.data.firstName || '',
          lastName: res.data.data.lastName || '',
          contactNumber: res.data.data.contactNumber || '',
          email: res.data.data.email || '',
          dob: res.data.data.dob || '',
          gender: res.data.data.gender || '',
          state: res.data.data.addressDetails?.state || '',
          city: res.data.data.addressDetails?.city || '',
          area: res.data.data.addressDetails?.area || '',
          pincode: res.data.data.addressDetails?.pincode || '',
          address: res.data.data.addressDetails?.address || '',
          skills: res.data.data.skills?.join(', ') || '',
          resumeUrl: res.data.data.resumeUrl || '',
          githubUrl: res.data.data.socialLinks?.github || '',
          linkedinUrl: res.data.data.socialLinks?.linkedin || '',
          portfolioUrl: res.data.data.socialLinks?.portfolio || '',
          profileImageUrl: res.data.data.profileImageUrl || ''
        });
      } catch (error) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedExtensions = /(\.pdf|\.doc|\.docx)$/i;
    if (!allowedExtensions.exec(file.name)) {
      toast.error('Only PDF or Word document (.doc, .docx) files are allowed!');
      e.target.value = '';
      return;
    }

    if (file.size > 1024 * 1024) {
      toast.error('File size must be strictly under 1MB!');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData(prev => ({
        ...prev,
        resumeUrl: reader.result
      }));
      toast.success(`Resume "${file.name}" successfully validated and uploaded! (Under 1MB limit check passed)`);
    };
    reader.readAsDataURL(file);
  };

  const handleImageChange = (e) => {
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
      setFormData(prev => ({
        ...prev,
        profileImageUrl: reader.result
      }));
    };
    reader.readAsDataURL(file);
    toast.success('Image loaded successfully!');
  };

  const handlePreviewResume = (resumeDataUrl) => {
    if (!resumeDataUrl) return;
    
    if (resumeDataUrl.startsWith('data:')) {
      try {
        const parts = resumeDataUrl.split(',');
        const mime = parts[0].match(/:(.*?);/)[1];
        const bstr = atob(parts[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while(n--){
          u8arr[n] = bstr.charCodeAt(n);
        }
        const blob = new Blob([u8arr], { type: mime });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      } catch (e) {
        window.open(resumeDataUrl, '_blank');
      }
    } else {
      window.open(resumeDataUrl, '_blank');
    }
  };

  const handleAddEducation = () => {
    setEducations([...educations, { degree: '', school: '', year: new Date().getFullYear(), scoreType: 'CGPA', scoreValue: '' }]);
  };

  const handleRemoveEducation = (index) => {
    setEducations(educations.filter((_, i) => i !== index));
  };

  const handleEducationChange = (index, field, value) => {
    const updated = [...educations];
    updated[index] = { ...updated[index], [field]: value };
    setEducations(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        ...formData,
        salutation: formData.salutation,
        firstName: formData.firstName,
        lastName: formData.lastName,
        contactNumber: formData.contactNumber,
        email: formData.email,
        dob: formData.dob,
        gender: formData.gender,
        profileImageUrl: formData.profileImageUrl,
        addressDetails: {
          state: formData.state,
          city: formData.city,
          area: formData.area,
          pincode: formData.pincode,
          address: formData.address
        },
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
        socialLinks: {
          github: formData.githubUrl,
          linkedin: formData.linkedinUrl,
          portfolio: formData.portfolioUrl
        },
        educations
      };
      
      const res = await api.put('/student/profile', updatedData);
      setProfile(res.data.data);
      setEditMode(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-primary mb-1">My Profile</h2>
          <p className="text-muted mb-0">Manage your personal and academic information.</p>
        </div>
        <button 
          className={`btn ${editMode ? 'btn-outline-danger' : 'btn-primary'}`} 
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ? 'Cancel Edit' : 'Edit Profile'}
        </button>
      </div>

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="premium-card p-4 text-center">
            {!editMode ? (
              <img 
                src={profile?.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.user?.name || 'User')}&background=2b5c8f&color=fff&size=120`} 
                alt="Profile" 
                className="rounded-circle mb-3 border border-4 border-light shadow-sm shadow"
                style={{ width: '120px', height: '120px', objectFit: 'cover' }}
              />
            ) : (
              <div className="position-relative d-inline-block">
                <img 
                  src={formData.profileImageUrl || profile?.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.user?.name || 'User')}&background=2b5c8f&color=fff&size=120`} 
                  alt="Profile" 
                  className="rounded-circle mb-3 border border-4 border-light shadow-sm"
                  style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                />
                <label 
                  className="btn btn-sm btn-primary rounded-circle position-absolute bottom-0 end-0 mb-3 d-flex align-items-center justify-content-center" 
                  style={{ width: 32, height: 32, cursor: 'pointer', padding: 0 }}
                  title="Change Profile Image"
                >
                  <span style={{ fontSize: '1.2rem', lineHeight: '28px', fontWeight: 'bold' }}>+</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="d-none" 
                    onChange={handleImageChange} 
                  />
                </label>
              </div>
            )}
            <h4 className="fw-bold mb-1">{profile?.user?.name}</h4>
            <p className="text-muted mb-3">{profile?.salutation || ''} {profile?.firstName || 'Student'} {profile?.lastName || ''}</p>
            
            <div className="d-flex justify-content-center gap-2 mb-4">
              {profile?.socialLinks?.linkedin && (
                <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer" className="btn btn-outline-primary btn-sm rounded-circle" style={{ width: 36, height: 36, padding: 0, display: 'flex', alignItems:'center', justifyContent:'center' }}>in</a>
              )}
              {profile?.socialLinks?.github && (
                <a href={profile.socialLinks.github} target="_blank" rel="noreferrer" className="btn btn-outline-dark btn-sm rounded-circle" style={{ width: 36, height: 36, padding: 0, display: 'flex', alignItems:'center', justifyContent:'center' }}>gh</a>
              )}
            </div>

            <hr />
            
            <div className="text-start mt-4">
              <h6 className="fw-bold mb-3">Profile Strength</h6>
              <div className="progress mb-2" style={{ height: 10 }}>
                <div className="progress-bar bg-success" style={{ width: `${profile?.profileCompletionPercentage || 10}%` }}></div>
              </div>
              <p className="small text-muted">{profile?.profileCompletionPercentage || 10}% Complete</p>
            </div>
          </div>

          <div className="premium-card p-4 mt-4 border-primary" style={{ background: 'linear-gradient(135deg, #f0f7ff, #e0effe)' }}>
            <h5 className="fw-bold mb-3 text-primary d-flex align-items-center gap-2">
              <FiShield className="text-primary"/> Tops Credentials
            </h5>
            <div className="mb-3">
              <span className="text-muted small d-block">Course Enrolled</span>
              <span className="fw-bold text-dark">{profile?.courseName || 'Python Full Stack Development (TOPS)'}</span>
            </div>
            <div>
              <span className="text-muted small d-block mb-1">TOPS Performance Grade</span>
              <span className="badge bg-success px-3 py-2 rounded fw-bold text-uppercase" style={{ fontSize: '0.9rem' }}>
                {profile?.courseGrade || 'A+ Grade'}
              </span>
            </div>
            <small className="text-muted d-block mt-3 border-top pt-2" style={{ fontSize: '0.75rem' }}>
              * Credentials managed directly by TOPS Placement Authority and cannot be modified by students.
            </small>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="premium-card p-4">
            <h5 className="fw-bold mb-4 text-primary"><FiAward className="me-1"/> Student Placements Dossier</h5>
            
            {!editMode ? (
              <div className="row g-3">
                <div className="col-md-2">
                  <p className="text-muted small mb-1">Salutation</p>
                  <p className="fw-semibold text-dark">{profile?.salutation || 'Mr.'}</p>
                </div>
                <div className="col-md-5">
                  <p className="text-muted small mb-1">First Name</p>
                  <p className="fw-semibold text-dark">{profile?.firstName || 'Not specified'}</p>
                </div>
                <div className="col-md-5">
                  <p className="text-muted small mb-1">Last Name</p>
                  <p className="fw-semibold text-dark">{profile?.lastName || 'Not specified'}</p>
                </div>
                <div className="col-md-6">
                  <p className="text-muted small mb-1">Contact Number</p>
                  <p className="fw-semibold text-dark">{profile?.contactNumber || 'Not specified'}</p>
                </div>
                <div className="col-md-6">
                  <p className="text-muted small mb-1">Email ID</p>
                  <p className="fw-semibold text-dark">{profile?.email || 'Not specified'}</p>
                </div>
                <div className="col-md-6">
                  <p className="text-muted small mb-1">Date of Birth</p>
                  <p className="fw-semibold text-dark">{profile?.dob || 'Not specified'}</p>
                </div>
                <div className="col-md-6">
                  <p className="text-muted small mb-1">Gender</p>
                  <p className="fw-semibold text-dark">{profile?.gender || 'Not specified'}</p>
                </div>

                {/* Address details read-only block */}
                <div className="col-12 border-top pt-3 mt-3">
                  <h6 className="fw-bold text-dark mb-3"><FiBook className="me-1 text-primary"/> Address Details</h6>
                  <div className="row g-3 bg-light p-3 rounded shadow-sm border">
                    <div className="col-md-4">
                      <p className="text-muted small mb-1">State</p>
                      <p className="fw-semibold text-dark">{profile?.addressDetails?.state || 'Not specified'}</p>
                    </div>
                    <div className="col-md-4">
                      <p className="text-muted small mb-1">City</p>
                      <p className="fw-semibold text-dark">{profile?.addressDetails?.city || 'Not specified'}</p>
                    </div>
                    <div className="col-md-4">
                      <p className="text-muted small mb-1">Area</p>
                      <p className="fw-semibold text-dark">{profile?.addressDetails?.area || 'Not specified'}</p>
                    </div>
                    <div className="col-md-4">
                      <p className="text-muted small mb-1">Pincode</p>
                      <p className="fw-semibold text-dark">{profile?.addressDetails?.pincode || 'Not specified'}</p>
                    </div>
                    <div className="col-md-8">
                      <p className="text-muted small mb-1">Full Address</p>
                      <p className="fw-semibold text-dark">{profile?.addressDetails?.address || 'Not specified'}</p>
                    </div>
                  </div>
                </div>

                <div className="col-12 border-top pt-3 mt-3">
                  <h6 className="fw-bold text-dark mb-3"><FiBook className="me-1 text-primary"/> Educational Qualifications</h6>
                  {educations.length > 0 ? (
                    <div className="d-flex flex-column gap-3">
                      {educations.map((edu, idx) => (
                        <div key={idx} className="bg-light p-3 rounded-3 border d-flex justify-content-between align-items-center">
                          <div>
                            <span className="fw-bold text-dark">{edu.degree}</span>
                            <span className="text-muted small d-block">{edu.school} ({edu.year})</span>
                          </div>
                          <div>
                            <span className="badge bg-primary text-white px-2.5 py-1.5 rounded fw-bold">
                              {edu.scoreType}: {edu.scoreValue}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted small mb-0">No educational qualifications added yet.</p>
                  )}
                </div>

                <div className="col-12 border-top pt-3 mt-3">
                  <p className="text-muted small mb-2">Technical Skills & Technologies</p>
                  <div className="d-flex flex-wrap gap-2">
                    {profile?.skills?.length > 0 ? profile.skills.map((skill, index) => (
                      <span key={index} className="badge bg-primary-light text-primary px-3 py-2 rounded-pill">{skill}</span>
                    )) : <p className="fw-medium small">No skills added yet.</p>}
                  </div>
                </div>

                {/* Gorgeous resume info card in read mode */}
                <div className="col-12 border-top pt-3 mt-3">
                  <p className="text-muted small mb-2">Active ATS Placement Resume</p>
                  {profile?.resumeUrl ? (
                    <div className="d-flex align-items-center justify-content-between p-3 border rounded bg-white shadow-sm">
                      <div className="d-flex align-items-center gap-3">
                        <div className="rounded bg-danger-light text-danger d-flex align-items-center justify-content-center" style={{ width: 45, height: 45 }}>
                          <FiFileText className="fs-3" />
                        </div>
                        <div>
                          <span className="fw-bold text-dark d-block">Placement_Resume.pdf</span>
                          <span className="badge bg-success-light text-success fw-bold px-2 py-0.5 rounded" style={{ fontSize: '0.75rem' }}>
                            Verified under 1MB Limit
                          </span>
                        </div>
                      </div>
                      <button type="button" onClick={() => handlePreviewResume(profile.resumeUrl)} className="btn btn-sm btn-outline-primary fw-bold">
                        Download / View File
                      </button>
                    </div>
                  ) : (
                    <p className="text-muted small mb-0">No resume uploaded yet.</p>
                  )}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-2">
                    <label className="form-label">Salutation</label>
                    <select className="form-select" name="salutation" value={formData.salutation} onChange={handleChange} required>
                      <option value="">Select</option>
                      <option value="Mr.">Mr.</option>
                      <option value="Ms.">Ms.</option>
                      <option value="Mrs.">Mrs.</option>
                      <option value="Dr.">Dr.</option>
                    </select>
                  </div>
                  <div className="col-md-5">
                    <label className="form-label">First Name</label>
                    <input type="text" className="form-control" name="firstName" value={formData.firstName} onChange={handleChange} required />
                  </div>
                  <div className="col-md-5">
                    <label className="form-label">Last Name</label>
                    <input type="text" className="form-control" name="lastName" value={formData.lastName} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Contact Number</label>
                    <input type="tel" className="form-control" name="contactNumber" value={formData.contactNumber} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email ID</label>
                    <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Date of Birth</label>
                    <input type="date" className="form-control" name="dob" value={formData.dob} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Gender</label>
                    <select className="form-select" name="gender" value={formData.gender} onChange={handleChange} required>
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Address Details Edit Block */}
                  <div className="col-12 border-top pt-3 mt-3">
                    <h6 className="fw-bold text-dark mb-3"><FiLink className="me-1 text-primary"/> Address Details</h6>
                    <div className="row g-3 bg-light p-3 rounded border">
                      <div className="col-md-4">
                        <label className="form-label small fw-semibold">State</label>
                        <input type="text" className="form-control" name="state" value={formData.state} onChange={handleChange} required />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label small fw-semibold">City</label>
                        <input type="text" className="form-control" name="city" value={formData.city} onChange={handleChange} required />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label small fw-semibold">Area</label>
                        <input type="text" className="form-control" name="area" value={formData.area} onChange={handleChange} required />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label small fw-semibold">Pincode</label>
                        <input type="text" className="form-control" name="pincode" value={formData.pincode} onChange={handleChange} required />
                      </div>
                      <div className="col-md-8">
                        <label className="form-label small fw-semibold">Full Address</label>
                        <input type="text" className="form-control" name="address" value={formData.address} onChange={handleChange} required />
                      </div>
                    </div>
                  </div>

                  <div className="col-md-12 mt-3">
                    <label className="form-label">Skills / Technologies (comma separated)</label>
                    <input type="text" className="form-control" name="skills" value={formData.skills} onChange={handleChange} placeholder="React, Node, Python, Django" required />
                  </div>

                  {/* Multiple Educations Block */}
                  <div className="col-12 border-top pt-3 mt-3">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="fw-bold mb-0 text-dark"><FiBook className="me-1 text-primary"/> Add Multiple Educations</h6>
                      <button type="button" className="btn btn-sm btn-outline-primary fw-bold" onClick={handleAddEducation}>
                        <FiPlus className="me-1"/> Add Row
                      </button>
                    </div>

                    {educations.length > 0 ? (
                      <div className="d-flex flex-column gap-3">
                        {educations.map((edu, idx) => (
                          <div key={idx} className="border rounded p-3 bg-light position-relative shadow-sm">
                            <button 
                              type="button" 
                              className="btn btn-sm btn-link text-danger position-absolute top-0 end-0 p-2" 
                              onClick={() => handleRemoveEducation(idx)}
                              title="Delete Education"
                            >
                              <FiTrash2 className="fs-5"/>
                            </button>
                            <div className="row g-2">
                              <div className="col-md-4">
                                <label className="form-label small mb-0 fw-semibold">Degree / Grade</label>
                                <input 
                                  type="text" 
                                  className="form-control form-control-sm" 
                                  value={edu.degree} 
                                  onChange={(e) => handleEducationChange(idx, 'degree', e.target.value)} 
                                  placeholder="e.g. 10th, 12th, B.Tech"
                                  required
                                />
                              </div>
                              <div className="col-md-4">
                                <label className="form-label small mb-0 fw-semibold">School / University</label>
                                <input 
                                  type="text" 
                                  className="form-control form-control-sm" 
                                  value={edu.school} 
                                  onChange={(e) => handleEducationChange(idx, 'school', e.target.value)} 
                                  placeholder="e.g. Tops Academy, GSEB"
                                  required
                                />
                              </div>
                              <div className="col-md-4">
                                <label className="form-label small mb-0 fw-semibold">Year of Passing</label>
                                <input 
                                  type="number" 
                                  className="form-control form-control-sm" 
                                  value={edu.year} 
                                  onChange={(e) => handleEducationChange(idx, 'year', e.target.value)} 
                                  placeholder="e.g. 2024"
                                  required
                                />
                              </div>
                              <div className="col-md-6">
                                <label className="form-label small mb-0 fw-semibold">Score System</label>
                                <select 
                                  className="form-select form-select-sm" 
                                  value={edu.scoreType} 
                                  onChange={(e) => handleEducationChange(idx, 'scoreType', e.target.value)}
                                >
                                  <option value="CGPA">CGPA</option>
                                  <option value="Percentage">Percentage</option>
                                </select>
                              </div>
                              <div className="col-md-6">
                                <label className="form-label small mb-0 fw-semibold">Score / Marks</label>
                                <input 
                                  type="number" 
                                  step="0.01" 
                                  className="form-control form-control-sm" 
                                  value={edu.scoreValue} 
                                  onChange={(e) => handleEducationChange(idx, 'scoreValue', e.target.value)} 
                                  placeholder={edu.scoreType === 'CGPA' ? 'e.g. 9.4' : 'e.g. 84.5'}
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-3 border rounded border-dashed bg-white">
                        <span className="text-muted small">No educational milestones listed. Click "Add Row" above to enter details.</span>
                      </div>
                    )}
                  </div>

                  {/* Gorgeous resume info card in edit mode */}
                  <div className="col-12 border-top pt-3 mt-3">
                    <h6 className="fw-bold mb-3"><FiFileText className="me-1 text-primary"/> Placements Resume Document</h6>
                    
                    {formData.resumeUrl && (
                      <div className="d-flex align-items-center justify-content-between p-3 border rounded bg-white shadow-sm mb-3">
                        <div className="d-flex align-items-center gap-3">
                          <div className="rounded bg-danger-light text-danger d-flex align-items-center justify-content-center" style={{ width: 45, height: 45 }}>
                            <FiFileText className="fs-3" />
                          </div>
                          <div>
                            <span className="fw-bold text-dark d-block">
                              {formData.resumeUrl.split('/').pop()?.substring(13) || 'Placement_Resume.pdf'}
                            </span>
                            <span className="badge bg-success-light text-success fw-bold px-2 py-0.5 rounded" style={{ fontSize: '0.75rem' }}>
                              Validated Document (under 1MB limit check passed)
                            </span>
                          </div>
                        </div>
                        <button type="button" onClick={() => handlePreviewResume(formData.resumeUrl)} className="btn btn-sm btn-outline-primary fw-bold">
                          View File
                        </button>
                      </div>
                    )}

                    <div className="p-3 border rounded border-dashed bg-white text-center shadow-sm">
                      <FiFileText className="text-muted fs-2 mb-2"/>
                      <span className="text-muted d-block small mb-2">Upload your Placements Resume PDF or Word Document</span>
                      <input 
                        type="file" 
                        accept=".pdf,.doc,.docx" 
                        className="form-control form-control-sm mx-auto" 
                        style={{ maxWidth: 300 }}
                        onChange={handleFileChange}
                      />
                      <small className="text-muted d-block mt-2">Format supported: PDF, DOC, DOCX • File size limit: <strong>Under 1MB</strong></small>
                    </div>
                  </div>
                  
                  <h5 className="fw-bold mt-4 mb-2"><FiLink className="me-1 text-primary"/> Social Profiles</h5>
                  <div className="col-md-6">
                    <label className="form-label">LinkedIn URL</label>
                    <input type="url" className="form-control" name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">GitHub URL</label>
                    <input type="url" className="form-control" name="githubUrl" value={formData.githubUrl} onChange={handleChange} />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label">Portfolio / Website URL</label>
                    <input type="url" className="form-control" name="portfolioUrl" value={formData.portfolioUrl} onChange={handleChange} />
                  </div>

                  <div className="col-12 mt-4 text-end">
                    <button type="submit" className="btn btn-primary px-4 fw-bold">Save Academic Dossier</button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default StudentProfile;
