import { useState } from 'react';
import PageTransition from '../../components/PageTransition';
import { FiFileText, FiDownload, FiPlus, FiTrash, FiAward } from 'react-icons/fi';
import { toast } from 'react-toastify';

const ResumeBuilder = () => {
  const [resumeData, setResumeData] = useState({
    summary: 'Enthusiastic and results-driven student looking to leverage academic knowledge and development skills.',
    experience: [],
    education: [],
    projects: []
  });

  const handleAddField = (field, schema) => {
    setResumeData({
      ...resumeData,
      [field]: [...resumeData[field], schema]
    });
  };

  const handleRemoveField = (field, index) => {
    const updated = [...resumeData[field]];
    updated.splice(index, 1);
    setResumeData({ ...resumeData, [field]: updated });
  };

  const handleSave = () => {
    toast.success('Resume data saved successfully!');
  };

  return (
    <PageTransition>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-primary mb-1">Resume Builder</h2>
          <p className="text-muted mb-0">Build, preview, and download a professional ATS-ready resume.</p>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={handleSave}>
          <FiDownload /> Download PDF
        </button>
      </div>

      <div className="row g-4">
        {/* Left Side: Builder Form */}
        <div className="col-lg-7">
          <div className="premium-card p-4 mb-4">
            <h5 className="fw-bold mb-3"><FiFileText className="me-2 text-primary"/> Professional Summary</h5>
            <textarea 
              className="form-control" 
              rows="4" 
              value={resumeData.summary}
              onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
            />
          </div>

          <div className="premium-card p-4 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0"><FiAward className="me-2 text-primary"/> Work Experience</h5>
              <button 
                className="btn btn-sm btn-outline-primary"
                onClick={() => handleAddField('experience', { role: '', company: '', duration: '', desc: '' })}
              >
                <FiPlus /> Add
              </button>
            </div>
            {resumeData.experience.map((exp, idx) => (
              <div key={idx} className="p-3 border rounded mb-3 bg-light position-relative">
                <button 
                  className="btn btn-sm btn-link text-danger position-absolute top-0 end-0 m-2"
                  onClick={() => handleRemoveField('experience', idx)}
                >
                  <FiTrash />
                </button>
                <div className="row g-3">
                  <div className="col-md-6">
                    <input 
                      type="text" 
                      className="form-control form-control-sm" 
                      placeholder="Role Title" 
                      value={exp.role}
                      onChange={(e) => {
                        const updated = [...resumeData.experience];
                        updated[idx].role = e.target.value;
                        setResumeData({ ...resumeData, experience: updated });
                      }}
                    />
                  </div>
                  <div className="col-md-6">
                    <input 
                      type="text" 
                      className="form-control form-control-sm" 
                      placeholder="Company" 
                      value={exp.company}
                      onChange={(e) => {
                        const updated = [...resumeData.experience];
                        updated[idx].company = e.target.value;
                        setResumeData({ ...resumeData, experience: updated });
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="premium-card p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0"><FiFileText className="me-2 text-primary"/> Academic Projects</h5>
              <button 
                className="btn btn-sm btn-outline-primary"
                onClick={() => handleAddField('projects', { title: '', tech: '', desc: '' })}
              >
                <FiPlus /> Add
              </button>
            </div>
            {resumeData.projects.map((proj, idx) => (
              <div key={idx} className="p-3 border rounded mb-3 bg-light position-relative">
                <button 
                  className="btn btn-sm btn-link text-danger position-absolute top-0 end-0 m-2"
                  onClick={() => handleRemoveField('projects', idx)}
                >
                  <FiTrash />
                </button>
                <div className="row g-3">
                  <div className="col-md-6">
                    <input 
                      type="text" 
                      className="form-control form-control-sm" 
                      placeholder="Project Title" 
                      value={proj.title}
                      onChange={(e) => {
                        const updated = [...resumeData.projects];
                        updated[idx].title = e.target.value;
                        setResumeData({ ...resumeData, projects: updated });
                      }}
                    />
                  </div>
                  <div className="col-md-6">
                    <input 
                      type="text" 
                      className="form-control form-control-sm" 
                      placeholder="Technologies" 
                      value={proj.tech}
                      onChange={(e) => {
                        const updated = [...resumeData.projects];
                        updated[idx].tech = e.target.value;
                        setResumeData({ ...resumeData, projects: updated });
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Live Interactive Template Preview */}
        <div className="col-lg-5">
          <div className="premium-card p-4 bg-white shadow-lg sticky-top" style={{ top: '100px', minHeight: '500px' }}>
            <h6 className="text-uppercase fw-bold text-muted small mb-3">Live Resume Preview</h6>
            <div className="p-4 border rounded bg-light" style={{ fontSize: '12px', minHeight: '400px' }}>
              <h4 className="fw-bold text-dark text-center mb-1">Jane Doe</h4>
              <p className="text-muted text-center mb-3">jane.doe@example.com | +91 9876543210</p>
              <hr />
              <h6 className="fw-bold text-primary mb-1">SUMMARY</h6>
              <p className="text-dark mb-3">{resumeData.summary}</p>
              
              <h6 className="fw-bold text-primary mb-1">PROJECTS</h6>
              {resumeData.projects.length > 0 ? resumeData.projects.map((p, i) => (
                <div key={i} className="mb-2">
                  <span className="fw-bold text-dark">{p.title || 'Untitled Project'}</span> {p.tech && `— (${p.tech})`}
                </div>
              )) : <p className="text-muted">No projects added yet.</p>}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ResumeBuilder;
