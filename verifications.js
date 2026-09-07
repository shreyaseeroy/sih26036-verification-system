const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema({
  // Linked Application
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true
  },

  // Linked Instrument
  instrument: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Instrument',
    required: true
  },

  // Who performed the verification (LMO / GATC)
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // When the verification was done
  verificationDate: {
    type: Date,
    default: Date.now
  },

  // Result of verification
  result: {
    type: String,
    enum: ['pass', 'fail'],
    required: true
  },

  // Observations / notes by the officer
  observations: {
    type: String,
    trim: true
  },

  // Photos taken during verification
  photos: [{
    type: String   // store image URLs
  }],

  // Link to the generated certificate (if passed)
  certificate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Certificate'
  }

}, { timestamps: true });

module.exports = mongoose.model('Verification', verificationSchema);