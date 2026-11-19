const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true, trim: true },
  category: { type: String, default: '' },
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  verified: { type: Boolean, default: false },
}, { timestamps: true });

skillSchema.index({ student: 1, name: 1 }, { unique: true });

module.exports = mongoose.models.Skill || mongoose.model('Skill', skillSchema);