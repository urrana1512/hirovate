const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  company: {
    type: mongoose.Schema.ObjectId,
    ref: 'CompanyProfile',
    required: true,
  },
  slot: {
    type: mongoose.Schema.ObjectId,
    ref: 'Slot',
    required: false,
  },
  job: {
    type: mongoose.Schema.ObjectId,
    ref: 'Job',
    required: true,
  },
  status: {
    type: String,
    enum: ['applied', 'shortlisted', 'interview_scheduled', 'selected', 'rejected'],
    default: 'applied'
  },
  admitCardUrl: {
    type: String,
    default: ''
  }
}, { timestamps: true });

// Prevent multiple applications to the same job by the same student
applicationSchema.index({ student: 1, job: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
