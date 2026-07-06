const mongoose = require('mongoose');

const interviewQueueSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CompanyProfile',
    required: true
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  queueStatus: {
    type: String,
    enum: ['active', 'paused', 'completed'],
    default: 'active'
  },
  currentCandidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QueueParticipant',
    default: null
  },
  queueOrder: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QueueParticipant'
  }],
  estimatedWaitTime: {
    type: Number,
    default: 0 // In minutes
  },
  venue: {
    type: String,
    default: 'Interview Room A'
  }
}, { timestamps: true });

module.exports = mongoose.model('InterviewQueue', interviewQueueSchema);
