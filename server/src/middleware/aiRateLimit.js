function createAiRateLimit({ windowMs = 60_000, max = 30 } = {}) {
  const clients = new Map();
  return (request, response, next) => {
    const key = request.ip || request.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const current = clients.get(key);
    if (!current || now - current.startedAt >= windowMs) {
      clients.set(key, { startedAt: now, count: 1 });
      return next();
    }
    current.count += 1;
    if (current.count > max) return response.status(429).json({ success: false, data: null, error: { code: 'AI_RATE_LIMITED', message: 'Too many AI requests. Try again later.' } });
    return next();
  };
}

module.exports = { createAiRateLimit };