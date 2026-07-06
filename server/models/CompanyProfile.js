const mongoose = require('mongoose');

const companyProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  companyName: { type: String, required: true },
  description: { type: String },
  industry: { type: String },
  location: { type: String },
  website: { type: String },
  logoUrl: { type: String, default: '' },
  hiringRoles: [{
    title: { type: String },
    package: { type: String }, // e.g., '10-15 LPA'
    vacancies: { type: Number },
    skillsRequired: [String],
    eligibilityCriteria: { type: String }
  }],
  attendanceTimings: [{
    date: { type: Date },
    startTime: { type: String, default: '09:00 AM' },
    endTime: { type: String, default: '05:00 PM' },
    attending: { type: Boolean, default: true }
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'hiring_closed'],
    default: 'active'
  }
}, { timestamps: true });

module.exports = mongoose.model('CompanyProfile', companyProfileSchema);
