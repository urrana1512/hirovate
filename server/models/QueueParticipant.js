const mongoose = require('mongoose');

const queueParticipantSchema = new mongoose.Schema({
  queue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InterviewQueue',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  studentProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudentProfile',
    required: true
  },
  queuePosition: {
    type: Number,
    required: true
  },
  interviewStatus: {
    type: String,
    enum: ['waiting', 'turn_near', 'current', 'completed', 'absent'],
    default: 'waiting'
  },
  notificationStatus: {
    type: String,
    enum: ['none', 'sent'],
    default: 'none'
  },
  callStatus: {
    type: String,
    enum: ['pending', 'initiated', 'completed'],
    default: 'pending'
  },
  emailStatus: {
    type: String,
    enum: ['pending', 'sent'],
    default: 'pending'
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('QueueParticipant', queueParticipantSchema);
