const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  university: { type: String, default: '' },
  degree: { type: String, default: '' },
  graduationYear: { type: Number },
  cgpa: { type: Number },
  skills: { type: [String], default: [] },
  educations: [
    {
      degree: { type: String, default: '' },
      school: { type: String, default: '' },
      year: { type: Number },
      scoreType: { type: String, enum: ['CGPA', 'Percentage'], default: 'CGPA' },
      scoreValue: { type: Number }
    }
  ],
  courseName: { type: String, default: '' },
  courseGrade: { type: String, default: '' },
  projects: [{
    title: String,
    description: String,
    technologies: [String],
    link: String
  }],
  certifications: [{
    name: String,
    issuer: String,
    date: Date,
    url: String
  }],
  achievements: [String],
  salutation: { type: String, default: '' },
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  contactNumber: { type: String, default: '' },
  email: { type: String, default: '' },
  dob: { type: String, default: '' },
  gender: { type: String, default: '' },
  addressDetails: {
    state: { type: String, default: '' },
    city: { type: String, default: '' },
    area: { type: String, default: '' },
    pincode: { type: String, default: '' },
    address: { type: String, default: '' }
  },
  socialLinks: {
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' },
    portfolio: { type: String, default: '' },
    twitter: { type: String, default: '' }
  },
  profileImageUrl: { type: String, default: '' },
  resumeUrl: { type: String, default: '' },
  portfolioUrl: { type: String, default: '' },
  githubUrl: { type: String, default: '' },
  linkedinUrl: { type: String, default: '' },
  resumeScore: { type: Number, default: 0 },
  profileCompletionPercentage: { type: Number, default: 10 },
  qrCodeUrl: { type: String, default: '' },
  attendanceRecords: [{
    eventId: { type: mongoose.Schema.ObjectId, ref: 'Event' },
    date: Date,
    status: { type: String, enum: ['Present', 'Absent'], default: 'Present' }
  }]
}, { timestamps: true });

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
