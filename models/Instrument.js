const mongoose = require('mongoose');
const { Schema } = mongoose;

const instrumentSchema = new Schema({
  serialNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  instrumentType: {
    type: String,
    enum: ['weighing_scale', 'taxi_meter', 'measuring_tape', 'balance', 'other'],
    required: true
  },
  manufacturer: {
    type: String,
    required: true,
    trim: true
  },
  modelApprovalNumber: {
    type: String,
    trim: true
  },
  accuracyClass: {
    type: String,
    enum: ['I', 'II', 'III', 'IIII'],
    required: true
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected', 'expired'],
    default: 'pending'
  },
  verificationDate: {
    type: Date
  },
  validUntil: {
    type: Date
  }
}, {
  timestamps: true
});

const Instrument = mongoose.model('Instrument', instrumentSchema);
module.exports = Instrument;