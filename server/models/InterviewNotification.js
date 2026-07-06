const mongoose = require('mongoose');

const interviewNotificationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['queue_start', 'turn_near', 'turn_arrived', 'missed', 'completed'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  readStatus: {
    type: Boolean,
    default: false
  },
  sentAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('InterviewNotification', interviewNotificationSchema);
