const crypto = require('crypto');
const { authTokenSecret } = require('../config/env');

const TOKEN_LIFETIME_SECONDS = 7 * 24 * 60 * 60;

function encode(value) {
  return Buffer.from(JSON.stringify(value)).toString('base64url');
}

function sign(input) {
  return crypto.createHmac('sha256', authTokenSecret).update(input).digest('base64url');
}

function createAccessToken(userId) {
  const header = encode({ alg: 'HS256', typ: 'JWT' });
  const payload = encode({
    sub: String(userId),
    exp: Math.floor(Date.now() / 1000) + TOKEN_LIFETIME_SECONDS,
  });
  const content = `${header}.${payload}`;
  return `${content}.${sign(content)}`;
}

function verifyAccessToken(token) {
  if (typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [headerPart, payloadPart, signature] = parts;
  const content = `${headerPart}.${payloadPart}`;
  const expectedSignature = sign(content);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);
  if (signatureBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) {
    return null;
  }

  try {
    const header = JSON.parse(Buffer.from(headerPart, 'base64url').toString('utf8'));
    const payload = JSON.parse(Buffer.from(payloadPart, 'base64url').toString('utf8'));
    if (header.alg !== 'HS256' || typeof payload.sub !== 'string' || !payload.sub) return null;
    if (!Number.isFinite(payload.exp) || payload.exp <= Math.floor(Date.now() / 1000)) return null;
    return { sub: payload.sub };
  } catch {
    return null;
  }
}

module.exports = { createAccessToken, verifyAccessToken };
