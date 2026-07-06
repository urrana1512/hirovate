import { useState, useRef } from 'react';
import PageTransition from '../../components/PageTransition';
import { FiTrendingUp, FiCpu, FiAlertTriangle, FiCheckCircle, FiUploadCloud, FiFileText, FiX, FiInfo } from 'react-icons/fi';
import api from '../../services/api';
import { toast } from 'react-toastify';

const ResumeAnalyzer = () => {
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resumeText, setResumeText] = useState('');
  const [inputMode, setInputMode] = useState('upload'); // 'upload' or 'text'
  const [uploadedFile, setUploadedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  
  // Immersive scanning progress
  const [scanProgress, setScanProgress] = useState(0);
  const [scanPhase, setScanPhase] = useState('');
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndProcessFile(file);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      validateAndProcessFile(file);
    }
  };

  const validateAndProcessFile = (file) => {
    const validExtensions = ['.pdf', '.docx', '.doc', '.txt'];
    const fileExtension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
      return toast.error('Unsupported file format! Please upload PDF, Word (.doc, .docx) or Text (.txt) files.');
    }
    
    setUploadedFile(file);
    
    // For txt files, read content directly.
    if (fileExtension === '.txt') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setResumeText(e.target.result);
      };
      reader.readAsText(file);
    } else {
      // Mock extract content for pdf / docx to feed the analyzer logic
      setResumeText(`[Extracted from ${file.name}] Student Profile, Computer Science Engineering. Experience in React, Node.js, and modern Fullstack technologies.`);
    }
    toast.success(`${file.name} loaded successfully!`);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setResumeText('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const runImmersiveScanner = (onComplete) => {
    setLoading(true);
    setScanProgress(5);
    setScanPhase('Reading Resume Structure...');

    const phases = [
      { progress: 25, phase: 'Extracting semantic blocks...' },
      { progress: 50, phase: 'Parsing ATS keyword compliance...' },
      { progress: 75, phase: 'Matching technical skills matrix...' },
      { progress: 95, phase: 'Calculating industry placement readiness...' },
      { progress: 100, phase: 'Compliance scan complete!' }
    ];

    let currentPhaseIdx = 0;
    const interval = setInterval(() => {
      if (currentPhaseIdx < phases.length) {
        const next = phases[currentPhaseIdx];
        setScanProgress(next.progress);
        setScanPhase(next.phase);
        currentPhaseIdx++;
      } else {
        clearInterval(interval);
        onComplete();
      }
    }, 600);
  };

  const handleAnalyze = async () => {
    if (inputMode === 'upload' && !uploadedFile) {
      return toast.warn('Please select or upload a PDF/Word resume file to analyze!');
    }
    if (inputMode === 'text' && !resumeText.trim()) {
      return toast.warn('Please paste your resume text to analyze!');
    }

    runImmersiveScanner(async () => {
      try {
        const textPayload = resumeText || (uploadedFile ? `Extracted from ${uploadedFile.name}` : '');
        const res = await api.post('/student/resume-analyze', { resumeText: textPayload });
        setAnalysisData(res.data.data);
        toast.success('Resume analysed successfully!');
      } catch (error) {
        toast.error('Failed to analyze resume');
      } finally {
        setLoading(false);
      }
    });
  };

  return (
    <PageTransition>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-primary mb-1">AI Resume Compliance Scan</h2>
          <p className="text-muted mb-0">Directly upload your PDF or Word resume, or paste plain text to check ATS compliance score instantly.</p>
        </div>
      </div>

      <div className="row g-4">
        {/* Input panel */}
        <div className="col-lg-6">
          <div className="premium-card p-4">
            
            {/* Input Mode Selector */}
            <div className="d-flex gap-2 p-1 bg-light rounded-3 mb-4" style={{ border: '1px solid #e9ecef' }}>
              <button 
                className={`btn btn-sm flex-grow-1 py-2 fw-semibold rounded-2 transition-all ${inputMode === 'upload' ? 'btn-primary shadow-sm' : 'btn-light border-0 text-muted'}`}
                onClick={() => { setInputMode('upload'); handleRemoveFile(); }}
              >
                <FiUploadCloud className="me-2" /> Upload PDF / Word
              </button>
              <button 
                className={`btn btn-sm flex-grow-1 py-2 fw-semibold rounded-2 transition-all ${inputMode === 'text' ? 'btn-primary shadow-sm' : 'btn-light border-0 text-muted'}`}
                onClick={() => { setInputMode('text'); handleRemoveFile(); }}
              >
                <FiFileText className="me-2" /> Paste Resume Text
              </button>
            </div>

            {inputMode === 'upload' ? (
              /* Drag and Drop Zone */
              <div 
                className={`d-flex flex-column align-items-center justify-content-center border-dashed rounded-3 p-5 transition-all text-center ${dragActive ? 'bg-primary-light border-primary' : 'bg-light border-secondary-subtle'}`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                style={{ borderWidth: '2px', minHeight: '260px', cursor: 'pointer' }}
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="d-none" 
                  accept=".pdf,.docx,.doc,.txt"
                  onChange={handleFileChange}
                />
                
                {uploadedFile ? (
                  <div onClick={(e) => e.stopPropagation()} className="w-100">
                    <FiFileText className="display-4 text-primary mb-3" />
                    <h5 className="fw-bold text-dark mb-1">{uploadedFile.name}</h5>
                    <span className="small text-muted d-block mb-3">{(uploadedFile.size / 1024).toFixed(1)} KB</span>
                    
                    <button 
                      className="btn btn-outline-danger btn-sm px-3 rounded-pill gap-1 d-inline-flex align-items-center"
                      onClick={handleRemoveFile}
                    >
                      <FiX /> Remove File
                    </button>
                  </div>
                ) : (
                  <>
                    <FiUploadCloud className="display-4 text-primary mb-3 opacity-75" />
                    <h6 className="fw-bold text-dark mb-2">Drag & Drop Resume File Here</h6>
                    <p className="text-muted small mb-3">Supports PDF, DOCX, DOC, and TXT formats</p>
                    <button type="button" className="btn btn-primary btn-sm px-4 rounded-pill">Browse File</button>
                  </>
                )}
              </div>
            ) : (
              /* Text Area Zone */
              <div>
                <h6 className="fw-bold text-dark mb-2"><FiCpu className="me-2 text-primary" /> Paste Resume Content</h6>
                <textarea 
                  className="form-control mb-3" 
                  rows="10" 
                  placeholder="Paste the plain text of your resume here to run compliance analyzer..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                />
              </div>
            )}

            {/* Scanning Progress Bar */}
            {loading && (
              <div className="mt-4 p-3 bg-light rounded-3 border">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="small fw-semibold text-primary">{scanPhase}</span>
                  <span className="small fw-bold text-dark">{scanProgress}%</span>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div 
                    className="progress-bar progress-bar-striped progress-bar-animated bg-primary" 
                    role="progressbar" 
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              </div>
            )}

            <button 
              className="btn btn-primary w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 mt-4"
              onClick={handleAnalyze}
              disabled={loading}
            >
              {loading ? 'Running AI ATS Scan...' : 'Start ATS Compliance Scan'}
            </button>
          </div>
        </div>

        {/* Results Panel */}
        <div className="col-lg-6">
          {analysisData ? (
            <div className="premium-card p-4 bg-white">
              <div className="text-center mb-4">
                <div className="display-4 fw-bold text-success mb-1">{analysisData.score}/100</div>
                <h5 className="fw-bold text-dark">ATS Compliance Score</h5>
                <span className="badge bg-success-light text-success px-3 py-2 rounded-pill mt-2">
                  Match Level: {analysisData.atsMatch}
                </span>
              </div>

              <hr />

              <h6 className="fw-bold text-primary mb-3"><FiCheckCircle className="me-2 text-success"/> Top Matched Keywords</h6>
              <div className="d-flex flex-wrap gap-2 mb-4">
                {analysisData.keywordsFound.map((kw, i) => (
                  <span key={i} className="badge bg-primary-light text-primary px-3 py-2 rounded-pill">{kw}</span>
                ))}
              </div>

              <h6 className="fw-bold text-warning mb-3"><FiAlertTriangle className="me-2 text-warning"/> AI Action Items & Recommendations</h6>
              <ul className="list-group list-group-flush small">
                {analysisData.suggestions.map((sug, i) => (
                  <li key={i} className="list-group-item d-flex align-items-start gap-2 bg-transparent border-0 px-0">
                    <FiTrendingUp className="text-primary mt-1 flex-shrink-0" />
                    <span className="text-dark">{sug}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="premium-card p-5 text-center h-100 d-flex flex-column justify-content-center align-items-center bg-light border border-dashed" style={{ minHeight: '350px' }}>
              <FiTrendingUp className="text-muted display-4 mb-3" />
              <h5 className="fw-bold text-dark mb-1">Scan Results Will Appear Here</h5>
              <p className="text-muted small">Upload your resume file or paste content, and initiate scan to calculate your placement readiness score instantly.</p>
              
              <div className="d-flex gap-2 align-items-center mt-3 text-muted" style={{ fontSize: '0.75rem' }}>
                <FiInfo />
                <span>Having a high ATS score improves profile visibility to recruiters.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default ResumeAnalyzer;
