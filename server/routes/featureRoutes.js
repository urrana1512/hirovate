const express = require('express');
const { downloadAdmitCard, triggerNotification } = require('../controllers/featureController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Allow students to download their admit cards
router.get('/admit-card/:applicationId', protect, downloadAdmitCard);

// Allow admins and companies to trigger notifications
router.post('/notify', protect, authorize('admin', 'company'), triggerNotification);

module.exports = router;
