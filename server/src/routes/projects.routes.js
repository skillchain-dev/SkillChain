const express = require('express');
const controller = require('../controllers/projects.controller');
const requireAuth = require('../middleware/requireAuth');
const authorize = require('../middleware/authorize');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();
router.use(requireAuth, authorize('student'));
router.get('/', asyncHandler(controller.list));
router.post('/', asyncHandler(controller.create));
router.patch('/:id', asyncHandler(controller.update));
router.delete('/:id', asyncHandler(controller.remove));

module.exports = router;