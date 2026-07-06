const StudentProfile = require('../models/StudentProfile');
const CompanyProfile = require('../models/CompanyProfile');
const Notification = require('../models/Notification');
const Application = require('../models/Application');
const Slot = require('../models/Slot');
const Event = require('../models/Event');
const Job = require('../models/Job');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    Get student dashboard stats
// @route   GET /api/student/dashboard
// @access  Private/Student
exports.getDashboard = async (req, res) => {
  try {
    const studentProfile = await StudentProfile.findOne({ user: req.user.id });
    if (!studentProfile) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    // Get applications count
    const applicationsCount = await Application.countDocuments({ student: req.user.id });
    
    // Get upcoming interviews
    const upcomingInterviewsCount = await Application.countDocuments({ 
      student: req.user.id,
      status: 'interview_scheduled'
    });

    // Mock Activity Timeline Data
    const timeline = [
      { id: 1, title: 'Profile Updated', date: new Date(Date.now() - 86400000).toISOString(), type: 'profile' },
      { id: 2, title: 'Applied to TechCorp', date: new Date(Date.now() - 172800000).toISOString(), type: 'application' },
      { id: 3, title: 'Resume Uploaded', date: new Date(Date.now() - 259200000).toISOString(), type: 'resume' },
    ];

    // Mock Skill Analytics
    const skillAnalytics = [
      { name: 'Frontend', value: 85 },
      { name: 'Backend', value: 65 },
      { name: 'Database', value: 75 },
      { name: 'Problem Solving', value: 90 },
    ];

    res.status(200).json({
      success: true,
      data: {
        profileCompletion: studentProfile.profileCompletionPercentage,
        applicationsCount,
        upcomingInterviewsCount,
        resumeScore: studentProfile.resumeScore || 0,
        timeline,
        skillAnalytics
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get student profile
// @route   GET /api/student/profile
// @access  Private/Student
exports.getProfile = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.user.id }).populate('user', 'name email phone isVerified');
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update student profile
// @route   PUT /api/student/profile
// @access  Private/Student
exports.updateProfile = async (req, res) => {
  try {
    let profile = await StudentProfile.findOne({ user: req.user.id });
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Calculate basic profile completion
    let completion = 20; // Base
    if (req.body.skills && req.body.skills.length > 0) completion += 20;
    if (req.body.university) completion += 20;
    if (req.body.projects && req.body.projects.length > 0) completion += 20;
    if (req.body.resumeUrl) completion += 20;

    // Strip admin fields to prevent student modification
    delete req.body.courseName;
    delete req.body.courseGrade;

    const updatedData = {
      ...req.body,
      profileCompletionPercentage: completion
    };

    profile = await StudentProfile.findOneAndUpdate(
      { user: req.user.id },
      updatedData,
      { new: true, runValidators: true }
    ).populate('user', 'name email phone');

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get notifications
// @route   GET /api/student/notifications
// @access  Private
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(20);
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/student/notifications/:id/read
// @access  Private
exports.markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { isRead: true },
      { new: true }
    );
    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get student applications
// @route   GET /api/student/applications
// @access  Private/Student
exports.getApplications = async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user.id })
      .populate('company')
      .populate('slot')
      .populate('job');
    res.status(200).json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Apply for a company hiring slot
// @route   POST /api/student/applications
// @access  Private/Student
exports.applyForCompany = async (req, res) => {
  try {
    let { companyId, jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({ message: 'Please select a specific job or internship role' });
    }

    // If companyId not provided, resolve it from the job itself
    if (!companyId) {
      const jobDoc = await Job.findById(jobId);
      if (!jobDoc) {
        return res.status(404).json({ message: 'Job not found' });
      }
      companyId = jobDoc.company;
    }

    if (!companyId) {
      return res.status(400).json({ message: 'Unable to determine company for this job posting' });
    }

    // Check if already applied to this job
    const existingApp = await Application.findOne({ student: req.user.id, job: jobId });
    if (existingApp) {
      return res.status(400).json({ message: 'You have already applied to this specific role' });
    }

    // Create application
    const application = await Application.create({
      student: req.user.id,
      company: companyId,
      job: jobId,
      status: 'applied'
    });

    // Create a notification for the student
    await Notification.create({
      user: req.user.id,
      title: 'Application Submitted',
      message: `Your application has been successfully submitted!`,
      type: 'success'
    });

    res.status(201).json({ success: true, data: application });
  } catch (error) {
    // Handle MongoDB duplicate key error (student already applied to this job)
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already applied to this specific role' });
    }
    console.error('[applyForCompany error]', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all available events
// @route   GET /api/student/events
// @access  Private/Student
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('organizer');
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Register for an event
// @route   POST /api/student/events/:id/register
// @access  Private/Student
exports.registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const studentProfile = await StudentProfile.findOne({ user: req.user.id });
    if (!studentProfile) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    if (event.registeredStudents.includes(studentProfile._id)) {
      return res.status(400).json({ message: 'You are already registered for this event' });
    }

    event.registeredStudents.push(studentProfile._id);
    await event.save();

    // Also add to student profile attendance/records if needed
    res.status(200).json({ success: true, message: 'Registered for event successfully', data: event });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Change password
// @route   PUT /api/student/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');

    if (!user || !(await user.matchPassword(currentPassword))) {
      return res.status(401).json({ message: 'Invalid current password' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Analyze resume (Mock AI)
// @route   POST /api/student/resume-analyze
// @access  Private/Student
exports.analyzeResume = async (req, res) => {
  try {
    const { resumeText } = req.body;
    
    // Simulate ATS & keyword matching
    const score = Math.floor(Math.random() * 30) + 60; // 60-90
    const suggestions = [
      'Add more quantifiable impact metrics (e.g., increased performance by 20%)',
      'Integrate keywords like Docker, AWS, or CI/CD to enhance ATS visibility',
      'Refine the professional summary to highlight core technical expertise'
    ];

    // Update student's resume score in DB
    await StudentProfile.findOneAndUpdate(
      { user: req.user.id },
      { resumeScore: score },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: {
        score,
        suggestions,
        atsMatch: 'Good',
        keywordsFound: ['React', 'Node.js', 'Express', 'MongoDB', 'JavaScript']
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all active job/internship openings
// @route   GET /api/student/jobs
// @access  Private/Student
exports.getActiveJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'active' }).populate('company');
    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
