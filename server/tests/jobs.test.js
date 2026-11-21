const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../src/app');

test('job listing and recruiter mutations require authentication', async () => {
  const responses = await Promise.all([
    request(app).get('/api/jobs'),
    request(app).get('/api/jobs/mine'),
    request(app).post('/api/jobs').send({}),
    request(app).patch('/api/jobs/507f1f77bcf86cd799439011/close'),
  ]);
  for (const response of responses) {
    assert.equal(response.status, 401);
    assert.equal(response.body.error.code, 'UNAUTHORIZED');
  }
});