const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');

// All admin endpoints require protect and authorize('admin')
router.use(protect);
router.use(authorize('admin'));

// Dashboard & Overview
router.get('/dashboard', adminController.getDashboard);

// Student Management
router.get('/students', adminController.getStudents);
router.put('/students/:id/profile', adminController.updateStudentProfile);
router.put('/users/:id/status', adminController.updateUserStatus);

// Recruiter & Company Management
router.get('/recruiters', adminController.getRecruiters);
router.route('/companies')
  .get(adminController.getCompanies)
  .post(adminController.createCompany);

// Jobs, Applications, & Slots
router.get('/jobs', adminController.getJobs);
router.get('/applications', adminController.getApplications);
router.route('/slots')
  .get(adminController.getSlots)
  .post(adminController.createSlot);
router.route('/slots/:id')
  .delete(adminController.deleteSlot);

// Feedbacks & Logs
router.get('/feedbacks', adminController.getFeedbacks);
router.get('/logs', adminController.getActivityLogs);

// System Configurations
router.route('/settings')
  .get(adminController.getSystemSettings)
  .put(adminController.updateSystemSettings);

module.exports = router;
