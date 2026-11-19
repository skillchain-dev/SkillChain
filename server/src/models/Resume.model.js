const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  originalName: { type: String, default: '' },
  fileUrl: { type: String, default: '' },
  parsedText: { type: String, default: '' },
  extractedSkills: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.models.Resume || mongoose.model('Resume', resumeSchema);