const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false, index: true },
  title: { type: String, required: true, trim: true },
  companyName: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  location: { type: String, default: '' },
  jobType: { type: String, enum: ['full-time', 'part-time', 'internship', 'contract'], default: 'full-time' },
  requiredSkills: [{ type: String }],
  salaryRange: { type: String, default: '' },
  eligibilityCriteria: { type: String, default: '' },
  applicationDeadline: { type: Date },
  status: { type: String, enum: ['open', 'closed', 'draft'], default: 'open', index: true },
}, { timestamps: true });

module.exports = mongoose.models.Job || mongoose.model('Job', jobSchema);