import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import PageTransition from "../../components/PageTransition";
import api from "../../services/api";
import { toast } from "react-toastify";
import {
  FiBriefcase,
  FiMapPin,
  FiLink,
  FiCheckSquare,
  FiCalendar,
  FiDollarSign,
  FiClock,
  FiCheck,
  FiAlertTriangle,
} from "react-icons/fi";

const CompanyDetails = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [slots, setSlots] = useState([]);

  const [selectedJob, setSelectedJob] = useState(null); // The job the student clicked "Apply Now" for
  const [selectedSlot, setSelectedSlot] = useState("");
  const [showApplyModal, setShowApplyModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const [compRes, appsRes] = await Promise.all([
          api.get(`/companies/${id}`),
          api.get("/student/applications"),
        ]);
        const {
          company: comData,
          jobs: jobList,
          slots: slotList,
        } = compRes.data.data;

        setCompany(comData);
        setJobs(jobList || []);
        setSlots(slotList || []);

        const appIds = new Set(
          (appsRes.data.data || []).map((app) => app.job?._id?.toString()).filter(Boolean),
        );
        setAppliedJobIds(appIds);
      } catch (error) {
        toast.error("Failed to load company details");
      } finally {
        setLoading(false);
      }
    };
    fetchCompanyData();
  }, [id]);

  const handleOpenApplyModal = (job) => {
    setSelectedJob(job);
    setSelectedSlot("");
    setShowApplyModal(true);
  };

  const handleConfirmApply = async () => {
    setApplying(true);
    try {
      await api.post("/student/applications", {
        companyId: id,
        jobId: selectedJob._id,
      });
      toast.success(`Successfully applied for ${selectedJob.title}!`);
      setAppliedJobIds((prev) => {
        const next = new Set(prev);
        next.add(selectedJob._id?.toString());
        return next;
      });
      setShowApplyModal(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to submit application",
      );
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <PageTransition>
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "60vh" }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      {company?.status === "hiring_closed" && (
        <div
          className="alert alert-danger border-0 rounded-4 p-4 mb-4 d-flex align-items-center gap-3 shadow-sm"
          style={{ background: "linear-gradient(45deg, #fee2e2, #fecaca)" }}
        >
          <FiAlertTriangle className="fs-1 text-danger" />
          <div>
            <h5 className="fw-bold text-danger mb-1">
              Recruitment Drive Concluded / Company Closed
            </h5>
            <p className="mb-0 text-dark opacity-90 small">
              This recruiter has closed all interview boards and left the
              placement venue. No new application slot bookings are being
              accepted to avoid wasting candidate time.
            </p>
          </div>
        </div>
      )}

      <div className="mb-4">
        <Link to="/student/companies" className="btn btn-sm btn-light mb-3">
          ← Back to Listings
        </Link>
        <div className="d-flex align-items-center gap-3">
          <img
            src={
              company?.logoUrl ||
              company?.logo ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(company?.companyName || "Logo")}&background=random`
            }
            alt="Logo"
            className="rounded shadow-sm"
            style={{ width: 80, height: 80, objectFit: "cover" }}
          />
          <div>
            <h2 className="fw-bold text-primary mb-1">
              {company?.companyName}
            </h2>
            <p className="text-muted mb-0">
              {company?.industry || "Technology & Innovation"}
            </p>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          {/* Company Bio */}
          <div className="premium-card p-4 mb-4">
            <h5 className="fw-bold mb-3 text-dark">
              <FiBriefcase className="me-2 text-primary" /> About the Company
            </h5>
            <p className="text-dark leading-relaxed mb-0">
              {company?.description ||
                "No description provided by recruiter yet."}
            </p>
          </div>

          {/* Job Openings Details List */}
          <h5 className="fw-bold mb-3 text-dark font-poppins mt-4">
            <FiBriefcase className="me-2 text-primary" /> Active Job &
            Internship Openings
          </h5>
          {jobs.length > 0 ? (
            <div className="d-flex flex-column gap-4">
              {jobs.map((job) => {
                const isClosed =
                  job.status === "closed" ||
                  company?.status === "hiring_closed";
                return (
                  <div
                    key={job._id}
                    className="premium-card p-4 hover-lift d-flex flex-column"
                    style={
                      isClosed
                        ? {
                            filter: "grayscale(70%)",
                            opacity: 0.65,
                            border: "2px dashed var(--danger-color)",
                          }
                        : {}
                    }
                  >
                    <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-2">
                      <div>
                        <h5 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
                          {job.title}
                          {isClosed && (
                            <span
                              className="badge bg-danger text-white rounded-pill px-2 py-1 small"
                              style={{ fontSize: "0.65rem" }}
                            >
                              Closed
                            </span>
                          )}
                        </h5>
                        <span className="badge bg-primary-light text-primary text-capitalize">
                          {job.role}
                        </span>
                      </div>
                      <span className="badge bg-success-light text-success px-3 py-2 rounded-pill">
                        {job.openings} Positions Open
                      </span>
                    </div>

                    <div className="row g-3 mb-4 small text-muted">
                      <div className="col-sm-6">
                        <FiDollarSign className="text-primary me-2" /> Package:{" "}
                        <strong>{job.salaryPackage}</strong>
                      </div>
                      <div className="col-sm-6">
                        <FiBriefcase className="text-primary me-2" />{" "}
                        Experience: {job.experienceRequired}
                      </div>
                      <div className="col-sm-6">
                        <FiMapPin className="text-primary me-2" /> Location:{" "}
                        {job.location} ({job.workMode})
                      </div>
                      <div className="col-sm-6">
                        <FiCalendar className="text-primary me-2" /> Apply
                        Before: {new Date(job.deadline).toLocaleDateString()}
                      </div>
                    </div>

                    {job.skillsRequired && job.skillsRequired.length > 0 && (
                      <div className="mb-4">
                        <span className="text-muted small d-block mb-2">
                          Required Skills
                        </span>
                        <div className="d-flex flex-wrap gap-2">
                          {job.skillsRequired.map((skill, idx) => (
                            <span
                              key={idx}
                              className="badge bg-light text-dark px-3 py-2 rounded-pill border small"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {job.rounds && job.rounds.length > 0 && (
                      <div className="mb-4">
                        <span className="text-muted small d-block mb-2">
                          Recruitment Rounds
                        </span>
                        <div className="d-flex align-items-center flex-wrap gap-2">
                          {job.rounds.map((round, idx) => (
                            <span
                              key={idx}
                              className="d-flex align-items-center gap-1 text-muted small bg-light p-2 rounded-3 border"
                            >
                              <FiCheck className="text-success" /> {round}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {job.availability && job.availability.length > 0 && (
                      <div className="mb-4">
                        <span className="text-muted small d-block mb-2">
                          <FiClock className="text-primary me-1" /> Interview
                          Timings (JobFest Drive Days)
                        </span>
                        <div className="d-flex flex-wrap gap-2">
                          {job.availability.map((avail, idx) => (
                            <span
                              key={idx}
                              className="badge bg-primary-light text-primary px-3 py-2 rounded-pill border small"
                            >
                              {new Date(avail.date).toLocaleDateString()}:{" "}
                              <strong>
                                {avail.startTime} — {avail.endTime}
                              </strong>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="d-flex justify-content-end align-items-center pt-3 border-top mt-auto flex-wrap gap-3">
                      {isClosed ? (
                        <button
                          className="btn btn-secondary px-4 py-2 fw-bold text-uppercase"
                          disabled
                          style={{ fontSize: "0.8rem" }}
                        >
                          Interview Closed
                        </button>
                      ) : appliedJobIds.has(job._id?.toString()) ? (
                        <button
                          className="btn btn-secondary px-4 py-2 fw-bold text-uppercase"
                          disabled
                          style={{ fontSize: "0.8rem" }}
                        >
                          Already Applied
                        </button>
                      ) : (
                        <button
                          className="btn btn-primary px-4 py-2 fw-bold"
                          onClick={() => handleOpenApplyModal(job)}
                        >
                          Direct Apply
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="premium-card p-5 text-center">
              <FiBriefcase className="text-muted display-4 mb-3" />
              <h5 className="fw-bold text-dark">No Active Openings</h5>
              <p className="text-muted small mb-0">
                Check back later for newly published vacancies.
              </p>
            </div>
          )}
        </div>

        <div className="col-lg-4">
          <div className="premium-card p-4 sticky-top" style={{ top: "100px" }}>
            <h5 className="fw-bold mb-4 text-dark">Company Information</h5>
            <div className="mb-3">
              <span className="text-muted small d-block mb-1">Website URL</span>
              <p className="fw-medium mb-0">
                <FiLink className="me-2 text-primary" />{" "}
                <a
                  href={company?.website || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="text-decoration-none"
                >
                  {company?.website || "N/A"}
                </a>
              </p>
            </div>
            <div className="mb-3">
              <span className="text-muted small d-block mb-1">
                Company HQ Location
              </span>
              <p className="fw-medium mb-0">
                <FiMapPin className="me-2 text-primary" />{" "}
                {company?.location || "Multiple Locations"}
              </p>
            </div>
            <div className="mb-3">
              <span className="text-muted small d-block mb-1">
                Verification Status
              </span>
              <p className="fw-medium mb-0">
                <span className="badge bg-success-light text-success text-capitalize">
                  {company?.status || "Active"}
                </span>
              </p>
            </div>

            {company?.attendanceTimings && company.attendanceTimings.length > 0 && (
              <div className="mt-4 pt-3 border-top">
                <h6 className="fw-bold mb-3 text-dark d-flex align-items-center gap-2">
                  <FiCalendar className="text-primary" /> JobFest Attendance
                </h6>
                <div className="d-flex flex-column gap-2">
                  {company.attendanceTimings.map((timing, index) => (
                    <div
                      key={index}
                      className="p-2 bg-light rounded border d-flex justify-content-between align-items-center"
                    >
                      <span className="fw-medium text-dark small">
                        {new Date(timing.date).toLocaleDateString()}
                      </span>
                      {timing.attending ? (
                        <span className="badge bg-success-light text-success small">
                          {timing.startTime} - {timing.endTime}
                        </span>
                      ) : (
                        <span className="badge bg-secondary-light text-secondary small">
                          Not Attending
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modern direct apply slot booking modal popup */}
      {showApplyModal && selectedJob && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content premium-card p-4 border-0">
              <div className="modal-header border-0 pb-0">
                <div>
                  <h5 className="modal-title fw-bold text-dark">
                    Apply for {selectedJob.title}
                  </h5>
                  <p className="text-muted small mb-0">
                    {company?.companyName} • Salary Package:{" "}
                    {selectedJob.salaryPackage}
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowApplyModal(false)}
                ></button>
              </div>

              <div className="modal-body py-4">
                <p className="text-muted mb-3">
                  You are applying directly for the following placement position
                  at the JobFest drive:
                </p>
                <div className="p-3 bg-light rounded-3 border mb-3">
                  <h6 className="fw-bold text-dark mb-2">
                    {selectedJob.title}
                  </h6>
                  <p className="text-muted small mb-1">
                    <strong>Company:</strong> {company?.companyName}
                  </p>
                  <p className="text-muted small mb-1">
                    <strong>Package:</strong> {selectedJob.salaryPackage}
                  </p>
                  <p className="text-muted small mb-0">
                    <strong>Location:</strong> {selectedJob.location} (
                    {selectedJob.workMode})
                  </p>
                </div>
                <div className="alert alert-info border-0 rounded-3 small d-flex align-items-center gap-2 mb-0">
                  <FiClock className="fs-5 text-primary flex-shrink-0" />
                  <span>
                    Recruiters will evaluate your profile and contact you
                    directly to conduct face-to-face interviews at the venue.
                  </span>
                </div>
              </div>

              <div className="modal-footer border-0 pt-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary px-4"
                  onClick={() => setShowApplyModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary px-5 fw-bold"
                  onClick={handleConfirmApply}
                  disabled={applying}
                >
                  {applying ? "Applying..." : "Confirm & Apply"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageTransition>
  );
};

export default CompanyDetails;
