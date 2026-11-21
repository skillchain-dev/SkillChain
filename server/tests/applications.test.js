const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../src/app');

test('application endpoints require authentication before accessing application data', async () => {
  const endpoints = [
    request(app).get('/api/applications/mine'),
    request(app).get('/api/applications/candidates'),
    request(app).post('/api/applications/jobs/507f1f77bcf86cd799439011'),
    request(app).patch('/api/applications/507f1f77bcf86cd799439011/status'),
  ];
  const responses = await Promise.all(endpoints);
  for (const response of responses) {
    assert.equal(response.status, 401);
    assert.equal(response.body.error.code, 'UNAUTHORIZED');
  }
});