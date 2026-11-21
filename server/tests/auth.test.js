const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');

process.env.AUTH_TOKEN_SECRET = 'test-secret-for-auth-routes';
const app = require('../src/app');
const { createAccessToken, verifyAccessToken } = require('../src/utils/authToken');

test('auth registration and login routes validate requests without reaching the database', async () => {
  const registration = await request(app).post('/api/auth/register').send({});
  assert.equal(registration.status, 400);
  assert.equal(registration.body.error.code, 'INVALID_REGISTRATION');

  const login = await request(app).post('/api/auth/login').send({ email: 'not-an-email', password: 'short' });
  assert.equal(login.status, 400);
  assert.equal(login.body.error.code, 'INVALID_LOGIN');
});

test('auth routes reject invalid roles and unauthenticated profile requests', async () => {
  const registration = await request(app)
    .post('/api/auth/register')
    .send({ name: 'Test User', email: 'test@example.com', password: 'password123', role: 'admin' });
  assert.equal(registration.status, 400);
  assert.equal(registration.body.error.code, 'INVALID_REGISTRATION');

  const profile = await request(app).get('/api/auth/me');
  assert.equal(profile.status, 401);
  assert.equal(profile.body.error.code, 'UNAUTHORIZED');
});

test('password reset endpoints validate malformed requests', async () => {
  const requestReset = await request(app).post('/api/auth/forgot-password').send({ email: 'invalid' });
  assert.equal(requestReset.status, 400);
  assert.equal(requestReset.body.error.code, 'INVALID_EMAIL');

  const reset = await request(app).post('/api/auth/reset-password').send({ token: 'bad', password: 'password123' });
  assert.equal(reset.status, 400);
  assert.equal(reset.body.error.code, 'INVALID_RESET_TOKEN');
});

test('access tokens verify only when their signature is unchanged', () => {
  const token = createAccessToken('user-id');
  assert.deepEqual(verifyAccessToken(token), { sub: 'user-id', ver: 0 });
  assert.equal(verifyAccessToken(`${token.slice(0, -1)}x`), null);
});