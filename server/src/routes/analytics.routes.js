const express = require('express');
const { summary } = require('../controllers/analytics.controller');

const router = express.Router();
router.get('/:role/summary', summary);

module.exports = router;