const express = require('express');
const resumeController = require('../controllers/resume.controller');
const aiController = require('../controllers/ai.controller');
const chatController = require('../controllers/chat.controller');
const { createAiRateLimit } = require('../middleware/aiRateLimit');

const router = express.Router();
router.use(createAiRateLimit());

router.post('/resume/analyze', resumeController.analyze);
router.post('/jobs/match', aiController.match);
router.post('/chat', chatController.chat);

module.exports = router;
