const CompanyProfile = require('../models/CompanyProfile');
const Slot = require('../models/Slot');
const Application = require('../models/Application');
const StudentProfile = require('../models/StudentProfile');
const User = require('../models/User');
const Job = require('../models/Job');
const Interview = require('../models/Interview');
const Feedback = require('../models/Feedback');
const Notification = require('../models/Notification');

// Helper to get company profile by logged-in user, auto-creating if absent
const getCompanyByUserId = async (userId) => {
  let company = await CompanyProfile.findOne({ user: userId });
  if (!company) {
    const user = await User.findById(userId);
    if (user) {
      company = await CompanyProfile.create({
        user: userId,
        companyName: user.name || 'Company Name',
        industry: 'Technology',
        location: 'Not Specified',
        website: 'https://example.com',
        description: 'About the company...',
        status: 'active'
      });
      console.log(`Auto-created CompanyProfile for user: ${user.email}`);
    }
  }
  return company;
};

// @desc    Get recruiter dashboard stats
// @route   GET /api/recruiter/dashboard
// @access  Private/Recruiter
exports.getDashboard = async (req, res) => {
  try {
    const company = await getCompanyByUserId(req.user.id);
    if (!company) {
      return res.status(404).json({ message: 'Company profile not found' });
    }

    const totalApplicants = await Application.countDocuments({ company: company._id });
    const shortlistedCount = await Application.countDocuments({ company: company._id, status: 'shortlisted' });
    const selectedCount = await Application.countDocuments({ company: company._id, status: 'selected' });
    const rejectedCount = await Application.countDocuments({ company: company._id, status: 'rejected' });
    const activeJobsCount = await Job.countDocuments({ company: company._id, status: 'active' });

    const slots = await Slot.find({ company: company._id });
    const totalSlots = slots.length;
    let capacityLeft = 0;
    slots.forEach(s => {
      capacityLeft += Math.max(0, s.capacity - s.bookedCount);
    });

    // Mock trend chart data
    const trendData = [
      { name: 'Mon', applicants: Math.floor(totalApplicants * 0.15) || 5 },
      { name: 'Tue', applicants: Math.floor(totalApplicants * 0.25) || 8 },
      { name: 'Wed', applicants: Math.floor(totalApplicants * 0.2) || 4 },
      { name: 'Thu', applicants: Math.floor(totalApplicants * 0.3) || 12 },
      { name: 'Fri', applicants: Math.floor(totalApplicants * 0.1) || 3 },
    ];

    res.status(200).json({
      success: true,
      data: {
        totalApplicants,
        shortlistedCount,
        selectedCount,
        rejectedCount,
        activeJobsCount,
        totalSlots,
        capacityLeft,
        trendData
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get company profile
// @route   GET /api/recruiter/profile
// @access  Private/Recruiter
exports.getProfile = async (req, res) => {
  try {
    const company = await getCompanyByUserId(req.user.id);
    if (!company) {
      return res.status(404).json({ message: 'Company profile not found' });
    }

    // Pre-populate attendanceTimings if missing or empty
    if (!company.attendanceTimings || company.attendanceTimings.length === 0) {
      const SystemSetting = require('../models/SystemSetting');
      let datesSetting = await SystemSetting.findOne({ key: 'jobfest_dates' });
      const startDate = datesSetting?.value?.startDate || '2027-03-30';
      const endDate = datesSetting?.value?.endDate || '2027-03-31';

      // Generate date array
      const dates = [];
      let current = new Date(startDate);
      const stop = new Date(endDate);
      while (current <= stop) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }

      company.attendanceTimings = dates.map((date, idx) => ({
        date: date,
        startTime: '09:00 AM',
        endTime: idx === 0 ? '06:00 PM' : '05:00 PM',
        attending: true
      }));

      await company.save();
    }

    res.status(200).json({ success: true, data: company });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update company profile
// @route   PUT /api/recruiter/profile
// @access  Private/Recruiter
exports.updateProfile = async (req, res) => {
  try {
    let company = await getCompanyByUserId(req.user.id);
    if (!company) {
      return res.status(404).json({ message: 'Company profile not found' });
    }

    company = await CompanyProfile.findByIdAndUpdate(
      company._id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: company });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==========================================
// 💼 JOB MANAGEMENT APIs
// ==========================================

// @desc    Get all jobs for this recruiter
// @route   GET /api/recruiter/jobs
// @access  Private/Recruiter
exports.getJobs = async (req, res) => {
  try {
    const company = await getCompanyByUserId(req.user.id);
    if (!company) {
      return res.status(404).json({ message: 'Company profile not found' });
    }
    const jobs = await Job.find({ company: company._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const parseTimeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  // If it's a 24-hour format string (e.g., "09:00" or "18:00")
  if (timeStr.includes(':') && !timeStr.toLowerCase().includes('am') && !timeStr.toLowerCase().includes('pm')) {
    const parts = timeStr.split(':');
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
  }
  
  // Fallback support for older AM/PM records
  const matches = timeStr.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
  if (!matches) return 0;
  let hours = parseInt(matches[1], 10);
  const minutes = parseInt(matches[2], 10);
  const ampm = matches[3].toUpperCase();

  if (ampm === 'PM' && hours < 12) hours += 12;
  if (ampm === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
};

// @desc    Create a new job
// @route   POST /api/recruiter/jobs
// @access  Private/Recruiter
exports.createJob = async (req, res) => {
  try {
    const company = await getCompanyByUserId(req.user.id);
    if (!company) {
      return res.status(404).json({ message: 'Company profile not found' });
    }

    // Validate job availability timing against company attendance hours
    if (req.body.availability && req.body.availability.length > 0) {
      for (const jobAvail of req.body.availability) {
        const jobDateStr = new Date(jobAvail.date).toISOString().split('T')[0];
        
        const compAvail = company.attendanceTimings?.find(a => 
          new Date(a.date).toISOString().split('T')[0] === jobDateStr
        );

        if (!compAvail || !compAvail.attending) {
          return res.status(400).json({ 
            message: `Your company is not scheduled to attend JobFest on ${jobDateStr}. Please update your Attendance timings in profile setup first.` 
          });
        }

        const compStart = parseTimeToMinutes(compAvail.startTime);
        const compEnd = parseTimeToMinutes(compAvail.endTime);
        const jobStart = parseTimeToMinutes(jobAvail.startTime);
        const jobEnd = parseTimeToMinutes(jobAvail.endTime);

        if (jobStart < compStart || jobEnd > compEnd) {
          return res.status(400).json({ 
            message: `Interview timing for ${jobDateStr} (${jobAvail.startTime} — ${jobAvail.endTime}) must fall within your company's overall attendance hours (${compAvail.startTime} — ${compAvail.endTime}).` 
          });
        }
      }
    }

    const newJob = await Job.create({
      ...req.body,
      company: company._id
    });
    res.status(201).json({ success: true, data: newJob });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update a job
// @route   PUT /api/recruiter/jobs/:id
// @access  Private/Recruiter
exports.updateJob = async (req, res) => {
  try {
    const company = await getCompanyByUserId(req.user.id);
    if (!company) {
      return res.status(404).json({ message: 'Company profile not found' });
    }

    // Validate job availability timing against company attendance hours
    if (req.body.availability && req.body.availability.length > 0) {
      for (const jobAvail of req.body.availability) {
        const jobDateStr = new Date(jobAvail.date).toISOString().split('T')[0];
        
        const compAvail = company.attendanceTimings?.find(a => 
          new Date(a.date).toISOString().split('T')[0] === jobDateStr
        );

        if (!compAvail || !compAvail.attending) {
          return res.status(400).json({ 
            message: `Your company is not scheduled to attend JobFest on ${jobDateStr}. Please update your Attendance timings in profile setup first.` 
          });
        }

        const compStart = parseTimeToMinutes(compAvail.startTime);
        const compEnd = parseTimeToMinutes(compAvail.endTime);
        const jobStart = parseTimeToMinutes(jobAvail.startTime);
        const jobEnd = parseTimeToMinutes(jobAvail.endTime);

        if (jobStart < compStart || jobEnd > compEnd) {
          return res.status(400).json({ 
            message: `Interview timing for ${jobDateStr} (${jobAvail.startTime} — ${jobAvail.endTime}) must fall within your company's overall attendance hours (${compAvail.startTime} — ${compAvail.endTime}).` 
          });
        }
      }
    }

    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, company: company._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!job) {
      return res.status(404).json({ message: 'Job not found or unauthorized' });
    }
    res.status(200).json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a job
// @route   DELETE /api/recruiter/jobs/:id
// @access  Private/Recruiter
exports.deleteJob = async (req, res) => {
  try {
    const company = await getCompanyByUserId(req.user.id);
    if (!company) {
      return res.status(404).json({ message: 'Company profile not found' });
    }
    const job = await Job.findOneAndDelete({ _id: req.params.id, company: company._id });
    if (!job) {
      return res.status(404).json({ message: 'Job not found or unauthorized' });
    }
    res.status(200).json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==========================================
// 🎟 SLOT MANAGEMENT APIs
// ==========================================

exports.getSlots = async (req, res) => {
  try {
    const company = await getCompanyByUserId(req.user.id);
    if (!company) {
      return res.status(404).json({ message: 'Company profile not found' });
    }
    const slots = await Slot.find({ company: company._id }).sort({ date: 1 });
    res.status(200).json({ success: true, data: slots });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createSlot = async (req, res) => {
  try {
    const company = await getCompanyByUserId(req.user.id);
    if (!company) {
      return res.status(404).json({ message: 'Company profile not found' });
    }

    // Validate slot timing against company overall attendance hours
    if (req.body.date && req.body.startTime && req.body.endTime) {
      const slotDateStr = new Date(req.body.date).toISOString().split('T')[0];
      
      const compAvail = company.attendanceTimings?.find(a => 
        new Date(a.date).toISOString().split('T')[0] === slotDateStr
      );

      if (!compAvail || !compAvail.attending) {
        return res.status(400).json({ 
          message: `Your company is not scheduled to attend JobFest on ${slotDateStr}. Please update your Attendance timings in profile setup first.` 
        });
      }

      const compStart = parseTimeToMinutes(compAvail.startTime);
      const compEnd = parseTimeToMinutes(compAvail.endTime);
      const slotStart = parseTimeToMinutes(req.body.startTime);
      const slotEnd = parseTimeToMinutes(req.body.endTime);

      if (slotStart < compStart || slotEnd > compEnd) {
        return res.status(400).json({ 
          message: `Slot timing (${req.body.startTime} — ${req.body.endTime}) must fall within your company's overall attendance hours (${compAvail.startTime} — ${compAvail.endTime}).` 
        });
      }
    }

    const newSlot = await Slot.create({
      ...req.body,
      company: company._id
    });
    res.status(201).json({ success: true, data: newSlot });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteSlot = async (req, res) => {
  try {
    const company = await getCompanyByUserId(req.user.id);
    if (!company) {
      return res.status(404).json({ message: 'Company profile not found' });
    }
    const slot = await Slot.findOneAndDelete({ _id: req.params.id, company: company._id });
    if (!slot) {
      return res.status(404).json({ message: 'Slot not found or unauthorized' });
    }
    res.status(200).json({ success: true, message: 'Slot deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==========================================
// 👨‍🎓 APPLICANTS & INTERVIEW MANAGEMENT APIs
// ==========================================

exports.getApplicants = async (req, res) => {
  try {
    const company = await getCompanyByUserId(req.user.id);
    if (!company) {
      return res.status(404).json({ message: 'Company profile not found' });
    }
    const applications = await Application.find({ company: company._id })
      .populate('student', 'name email phone')
      .populate('slot')
      .populate('job');

    const enriched = await Promise.all(applications.map(async app => {
      if (app.student) {
        const studentProfile = await StudentProfile.findOne({ user: app.student._id });
        return { ...app.toObject(), studentProfile };
      }
      return app.toObject();
    }));

    res.status(200).json({ success: true, data: enriched });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateApplicantStatus = async (req, res) => {
  try {
    const company = await getCompanyByUserId(req.user.id);
    if (!company) {
      return res.status(404).json({ message: 'Company profile not found' });
    }
    const application = await Application.findOneAndUpdate(
      { _id: req.params.id, company: company._id },
      { status: req.body.status },
      { new: true }
    );
    if (!application) {
      return res.status(404).json({ message: 'Application not found or unauthorized' });
    }

    try {
      if (req.body.status === 'applied') {
        await Notification.create({
          user: application.student,
          title: 'Decision Pending',
          message: `Your application status for ${company.companyName} is now set to Pending. Recruiters are evaluating your details and will get back to you shortly!`,
          type: 'warning'
        });
      } else {
        const statusTitle = req.body.status === 'shortlisted' ? 'Shortlisted' : req.body.status === 'selected' ? 'Selected' : 'Rejected';
        const statusType = req.body.status === 'selected' ? 'success' : req.body.status === 'rejected' ? 'error' : 'info';
        await Notification.create({
          user: application.student,
          title: `Application ${statusTitle}`,
          message: `Your application status for ${company.companyName} has been updated to: ${statusTitle}.`,
          type: statusType
        });
      }
    } catch (notifErr) {
      console.error('Failed to create notification:', notifErr.message);
    }

    res.status(200).json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all scheduled interviews
// @route   GET /api/recruiter/interviews
// @access  Private/Recruiter
exports.getInterviews = async (req, res) => {
  try {
    const company = await getCompanyByUserId(req.user.id);
    if (!company) {
      return res.status(404).json({ message: 'Company profile not found' });
    }
    const interviews = await Interview.find({ company: company._id })
      .populate('student', 'name email phone')
      .populate('application');
    res.status(200).json({ success: true, data: interviews });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create/Schedule an interview round
// @route   POST /api/recruiter/interviews
// @access  Private/Recruiter
exports.createInterview = async (req, res) => {
  try {
    const company = await getCompanyByUserId(req.user.id);
    if (!company) {
      return res.status(404).json({ message: 'Company profile not found' });
    }
    const interview = await Interview.create({
      ...req.body,
      company: company._id
    });
    res.status(201).json({ success: true, data: interview });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==========================================
// ⭐ SUBMIT FEEDBACK REPORT
// ==========================================

exports.createPlatformFeedback = async (req, res) => {
  try {
    const company = await getCompanyByUserId(req.user.id);
    if (!company) {
      return res.status(404).json({ message: 'Company profile not found' });
    }
    const feedback = await Feedback.create({
      ...req.body,
      company: company._id
    });
    res.status(201).json({ success: true, data: feedback });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Toggle company recruitment closed status
// @route   PUT /api/recruiter/toggle-status
// @access  Private/Recruiter
exports.toggleCompanyStatus = async (req, res) => {
  try {
    const company = await getCompanyByUserId(req.user.id);
    if (!company) {
      return res.status(404).json({ message: 'Company profile not found' });
    }

    const newStatus = company.status === 'hiring_closed' ? 'active' : 'hiring_closed';
    company.status = newStatus;
    await company.save();

    // If company closed, automatically close all their active jobs
    if (newStatus === 'hiring_closed') {
      await Job.updateMany({ company: company._id }, { status: 'closed' });
    }

    res.status(200).json({ success: true, data: company });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
