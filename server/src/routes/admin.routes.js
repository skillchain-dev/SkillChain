const express = require('express');
const controller = require('../controllers/admin.controller');
const requireAuth = require('../middleware/requireAuth');
const authorize = require('../middleware/authorize');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();
router.use(requireAuth, authorize('admin'));
router.get('/stats', asyncHandler(controller.stats));
router.get('/students', asyncHandler(controller.students));
router.get('/recruiters', asyncHandler(controller.recruiters));
router.get('/jobs', asyncHandler(controller.jobs));
router.patch('/jobs/:id', asyncHandler(controller.moderateJob));

module.exports = router;