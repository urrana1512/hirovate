const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.ObjectId,
    ref: 'CompanyProfile',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Please provide a job title'],
    trim: true,
  },
  role: {
    type: String,
    required: [true, 'Please provide a job role'],
    trim: true,
  },
  salaryPackage: {
    type: String,
    required: [true, 'Please provide a salary package'],
  },
  experienceRequired: {
    type: String,
    required: [true, 'Please provide experience requirements'],
  },
  skillsRequired: {
    type: [String],
    default: [],
  },
  eligibilityCriteria: {
    type: String,
    required: [true, 'Please provide eligibility criteria'],
  },
  location: {
    type: String,
    required: [true, 'Please provide location'],
  },
  workMode: {
    type: String,
    enum: ['on-site', 'remote', 'hybrid'],
    default: 'on-site',
  },
  deadline: {
    type: Date,
    required: [true, 'Please provide application deadline'],
  },
  openings: {
    type: Number,
    required: [true, 'Please provide number of openings'],
  },
  rounds: {
    type: [String],
    default: ['Technical Test', 'Technical Interview', 'HR Interview'],
  },
  status: {
    type: String,
    enum: ['active', 'closed', 'draft', 'upcoming'],
    default: 'active',
  },
  availability: [
    {
      date: Date,
      startTime: String,
      endTime: String
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
