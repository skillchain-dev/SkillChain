const express = require('express');
const controller = require('../controllers/certificates.controller');
const requireAuth = require('../middleware/requireAuth');
const authorize = require('../middleware/authorize');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();
router.use(requireAuth);
router.get('/mine', authorize('student'), asyncHandler(controller.mine));
router.post('/', authorize('student'), asyncHandler(controller.create));
router.get('/pending', authorize('admin'), asyncHandler(controller.pending));
router.get('/:certificateId', authorize('student', 'admin'), asyncHandler(controller.get));
router.patch('/:certificateId/review', authorize('admin'), asyncHandler(controller.review));
router.delete('/:id', authorize('student'), asyncHandler(controller.remove));

module.exports = router;