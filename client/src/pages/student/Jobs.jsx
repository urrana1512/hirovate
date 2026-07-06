import { useState, useEffect } from "react";
import PageTransition from "../../components/PageTransition";
import api from "../../services/api";
import { toast } from "react-toastify";
import {
  FiSearch,
  FiFilter,
  FiBriefcase,
  FiMapPin,
  FiDollarSign,
  FiCalendar,
  FiClock,
  FiCheckSquare,
  FiCheck,
} from "react-icons/fi";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState(""); // 'job' or 'internship' or ''
  const [selectedMode, setSelectedMode] = useState(""); // 'remote', 'on-site', 'hybrid', or ''

  // Direct apply modal state
  const [selectedJob, setSelectedJob] = useState(null);
  const [companySlots, setCompanySlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applying, setApplying] = useState(false);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const [jobsRes, appsRes] = await Promise.all([
          api.get("/student/jobs"),
          api.get("/student/applications")
        ]);
        setJobs(jobsRes.data.data || []);
        const appIds = new Set((appsRes.data.data || []).map(app => app.job?._id?.toString()).filter(Boolean));
        setAppliedJobIds(appIds);
      } catch (error) {
        toast.error("Failed to load active job postings");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleOpenApplyModal = (job) => {
    setSelectedJob(job);
    setShowApplyModal(true);
  };

  const handleConfirmApply = async () => {
    setApplying(true);
    try {
      const companyId = selectedJob.company?._id || selectedJob.company;
      await api.post("/student/applications", {
        companyId: companyId,
        jobId: selectedJob._id,
      });
      toast.success(`Successfully applied for ${selectedJob.title}!`);
      setAppliedJobIds(prev => {
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

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company?.companyName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      job.skillsRequired?.some((s) =>
        s.toLowerCase().includes(searchTerm.toLowerCase()),
      );

    const matchesType =
      selectedType === "" ||
      (selectedType === "internship" &&
        job.title?.toLowerCase().includes("intern")) ||
      (selectedType === "job" && !job.title?.toLowerCase().includes("intern"));

    const matchesMode = selectedMode === "" || job.workMode === selectedMode;

    return matchesSearch && matchesType && matchesMode;
  });

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
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-primary mb-1">Explore Open Vacancies</h2>
          <p className="text-muted mb-0">
            Search and directly apply for internships and full-time jobs listed
            on Hirovate.
          </p>
        </div>
      </div>

      {/* Advanced search and filter controls */}
      <div className="premium-card p-4 mb-4">
        <div className="row g-3">
          <div className="col-lg-6">
            <div className="position-relative">
              <FiSearch
                className="position-absolute top-50 translate-middle-y text-muted"
                style={{ left: "15px" }}
              />
              <input
                type="text"
                className="form-control bg-light border-0 py-3"
                placeholder="Search by job title, company, or skills..."
                style={{ paddingLeft: "45px" }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-3">
            <select
              className="form-select bg-light border-0 py-3"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">All Job Types</option>
              <option value="job">Full-time Job</option>
              <option value="internship">Internship</option>
            </select>
          </div>
          <div className="col-md-3">
            <select
              className="form-select bg-light border-0 py-3 text-capitalize"
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
            >
              <option value="">All Work Modes</option>
              <option value="on-site">On-site</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
        </div>
      </div>

      {/* Job cards list */}
      <div className="row g-4">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => {
            const isClosed =
              job.status === "closed" ||
              job.company?.status === "hiring_closed";
            return (
              <div className="col-md-6" key={job._id}>
                <div
                  className="premium-card p-4 h-100 d-flex flex-column hover-lift"
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
                  <div className="d-flex gap-3 align-items-start mb-3">
                    <img
                      src={
                        job.company?.logoUrl || job.company?.logo ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company?.companyName || "Logo")}&background=random`
                      }
                      alt="Logo"
                      className="rounded-3 shadow-sm"
                      style={{ width: 56, height: 56, objectFit: "cover" }}
                    />
                    <div className="flex-grow-1">
                      <h5 className="fw-bold mb-1 text-dark d-flex align-items-center gap-2">
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
                      <p className="text-muted small mb-0">
                        {job.company?.companyName}
                      </p>
                    </div>
                    <span className="badge bg-primary-light text-primary px-3 py-2 rounded-pill text-capitalize">
                      {job.workMode}
                    </span>
                  </div>

                  <p className="text-muted small mb-4 line-clamp-2">
                    Role: <strong>{job.role}</strong> • Apply for high
                    conversion packages in {job.location}.
                  </p>

                  <div className="row g-2 mb-4 small text-muted">
                    <div className="col-6 d-flex align-items-center gap-1">
                      <FiDollarSign className="text-primary" />{" "}
                      <strong>{job.salaryPackage}</strong>
                    </div>
                    <div className="col-6 d-flex align-items-center gap-1">
                      <FiBriefcase className="text-primary" />{" "}
                      {job.experienceRequired} Required
                    </div>
                    <div className="col-6 d-flex align-items-center gap-1">
                      <FiMapPin className="text-primary" /> {job.location}
                    </div>
                    <div className="col-6 d-flex align-items-center gap-1">
                      <FiCalendar className="text-primary" /> Apply Before:{" "}
                      {new Date(job.deadline).toLocaleDateString()}
                    </div>
                  </div>

                  {job.skillsRequired && job.skillsRequired.length > 0 && (
                    <div className="mb-4">
                      <div className="d-flex flex-wrap gap-2">
                        {job.skillsRequired.map((skill, idx) => (
                          <span
                            key={idx}
                            className="badge bg-light text-dark px-2.5 py-1.5 rounded-pill border small"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Show Configured Availability timings */}
                  {job.availability && job.availability.length > 0 && (
                    <div className="mb-4 bg-light p-3 rounded-3 border">
                      <span className="text-muted small d-block mb-2 fw-bold">
                        <FiClock className="me-1 text-primary" /> Interview
                        Schedules (Hirovate Days)
                      </span>
                      <div className="d-flex flex-column gap-2">
                        {job.availability.map((avail, idx) => (
                          <div
                            key={idx}
                            className="d-flex justify-content-between align-items-center small text-dark border-bottom pb-1 mb-1 last-mb-0 last-pb-0 last-border-0"
                          >
                            <span>
                              {new Date(avail.date).toLocaleDateString()}
                            </span>
                            <span className="badge bg-primary-light text-primary">
                              {avail.startTime} — {avail.endTime}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-auto pt-3 border-top d-flex justify-content-end align-items-center flex-wrap gap-2">
                    {isClosed ? (
                      <button
                        className="btn btn-secondary px-4 fw-bold text-uppercase"
                        disabled
                        style={{ fontSize: "0.8rem" }}
                      >
                        Interview Closed
                      </button>
                    ) : appliedJobIds.has(job._id?.toString()) ? (
                      <button
                        className="btn btn-secondary px-4 fw-bold text-uppercase"
                        disabled
                        style={{ fontSize: "0.8rem" }}
                      >
                        Already Applied
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary px-4 fw-bold"
                        onClick={() => handleOpenApplyModal(job)}
                      >
                        Direct Apply
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-12 text-center py-5">
            <FiBriefcase className="text-muted display-4 mb-3" />
            <h5 className="text-muted fw-bold">
              No vacancy postings match your filters.
            </h5>
          </div>
        )}
      </div>

      {/* Direct Apply Modal */}
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
                    {selectedJob.company?.companyName} • Package:{" "}
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
                  You are applying directly for the following placement position at the Hirovate drive:
                </p>
                <div className="p-3 bg-light rounded-3 border mb-3">
                  <h6 className="fw-bold text-dark mb-2">{selectedJob.title}</h6>
                  <p className="text-muted small mb-1">
                    <strong>Company:</strong> {selectedJob.company?.companyName || selectedJob.company?.name || 'N/A'}
                  </p>
                  <p className="text-muted small mb-1">
                    <strong>Package:</strong> {selectedJob.salaryPackage}
                  </p>
                  <p className="text-muted small mb-0">
                    <strong>Location:</strong> {selectedJob.location} ({selectedJob.workMode})
                  </p>
                </div>
                <div className="alert alert-info border-0 rounded-3 small d-flex align-items-center gap-2 mb-0">
                  <FiClock className="fs-5 text-primary flex-shrink-0" />
                  <span>
                    Recruiters will evaluate your profile and contact you directly to conduct face-to-face interviews at the venue.
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

export default Jobs;
