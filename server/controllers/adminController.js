const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const CompanyProfile = require('../models/CompanyProfile');
const Application = require('../models/Application');
const Job = require('../models/Job');
const Slot = require('../models/Slot');
const Feedback = require('../models/Feedback');
const ActivityLog = require('../models/ActivityLog');
const SystemSetting = require('../models/SystemSetting');

// @desc    Get admin dashboard overall statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getDashboard = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalRecruiters = await User.countDocuments({ role: 'company' });
    const totalCompanies = await CompanyProfile.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();
    const totalSlots = await Slot.countDocuments();

    // Get pending recruiters for instant approval list
    const pendingRecruiters = await User.find({ role: 'company', status: 'pending' }).select('name email status');

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalRecruiters,
        totalCompanies,
        totalJobs,
        totalApplications,
        totalSlots,
        pendingRecruiters
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==========================================
// 👨‍🎓 STUDENT MANAGEMENT APIs
// ==========================================

exports.getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password');
    const enriched = await Promise.all(students.map(async student => {
      const profile = await StudentProfile.findOne({ user: student._id });
      return { ...student.toObject(), profile };
    }));
    res.status(200).json({ success: true, data: enriched });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Log the transaction
    await ActivityLog.create({
      user: req.user.id,
      action: 'USER_STATUS_UPDATE',
      details: `Updated user ${user.email} status to: ${status}`
    });

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateStudentProfile = async (req, res) => {
  try {
    const { courseName, courseGrade } = req.body;
    let profile = await StudentProfile.findOne({ user: req.params.id });
    if (!profile) {
      profile = await StudentProfile.create({
        user: req.params.id,
        courseName: courseName || '',
        courseGrade: courseGrade || ''
      });
    } else {
      profile.courseName = courseName !== undefined ? courseName : profile.courseName;
      profile.courseGrade = courseGrade !== undefined ? courseGrade : profile.courseGrade;
      await profile.save();
    }

    await ActivityLog.create({
      user: req.user.id,
      action: 'STUDENT_PROFILE_GRADE_UPDATE',
      details: `Updated student user id ${req.params.id} course to ${courseName} and grade to ${courseGrade}`
    });

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==========================================
// 🏢 RECRUITER & COMPANY MANAGEMENT APIs
// ==========================================

exports.getRecruiters = async (req, res) => {
  try {
    const recruiters = await User.find({ role: 'company' }).select('-password');
    const enriched = await Promise.all(recruiters.map(async rec => {
      const profile = await CompanyProfile.findOne({ user: rec._id });
      return { ...rec.toObject(), profile };
    }));
    res.status(200).json({ success: true, data: enriched });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getCompanies = async (req, res) => {
  try {
    const companies = await CompanyProfile.find().populate('user', 'name email status');
    res.status(200).json({ success: true, data: companies });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createCompany = async (req, res) => {
  try {
    const newCompany = await CompanyProfile.create(req.body);
    res.status(201).json({ success: true, data: newCompany });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==========================================
// 💼 JOB MANAGEMENT APIs
// ==========================================

exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate('company', 'companyName location');
    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==========================================
// 📝 APPLICATIONS MANAGEMENT APIs
// ==========================================

exports.getApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('student', 'name email')
      .populate('company', 'companyName')
      .populate('slot');

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

// ==========================================
// 🎟 SLOT MANAGEMENT APIs
// ==========================================

exports.getSlots = async (req, res) => {
  try {
    const slots = await Slot.find().populate('company', 'companyName');
    res.status(200).json({ success: true, data: slots });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createSlot = async (req, res) => {
  try {
    const slot = await Slot.create(req.body);
    res.status(201).json({ success: true, data: slot });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteSlot = async (req, res) => {
  try {
    const slot = await Slot.findByIdAndDelete(req.params.id);
    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }
    res.status(200).json({ success: true, message: 'Slot deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==========================================
// ⭐ FEEDBACKS & LOGS MANAGEMENT APIs
// ==========================================

exports.getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate('company', 'companyName');
    res.status(200).json({ success: true, data: feedbacks });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find()
      .populate('user', 'name email role')
      .sort({ createdAt: -1 })
      .limit(100);
    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getSystemSettings = async (req, res) => {
  try {
    let datesSetting = await SystemSetting.findOne({ key: 'hirovate_dates' });
    if (!datesSetting) {
      datesSetting = await SystemSetting.create({
        key: 'hirovate_dates',
        value: {
          startDate: '2027-03-30',
          endDate: '2027-03-31',
          eventName: 'Hirovate 2027',
          organizer: 'Hirovate Technologies'
        }
      });
    }
    res.status(200).json({ success: true, data: datesSetting.value });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateSystemSettings = async (req, res) => {
  try {
    const { startDate, endDate, eventName, organizer } = req.body;
    let datesSetting = await SystemSetting.findOneAndUpdate(
      { key: 'hirovate_dates' },
      {
        value: { startDate, endDate, eventName, organizer }
      },
      { new: true, upsert: true }
    );

    // Log the transaction
    await ActivityLog.create({
      user: req.user.id,
      action: 'SYSTEM_SETTINGS_UPDATE',
      details: `Updated Hirovate Config to: ${eventName} (${startDate} to ${endDate})`
    });

    res.status(200).json({ success: true, data: datesSetting.value });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
