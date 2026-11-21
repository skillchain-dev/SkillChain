const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
process.env.AUTH_TOKEN_SECRET = 'test-secret-for-ai-routes';
const app = require('../src/app');
const { createAccessToken } = require('../src/utils/authToken');
const User = require('../src/models/User.model');
const token = createAccessToken('test-user');
User.findById = async () => ({ _id: 'test-user', role: 'student', tokenVersion: 0 });
const authenticated = (call) => call.set('Authorization', `Bearer ${token}`);

test('resume analysis and matching routes use the shared response contract', async () => {
  const resume = await authenticated(request(app).post('/api/ai/resume/analyze'))
    .send({ resumeText: 'Built applications with React, Node.js, MongoDB, and Git.' });
  assert.equal(resume.status, 200);
  assert.equal(resume.body.success, true);
  assert.ok(resume.body.data.skills.some((skill) => skill.name === 'React'));

  const match = await authenticated(request(app).post('/api/ai/jobs/match'))
    .send({ studentSkills: ['React'], requiredSkills: ['React', 'Node.js'] });
  assert.equal(match.status, 200);
  assert.equal(match.body.data.score, 50);
  assert.deepEqual(match.body.data.matchingSkills, ['react']);
  assert.deepEqual(match.body.data.missingSkills, ['node js']);
  assert.ok(Array.isArray(match.body.data.suggestions) && match.body.data.suggestions.length > 0);
  assert.ok(['gemini', 'fallback'].includes(match.body.data.source));
});

test('chat route returns assistant reply using standard envelope', async () => {
  const chatResponse = await authenticated(request(app).post('/api/ai/chat'))
    .send({ message: 'What skills are needed for a frontend developer?' });
  assert.equal(chatResponse.status, 200);
  assert.equal(chatResponse.body.success, true);
  assert.ok(chatResponse.body.data.reply);
});

test('chat route rejects empty message', async () => {
  const chatResponse = await authenticated(request(app).post('/api/ai/chat'))
    .send({ message: '' });
  assert.equal(chatResponse.status, 400);
  assert.equal(chatResponse.body.success, false);
  assert.equal(chatResponse.body.error.code, 'INVALID_CHAT_MESSAGE');
});

test('AI routes reject unauthenticated callers', async () => {
  const response = await request(app).post('/api/ai/chat').send({ message: 'hello' });
  assert.equal(response.status, 401);
  assert.equal(response.body.error.code, 'UNAUTHORIZED');
});

test('AI routes reject tokens from an older password version', async () => {
  const staleToken = createAccessToken('test-user', 1);
  const response = await request(app)
    .post('/api/ai/chat')
    .set('Authorization', `Bearer ${staleToken}`)
    .send({ message: 'hello' });
  assert.equal(response.status, 401);
  assert.equal(response.body.error.code, 'UNAUTHORIZED');
});

test('analytics routes reject unauthenticated callers', async () => {
  const response = await request(app).get('/api/analytics/student/summary?summary=broken');
  assert.equal(response.status, 401);
  assert.equal(response.body.error.code, 'UNAUTHORIZED');
});
