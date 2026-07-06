const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Placement Drive', 'Webinar', 'Workshop', 'Seminar', 'Other'],
    default: 'Placement Drive',
  },
  date: {
    type: Date,
    required: true,
  },
  venue: {
    type: String,
    required: true, // Can be a URL for online events
  },
  organizer: {
    type: mongoose.Schema.ObjectId,
    ref: 'CompanyProfile', // Optional, if organized by a specific company
  },
  registeredStudents: [{
    type: mongoose.Schema.ObjectId,
    ref: 'StudentProfile'
  }],
  status: {
    type: String,
    enum: ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'],
    default: 'Upcoming'
  },
  coverImageUrl: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
