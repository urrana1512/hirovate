const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const queueController = require('../controllers/queueController');

router.use(protect);

router.post('/start', queueController.startQueueSession);
router.post('/next', queueController.callNextCandidate);
router.post('/skip', queueController.skipCandidate);
router.post('/absent', queueController.markAbsent);
router.put('/toggle', queueController.toggleQueueSession);
router.get('/student', queueController.getStudentLiveQueue);
router.get('/recruiter/:jobId', queueController.getRecruiterQueueDashboard);
router.get('/notifications', queueController.getQueueNotifications);

module.exports = router;
