const mongoose = require('mongoose');
const { Schema } = mongoose;

const certificateSchema = new Schema({
  applicationId: {
    type: Schema.Types.ObjectId,
    ref: 'Application',
    required: true
  },
  instrumentId: {
    type: Schema.Types.ObjectId,
    ref: 'Instrument',
    required: true
  },
  certificateNumber: {
    type: String,
    unique: true,
    required: true
  },
  issuedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  issueDate: {
    type: Date,
    required: true
  },
  validUntil: {
    type: Date,
    required: true
  },
  qrCodeData: {
    type: String,
    required: true
  },
  authHash: {
    type: String,
    unique: true
  }
}, {
  timestamps: true
});

const Certificate = mongoose.model('Certificate', certificateSchema);
module.exports = Certificate;