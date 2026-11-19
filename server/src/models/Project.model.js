const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  technologies: [{ type: String }],
  githubLink: { type: String, default: '' },
  liveDemoLink: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.models.Project || mongoose.model('Project', projectSchema);