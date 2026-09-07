const mongoose = require('mongoose');
const { Schema } = mongoose;

const applicationSchema = new Schema({
  instrumentId: {
    type: Schema.Types.ObjectId,
    ref: 'Instrument',
    required: true
  },
  applicantId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  applicationType: {
    type: String,
    enum: ['verification', 're_verification'],
    required: true
  },
  status: {
    type: String,
    enum: ['submitted', 'scheduled', 'in_progress', 'completed', 'rejected'],
    default: 'submitted'
  },
  scheduledDate: {
    type: Date,
    required: false
  },
  remarks: {
    type: String,
    required: false
  }, 
    photoUrls: [{ type: String }]   // array of image URLs (from Cloudinary/similar)
}, {
  timestamps: true
});

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;