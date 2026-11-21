const express = require('express');
const controller = require('../controllers/applications.controller');
const requireAuth = require('../middleware/requireAuth');
const authorize = require('../middleware/authorize');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();
router.use(requireAuth);
router.post('/jobs/:jobId', authorize('student'), asyncHandler(controller.apply));
router.get('/mine', authorize('student'), asyncHandler(controller.mine));
router.get('/candidates', authorize('recruiter'), asyncHandler(controller.candidates));
router.get('/jobs/:jobId', authorize('recruiter'), asyncHandler(controller.applicants));
router.patch('/:id/status', authorize('recruiter'), asyncHandler(controller.updateStatus));

module.exports = router;