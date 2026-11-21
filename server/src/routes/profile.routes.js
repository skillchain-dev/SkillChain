const express = require('express');
const controller = require('../controllers/profile.controller');
const requireAuth = require('../middleware/requireAuth');
const authorize = require('../middleware/authorize');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();
router.use(requireAuth, authorize('student', 'recruiter'));
router.get('/me', asyncHandler(controller.getMine));
router.patch('/me', asyncHandler(controller.updateMine));

module.exports = router;