const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../src/app');

test('certificate management endpoints require authentication', async () => {
  const responses = await Promise.all([
    request(app).get('/api/certificates/mine'),
    request(app).get('/api/certificates/pending'),
    request(app).post('/api/certificates').send({ title: 'Course', issuer: 'Institute' }),
    request(app).patch('/api/certificates/certificate-1/review').send({ decision: 'approved' }),
  ]);
  for (const response of responses) {
    assert.equal(response.status, 401);
    assert.equal(response.body.error.code, 'UNAUTHORIZED');
  }
});

test('unknown API paths return the project JSON error envelope', async () => {
  const response = await request(app).get('/api/does-not-exist');
  assert.equal(response.status, 404);
  assert.equal(response.body.error.code, 'NOT_FOUND');
});