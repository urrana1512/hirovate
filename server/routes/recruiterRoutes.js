const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const recruiterController = require('../controllers/recruiterController');

// All recruiter endpoints are gated under protect & authorize('company')
router.use(protect);
router.use(authorize('company'));

// Dashboard & Profile
router.get('/dashboard', recruiterController.getDashboard);
router.route('/profile')
  .get(recruiterController.getProfile)
  .put(recruiterController.updateProfile);
router.put('/toggle-status', recruiterController.toggleCompanyStatus);

// Job Openings
router.route('/jobs')
  .get(recruiterController.getJobs)
  .post(recruiterController.createJob);
router.route('/jobs/:id')
  .put(recruiterController.updateJob)
  .delete(recruiterController.deleteJob);

// Seating Slots
router.route('/slots')
  .get(recruiterController.getSlots)
  .post(recruiterController.createSlot);
router.route('/slots/:id')
  .delete(recruiterController.deleteSlot);

// Applicants ATS
router.get('/applicants', recruiterController.getApplicants);
router.put('/applicants/:id/status', recruiterController.updateApplicantStatus);

// Technical Interviews
router.route('/interviews')
  .get(recruiterController.getInterviews)
  .post(recruiterController.createInterview);

// Ratings & Comments Feedbacks
router.post('/feedback', recruiterController.createPlatformFeedback);

module.exports = router;
