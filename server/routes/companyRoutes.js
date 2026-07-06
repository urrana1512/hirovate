const express = require('express');
const router = express.Router();
const { getCompanies, getCompanyById } = require('../controllers/companyController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('student')); // For now, only students query companies

router.get('/', getCompanies);
router.get('/:id', getCompanyById);

module.exports = router;
