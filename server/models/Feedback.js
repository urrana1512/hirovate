const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.ObjectId,
    ref: 'CompanyProfile',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['platform_experience', 'interview_process', 'event'],
    default: 'platform_experience',
  }
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
