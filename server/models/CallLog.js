const mongoose = require('mongoose');

const callLogSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  callStatus: {
    type: String,
    enum: ['success', 'failed'],
    default: 'success'
  },
  callDuration: {
    type: Number,
    default: 10 // Mock duration
  },
  callTime: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('CallLog', callLogSchema);
