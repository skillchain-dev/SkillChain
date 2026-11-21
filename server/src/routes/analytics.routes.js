const express = require('express');
const { summary } = require('../controllers/analytics.controller');
const requireAuth = require('../middleware/requireAuth');
const authorize = require('../middleware/authorize');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();
router.get('/:role/summary', requireAuth, authorize('student', 'recruiter', 'admin'), asyncHandler(summary));

module.exports = router;