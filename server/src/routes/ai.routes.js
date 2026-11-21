const express = require('express');
const resumeController = require('../controllers/resume.controller');
const aiController = require('../controllers/ai.controller');
const chatController = require('../controllers/chat.controller');
const { createAiRateLimit } = require('../middleware/aiRateLimit');
const requireAuth = require('../middleware/requireAuth');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();
router.use(requireAuth);
router.use(createAiRateLimit());

router.post('/resume/analyze', asyncHandler(resumeController.analyze));
router.post('/jobs/match', asyncHandler(aiController.match));
router.post('/chat', asyncHandler(chatController.chat));

module.exports = router;
