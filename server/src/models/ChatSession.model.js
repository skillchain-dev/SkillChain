const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
}, { _id: false, timestamps: { createdAt: true, updatedAt: false } });

const chatSessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  interactionId: { type: String, default: null }, // last Gemini interaction id, used to continue the thread
  messages: [messageSchema],
}, { timestamps: true });

module.exports = mongoose.models.ChatSession || mongoose.model('ChatSession', chatSessionSchema);
