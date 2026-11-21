const express = require('express');
const { verify, directory } = require('../controllers/verification.controller');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();
router.get('/directory', asyncHandler(directory));
router.get('/:certificateId', asyncHandler(verify));

module.exports = router;
