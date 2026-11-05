const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../src/app');

test('resume analysis and matching routes use the shared response contract', async () => {
  const resume = await request(app)
    .post('/api/ai/resume/analyze')
    .send({ resumeText: 'Built applications with React, Node.js, MongoDB, and Git.' });
  assert.equal(resume.status, 200);
  assert.equal(resume.body.success, true);
  assert.ok(resume.body.data.skills.some((skill) => skill.name === 'React'));

  const match = await request(app)
    .post('/api/ai/jobs/match')
    .send({ studentSkills: ['React'], requiredSkills: ['React', 'Node.js'] });
  assert.equal(match.status, 200);
  assert.deepEqual(match.body.data, {
    score: 50,
    matchingSkills: ['react'],
    missingSkills: ['node js'],
    suggestions: ['Develop node js through a project or guided course.'],
    source: 'fallback',
  });
});

test('analytics rejects malformed summary JSON with an envelope', async () => {
  const response = await request(app).get('/api/analytics/student/summary?summary=broken');
  assert.equal(response.status, 400);
  assert.equal(response.body.error.code, 'INVALID_ANALYTICS_SUMMARY');
});