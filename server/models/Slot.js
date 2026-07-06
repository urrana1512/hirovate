const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.ObjectId,
    ref: 'CompanyProfile',
    required: true,
  },
  date: { type: Date, required: true },
  startTime: { type: String, required: true }, // e.g., '10:00 AM'
  endTime: { type: String, required: true },
  venue: { type: String, required: true },
  capacity: { type: Number, required: true },
  bookedCount: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['open', 'full', 'completed', 'cancelled'],
    default: 'open'
  }
}, { timestamps: true });

module.exports = mongoose.model('Slot', slotSchema);
