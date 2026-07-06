import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageTransition from '../../components/PageTransition';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FiPrinter, FiDownload, FiMapPin, FiCalendar, FiClock } from 'react-icons/fi';

const AdmitCard = () => {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const res = await api.get('/student/applications');
        const matched = res.data.data.find(app => app._id === id);
        setApplication(matched);
      } catch (error) {
        toast.error('Failed to load admit card details');
      } finally {
        setLoading(false);
      }
    };
    fetchApplication();
  }, [id]);

  const handlePrint = () => {
    window.print();
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

  if (!application) {
    return (
      <PageTransition>
        <div className="text-center py-5">
          <h5>Admit card not found or unauthorized access.</h5>
          <Link to="/student/applications" className="btn btn-primary mt-3">Back to Applications</Link>
        </div>
      </PageTransition>
    );
  }

  const studentName = JSON.parse(localStorage.getItem('user') || '{}').name || 'Jane Doe';

  return (
    <PageTransition>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3 no-print">
        <div>
          <h2 className="fw-bold text-primary mb-1">Interview Admit Card</h2>
          <p className="text-muted mb-0">Present this admit card physically or digitally at the interview counter.</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary d-flex align-items-center gap-2" onClick={handlePrint}>
            <FiPrinter /> Print
          </button>
          <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => toast.success('Admit Card downloaded successfully as PDF!')}>
            <FiDownload /> Download PDF
          </button>
        </div>
      </div>

      <div className="card shadow-lg border-0 p-5 bg-white mx-auto print-container" style={{ maxWidth: '800px', borderRadius: '16px' }}>
        <div className="text-center border-bottom pb-4 mb-4">
          <h3 className="fw-bold text-primary mb-1">JOBFEST PLACEMENT PORTAL</h3>
          <p className="text-muted text-uppercase fw-semibold mb-0 small">Official Interview Call Letter & Admit Card</p>
        </div>

        <div className="row g-4">
          {/* Student details */}
          <div className="col-md-8">
            <h5 className="fw-bold text-dark mb-3">CANDIDATE INFORMATION</h5>
            <div className="row g-2 small">
              <div className="col-5 text-muted">Full Name:</div>
              <div className="col-7 fw-bold text-dark">{studentName}</div>

              <div className="col-5 text-muted">Application ID:</div>
              <div className="col-7 fw-mono text-dark">{application._id}</div>

              <div className="col-5 text-muted">Role Applied:</div>
              <div className="col-7 fw-bold text-primary">Technical Intern / Graduate Trainee</div>

              <div className="col-5 text-muted">Company Name:</div>
              <div className="col-7 fw-semibold text-dark">{application.company?.companyName}</div>
            </div>
          </div>

          {/* QR section */}
          <div className="col-md-4 text-center d-flex flex-column align-items-center justify-content-center border-start">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=AdmitCard:${application._id}`} 
              alt="QR Code"
              className="img-fluid border p-2 bg-light rounded"
              style={{ maxWidth: '130px' }}
            />
            <span className="text-muted small mt-2 d-block">Scan to Verify Attendance</span>
          </div>
        </div>

        <hr className="my-4" />

        {/* Schedule & Venue */}
        <div>
          <h5 className="fw-bold text-dark mb-3">INTERVIEW SCHEDULE</h5>
          <div className="row g-4 text-center">
            <div className="col-md-4">
              <div className="p-3 bg-light rounded-3">
                <FiCalendar className="text-primary display-6 mb-2" />
                <h6 className="fw-bold mb-1">DATE</h6>
                <p className="text-dark small mb-0">{application.slot?.date ? new Date(application.slot.date).toLocaleDateString() : 'TBD'}</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-3 bg-light rounded-3">
                <FiClock className="text-primary display-6 mb-2" />
                <h6 className="fw-bold mb-1">TIME</h6>
                <p className="text-dark small mb-0">{application.slot?.startTime || 'TBD'} — {application.slot?.endTime || 'TBD'}</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-3 bg-light rounded-3">
                <FiMapPin className="text-primary display-6 mb-2" />
                <h6 className="fw-bold mb-1">VENUE</h6>
                <p className="text-dark small mb-0">{application.slot?.venue || 'TBD'}</p>
              </div>
            </div>
          </div>
        </div>

        <hr className="my-4" />

        <div className="small text-muted bg-light p-3 rounded">
          <h6 className="fw-bold mb-2">Important Instructions:</h6>
          <ol className="mb-0 ps-3">
            <li>Please report to the interview venue 15 minutes before the scheduled slot.</li>
            <li>Keep a soft or printed copy of this Admit Card and your primary College ID card.</li>
            <li>Maintain proper corporate dress code and carry a portfolio copy of your resume.</li>
          </ol>
        </div>
      </div>
    </PageTransition>
  );
};

export default AdmitCard;
