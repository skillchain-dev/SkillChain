function createAiRateLimit({
  windowMs = 60_000,
  max = 30,
  code = 'AI_RATE_LIMITED',
  message = 'Too many AI requests. Try again later.',
} = {}) {
  const clients = new Map();
  let requestsSinceCleanup = 0;
  return (request, response, next) => {
    const key = request.ip || request.socket.remoteAddress || 'unknown';
    const now = Date.now();
    if (++requestsSinceCleanup >= 500) {
      requestsSinceCleanup = 0;
      for (const [clientKey, entry] of clients) {
        if (now - entry.startedAt >= windowMs) clients.delete(clientKey);
      }
    }
    const current = clients.get(key);
    if (!current || now - current.startedAt >= windowMs) {
      clients.set(key, { startedAt: now, count: 1 });
      return next();
    }
    current.count += 1;
    if (current.count > max) return response.status(429).json({ success: false, data: null, error: { code, message } });
    return next();
  };
}

module.exports = { createAiRateLimit };