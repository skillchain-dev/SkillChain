const mongoose = require('mongoose');

const recruiterProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  companyName: { type: String, default: '' },
  position: { type: String, default: '' },
  website: { type: String, default: '' },
  bio: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.models.RecruiterProfile || mongoose.model('RecruiterProfile', recruiterProfileSchema);