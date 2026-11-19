const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  status: { type: String, enum: ['applied', 'shortlisted', 'rejected', 'hired'], default: 'applied' },
  coverLetter: { type: String, default: '' },
  matchScore: { type: Number, default: 0, min: 0, max: 100 },
  appliedAt: { type: Date, default: Date.now },
}, { timestamps: true });

applicationSchema.index({ job: 1, student: 1 }, { unique: true });

module.exports = mongoose.models.Application || mongoose.model('Application', applicationSchema);