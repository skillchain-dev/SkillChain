const express = require('express');
const controller = require('../controllers/jobs.controller');
const requireAuth = require('../middleware/requireAuth');
const authorize = require('../middleware/authorize');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();
router.use(requireAuth);
router.get('/', authorize('student', 'recruiter', 'admin'), asyncHandler(controller.list));
router.get('/mine', authorize('recruiter'), asyncHandler(controller.mine));
router.post('/', authorize('recruiter'), asyncHandler(controller.create));
router.get('/:id', authorize('student', 'recruiter', 'admin'), asyncHandler(controller.get));
router.patch('/:id', authorize('recruiter'), asyncHandler(controller.update));
router.patch('/:id/close', authorize('recruiter'), asyncHandler(controller.close));
router.delete('/:id', authorize('recruiter'), asyncHandler(controller.remove));

module.exports = router;