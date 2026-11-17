const express = require('express');
const cors = require('cors');
const aiRoutes = require('./routes/ai.routes');
const analyticsRoutes = require('./routes/analytics.routes');

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.get('/health', (request, response) => response.json({ success: true, data: { status: 'ok' }, error: null }));
app.use('/api/ai', aiRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use((error, request, response, next) => response.status(500).json({ success: false, data: null, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred.' } }));

module.exports = app;