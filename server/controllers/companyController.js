const CompanyProfile = require('../models/CompanyProfile');
const User = require('../models/User');
const Job = require('../models/Job');
const Slot = require('../models/Slot');

// @desc    Get all active companies (for students)
// @route   GET /api/companies
// @access  Private/Student
exports.getCompanies = async (req, res) => {
  try {
    const companies = await CompanyProfile.find({ status: 'active' }).populate('user', 'name email');
    res.status(200).json({ success: true, data: companies });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get company by ID with jobs and slots
// @route   GET /api/companies/:id
// @access  Private/Student
exports.getCompanyById = async (req, res) => {
  try {
    const company = await CompanyProfile.findById(req.params.id).populate('user', 'name email');
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Find all active job roles posted by this company
    const jobs = await Job.find({ company: company._id, status: 'active' });

    // Find all open interview slots for this company
    const slots = await Slot.find({ company: company._id, status: 'open' });

    res.status(200).json({
      success: true,
      data: {
        company,
        jobs,
        slots
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
