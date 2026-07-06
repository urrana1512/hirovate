const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.ObjectId,
    ref: 'CompanyProfile',
    required: true,
  },
  student: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  application: {
    type: mongoose.Schema.ObjectId,
    ref: 'Application',
    required: true,
  },
  roundName: {
    type: String,
    required: true,
  },
  interviewType: {
    type: String,
    enum: ['technical', 'hr', 'gd', 'online'],
    default: 'technical',
  },
  date: {
    type: Date,
    required: true,
  },
  timeSlot: {
    type: String,
    required: true,
  },
  venue: {
    type: String,
    default: 'Seminar Hall A',
  },
  panelName: {
    type: String,
    default: 'Panel A',
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled',
  },
  feedback: {
    score: Number,
    comments: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Interview', interviewSchema);
