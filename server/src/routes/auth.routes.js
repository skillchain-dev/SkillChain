const express = require('express');
const { register, login, me, logout, requestPasswordReset, resetPassword } = require('../controllers/auth.controller');
const requireAuth = require('../middleware/requireAuth');
const asyncHandler = require('../utils/asyncHandler');
const { createAiRateLimit } = require('../middleware/aiRateLimit');

const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', createAiRateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  code: 'PASSWORD_RESET_RATE_LIMITED',
  message: 'Too many reset requests. Try again later.',
}), asyncHandler(requestPasswordReset));
router.post('/reset-password', asyncHandler(resetPassword));
router.get('/me', requireAuth, me);
router.post('/logout', requireAuth, logout);

module.exports = router;