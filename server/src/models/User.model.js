const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  passwordResetTokenHash: { type: String, select: false },
  passwordResetExpiresAt: { type: Date, select: false },
  role: { type: String, enum: ['student', 'recruiter', 'admin'], default: 'student', index: true },
  tokenVersion: { type: Number, default: 0 },
  avatarUrl: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);