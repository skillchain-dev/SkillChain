const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  college: { type: String, default: '' },
  branch: { type: String, default: '' },
  graduationYear: { type: Number },
  phone: { type: String, default: '' },
  bio: { type: String, default: '' },
  resumeUrl: { type: String, default: '' },
  profileCompletion: { type: Number, default: 0, min: 0, max: 100 },
}, { timestamps: true });

module.exports = mongoose.models.StudentProfile || mongoose.model('StudentProfile', studentProfileSchema);