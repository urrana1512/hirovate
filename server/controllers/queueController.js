const InterviewQueue = require('../models/InterviewQueue');
const QueueParticipant = require('../models/QueueParticipant');
const InterviewNotification = require('../models/InterviewNotification');
const CallLog = require('../models/CallLog');
const CompanyProfile = require('../models/CompanyProfile');
const Application = require('../models/Application');
const StudentProfile = require('../models/StudentProfile');
const User = require('../models/User');
const Job = require('../models/Job');
const { sendEmail } = require('../utils/notificationService');

// Helper to broadcast queue updates via Socket.IO
const broadcastQueueUpdate = (req, companyId, jobId) => {
  const io = req.app.get('io');
  if (io) {
    io.emit('queue_updated', { companyId, jobId });
    console.log(`[Socket] Broadcasted queue_updated event for company ${companyId}, job ${jobId}`);
  }
};

// @desc    Start/Initialize an interview queue session
// @route   POST /api/queue/start
// @access  Private/Recruiter (Company)
exports.startQueueSession = async (req, res) => {
  try {
    const { jobId, venue } = req.body;
    
    // Get company profile
    const company = await CompanyProfile.findOne({ user: req.user.id });
    if (!company) {
      return res.status(404).json({ message: 'Company profile not found' });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job opening not found' });
    }

    // Check if queue already exists for this job opening
    let queue = await InterviewQueue.findOne({ company: company._id, job: jobId });
    
    if (queue) {
      // Re-activate existing queue
      queue.queueStatus = 'active';
      queue.venue = venue || queue.venue;
      await queue.save();
    } else {
      // Create new active queue
      queue = await InterviewQueue.create({
        company: company._id,
        job: jobId,
        recruiter: req.user.id,
        queueStatus: 'active',
        venue: venue || 'Interview Room A',
        estimatedWaitTime: 0
      });
    }

    // Enroll students who applied to this specific job
    const applications = await Application.find({ job: jobId, company: company._id });
    
    // Clear old participants for clean starting state
    await QueueParticipant.deleteMany({ queue: queue._id });

    const participants = [];
    let position = 1;

    for (const app of applications) {
      const studentProfile = await StudentProfile.findOne({ user: app.student });
      if (studentProfile) {
        const participant = await QueueParticipant.create({
          queue: queue._id,
          student: app.student,
          studentProfile: studentProfile._id,
          queuePosition: position++,
          interviewStatus: 'waiting'
        });
        participants.push(participant._id);

        // Send dynamic starting notification
        await InterviewNotification.create({
          student: app.student,
          type: 'queue_start',
          message: `The live interview drive for ${company.companyName} (${job.title}) has started! Please open your dynamic queue console.`
        });
      }
    }

    queue.queueOrder = participants;
    if (participants.length > 0) {
      queue.currentCandidate = null; // Stays null until first callNextCandidate
      queue.estimatedWaitTime = participants.length * 15; // 15 mins per candidate average
    }
    await queue.save();

    broadcastQueueUpdate(req, company._id, jobId);

    res.status(200).json({
      success: true,
      message: 'Interview Queue session started successfully!',
      data: queue
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Call next candidate in the queue
// @route   POST /api/queue/next
// @access  Private/Recruiter (Company)
exports.callNextCandidate = async (req, res) => {
  try {
    const { queueId } = req.body;
    const queue = await InterviewQueue.findById(queueId)
      .populate('company')
      .populate('job');

    if (!queue) {
      return res.status(404).json({ message: 'Active queue not found' });
    }

    // 1. Mark previous active candidate as completed
    if (queue.currentCandidate) {
      await QueueParticipant.findByIdAndUpdate(queue.currentCandidate, {
        interviewStatus: 'completed',
        queuePosition: 0
      });
    }

    // 2. Fetch all waiting or turn_near participants in current order
    const waitingList = await QueueParticipant.find({
      queue: queue._id,
      interviewStatus: { $in: ['waiting', 'turn_near'] }
    }).sort({ queuePosition: 1 });

    if (waitingList.length === 0) {
      queue.currentCandidate = null;
      queue.queueStatus = 'completed';
      queue.estimatedWaitTime = 0;
      await queue.save();

      broadcastQueueUpdate(req, queue.company._id, queue.job._id);

      return res.status(200).json({
        success: true,
        message: 'All applicants interviewed! Queue session successfully completed.',
        data: queue
      });
    }

    // 3. Promote next candidate in list to 'current'
    const nextCurrent = waitingList[0];
    nextCurrent.interviewStatus = 'current';
    nextCurrent.queuePosition = 0;
    await nextCurrent.save();

    queue.currentCandidate = nextCurrent._id;

    // Trigger Dynamic AI Voice Call Log
    const studentUser = await User.findById(nextCurrent.student);
    if (studentUser) {
      await CallLog.create({
        student: nextCurrent.student,
        phoneNumber: studentUser.phone || '9999999999',
        callStatus: 'success',
        callDuration: 12
      });

      // Email Notification - Turn Arrived
      await sendEmail({
        email: studentUser.email,
        subject: `Your Interview Turn Has Arrived | JobFest`,
        message: `Hello ${studentUser.name},\n\nYour interview turn for ${queue.company.companyName} - ${queue.job.title} has arrived!\n\nPlease report immediately at:\nVenue: ${queue.venue}\nTime: Right Now\n\nThank you,\nJobFest Team`
      });

      // In-App dynamic alert
      await InterviewNotification.create({
        student: nextCurrent.student,
        type: 'turn_arrived',
        message: `Your interview turn has arrived! Please report to ${queue.venue} immediately.`
      });
    }

    // 4. Update remaining students' position indices & notify "turn_near"
    const remaining = waitingList.slice(1);
    let index = 1;
    for (const p of remaining) {
      p.queuePosition = index;
      
      if (index === 1) {
        p.interviewStatus = 'turn_near';
        
        // Notify student that turn is coming next
        const remainingUser = await User.findById(p.student);
        if (remainingUser) {
          await sendEmail({
            email: remainingUser.email,
            subject: `Your Interview Turn Is Coming Soon | JobFest`,
            message: `Hello ${remainingUser.name},\n\nYour interview turn for ${queue.company.companyName} - ${queue.job.title} is coming soon.\n\nPlease be present at:\nVenue: ${queue.venue}\n\nCurrent Queue Position: 1\n\nThank you,\nJobFest Team`
          });

          await InterviewNotification.create({
            student: p.student,
            type: 'turn_near',
            message: `Your turn is near! You are next in line. Please get ready near ${queue.venue}.`
          });
        }
      } else {
        p.interviewStatus = 'waiting';
      }

      await p.save();
      index++;
    }

    queue.estimatedWaitTime = remaining.length * 15;
    await queue.save();

    broadcastQueueUpdate(req, queue.company._id, queue.job._id);

    res.status(200).json({
      success: true,
      message: 'Called next applicant successfully!',
      data: queue
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Skip candidate and delay by one position
// @route   POST /api/queue/skip
// @access  Private/Recruiter (Company)
exports.skipCandidate = async (req, res) => {
  try {
    const { queueId } = req.body;
    const queue = await InterviewQueue.findById(queueId);
    if (!queue) {
      return res.status(404).json({ message: 'Queue not found' });
    }

    // Fetch waiting candidates
    const waiting = await QueueParticipant.find({
      queue: queue._id,
      interviewStatus: { $in: ['waiting', 'turn_near'] }
    }).sort({ queuePosition: 1 });

    if (waiting.length < 2) {
      return res.status(400).json({ message: 'Cannot skip, not enough waiting candidates' });
    }

    // Swap position indices of index 0 and 1
    const first = waiting[0];
    const second = waiting[1];

    const tempPos = first.queuePosition;
    first.queuePosition = second.queuePosition;
    first.interviewStatus = 'waiting';
    second.queuePosition = tempPos;
    second.interviewStatus = 'turn_near';

    await first.save();
    await second.save();

    broadcastQueueUpdate(req, queue.company, queue.job);

    res.status(200).json({
      success: true,
      message: 'Candidate delayed successfully!'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Mark candidate absent / missed
// @route   POST /api/queue/absent
// @access  Private/Recruiter (Company)
exports.markAbsent = async (req, res) => {
  try {
    const { queueId } = req.body;
    const queue = await InterviewQueue.findById(queueId);
    if (!queue) {
      return res.status(404).json({ message: 'Queue not found' });
    }

    if (queue.currentCandidate) {
      const active = await QueueParticipant.findById(queue.currentCandidate);
      if (active) {
        active.interviewStatus = 'absent';
        active.queuePosition = 0;
        await active.save();

        const studentUser = await User.findById(active.student);
        if (studentUser) {
          await InterviewNotification.create({
            student: active.student,
            type: 'missed',
            message: `You missed your scheduled turn. Please report to the recruiters if you are still present.`
          });
        }
      }
      queue.currentCandidate = null;
      await queue.save();
    }

    // Promote the next candidate automatically
    broadcastQueueUpdate(req, queue.company, queue.job);

    res.status(200).json({
      success: true,
      message: 'Candidate marked absent. Move forward to call next applicant.'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Toggle Pause/Resume interview queue
// @route   PUT /api/queue/toggle
// @access  Private/Recruiter (Company)
exports.toggleQueueSession = async (req, res) => {
  try {
    const { queueId, status } = req.body; // status: 'active' or 'paused'
    const queue = await InterviewQueue.findByIdAndUpdate(queueId, { queueStatus: status }, { new: true });
    
    if (!queue) {
      return res.status(404).json({ message: 'Queue not found' });
    }

    broadcastQueueUpdate(req, queue.company, queue.job);

    res.status(200).json({
      success: true,
      message: `Queue session set to: ${status}`,
      data: queue
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get live queue metrics for active student
// @route   GET /api/queue/student
// @access  Private/Student
exports.getStudentLiveQueue = async (req, res) => {
  try {
    const participant = await QueueParticipant.findOne({
      student: req.user.id,
      interviewStatus: { $in: ['waiting', 'turn_near', 'current'] }
    });

    if (!participant) {
      return res.status(200).json({ success: true, data: null });
    }

    const queue = await InterviewQueue.findById(participant.queue)
      .populate('company')
      .populate('job')
      .populate({
        path: 'currentCandidate',
        populate: { path: 'student', select: 'name' }
      });

    // Count waiting list ahead of this student
    const aheadCount = await QueueParticipant.countDocuments({
      queue: queue._id,
      interviewStatus: { $in: ['waiting', 'turn_near'] },
      queuePosition: { $lt: participant.queuePosition }
    });

    res.status(200).json({
      success: true,
      data: {
        participant,
        queue,
        aheadCount,
        estimatedWaitMinutes: aheadCount * 15
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get live queue workspace for recruiter
// @route   GET /api/queue/recruiter/:jobId
// @access  Private/Recruiter (Company)
exports.getRecruiterQueueDashboard = async (req, res) => {
  try {
    const company = await CompanyProfile.findOne({ user: req.user.id });
    if (!company) {
      return res.status(404).json({ message: 'Company profile not found' });
    }

    const queue = await InterviewQueue.findOne({ company: company._id, job: req.params.jobId })
      .populate('job')
      .populate({
        path: 'currentCandidate',
        populate: { path: 'student', select: 'name email phone' }
      });

    if (!queue) {
      return res.status(200).json({ success: true, data: null });
    }

    // Get queue participants
    const participants = await QueueParticipant.find({ queue: queue._id })
      .populate('student', 'name email phone')
      .populate('studentProfile', 'cgpa courseName courseGrade');

    const totalInterviewed = participants.filter(p => p.interviewStatus === 'completed').length;
    const totalAbsent = participants.filter(p => p.interviewStatus === 'absent').length;
    const totalWaiting = participants.filter(p => ['waiting', 'turn_near'].includes(p.interviewStatus)).length;

    // Queue efficiency analytics
    const completionRatio = participants.length > 0 
      ? Math.round((totalInterviewed / participants.length) * 100) 
      : 100;

    res.status(200).json({
      success: true,
      data: {
        queue,
        participants,
        analytics: {
          totalWaiting,
          totalInterviewed,
          totalAbsent,
          completionRatio,
          averageWaitTime: 15 // Average minutes per candidate
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get student in-app notifications
// @route   GET /api/queue/notifications
// @access  Private/Student
exports.getQueueNotifications = async (req, res) => {
  try {
    const notifications = await InterviewNotification.find({ student: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10);
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
