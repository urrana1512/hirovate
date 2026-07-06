import { useState } from 'react';
import PageTransition from '../../components/PageTransition';
import { FiCalendar, FiMapPin, FiBookmark } from 'react-icons/fi';
import { toast } from 'react-toastify';

const RecruiterEvents = () => {
  const events = [
    { id: 'e1', title: 'Mega Campus Drive 2026', date: 'May 25, 2026', venue: 'Convention Hall A', description: 'Coordinated campus placements with 50+ participating colleges.' },
    { id: 'e2', title: 'Hiring Keynote & Seminar', date: 'May 28, 2026', venue: 'Academic Seminar Hall', description: 'Introduce your hiring pipeline and packages to engineering graduating classes.' }
  ];

  return (
    <PageTransition>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-primary mb-1">Hiring Events & Placement Drives</h2>
          <p className="text-muted mb-0">Register your recruiters at campus events, webinars, or open interview days.</p>
        </div>
      </div>

      <div className="row g-4">
        {events.map(ev => (
          <div className="col-md-6" key={ev.id}>
            <div className="premium-card p-4 h-100 d-flex flex-column hover-lift">
              <h5 className="fw-bold text-dark mb-2">{ev.title}</h5>
              <p className="text-muted small mb-4">{ev.description}</p>

              <div className="d-flex flex-column gap-2 mb-4 small text-muted">
                <div><FiCalendar className="text-primary me-2"/> {ev.date}</div>
                <div><FiMapPin className="text-primary me-2"/> Venue: {ev.venue}</div>
              </div>

              <div className="mt-auto">
                <button className="btn btn-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2" onClick={() => toast.success('Successfully reserved coordinator seats at campus event!')}>
                  <FiBookmark /> Register Attendance
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageTransition>
  );
};

export default RecruiterEvents;
