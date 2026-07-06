const express = require('express');
const router = express.Router();
const { 
  getDashboard, 
  getProfile, 
  updateProfile, 
  getNotifications,
  markNotificationRead,
  getApplications,
  applyForCompany,
  getEvents,
  registerForEvent,
  changePassword,
  analyzeResume,
  getActiveJobs
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

// Student routes
router.get('/dashboard', authorize('student'), getDashboard);
router.get('/profile', authorize('student'), getProfile);
router.put('/profile', authorize('student'), updateProfile);

router.get('/jobs', authorize('student'), getActiveJobs);
router.get('/applications', authorize('student'), getApplications);
router.post('/applications', authorize('student'), applyForCompany);

router.get('/events', authorize('student'), getEvents);
router.post('/events/:id/register', authorize('student'), registerForEvent);

router.post('/resume-analyze', authorize('student'), analyzeResume);
router.put('/change-password', changePassword);

// Notifications
router.get('/notifications', getNotifications);
router.put('/notifications/:id/read', markNotificationRead);

module.exports = router;
