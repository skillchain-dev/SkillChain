const test = require('node:test');
const assert = require('node:assert/strict');
const { analyzeResume } = require('../src/services/resumeParser.service');
const { calculateJobMatch } = require('../src/services/jobMatching.service');
const { sendChatMessage } = require('../src/services/chat.service');

test('server resume service returns reviewable normalized skills', async () => {
  const result = await analyzeResume('Experience with Python, data analysis, and Docker in student projects.');
  assert.equal(result.skills[0].name, 'Python');
  assert.ok(result.skills.some((skill) => skill.name === 'Docker'));
});

test('server matching service is the shared matching implementation', async () => {
  const result = await calculateJobMatch(['Node.js'], ['Node.js', 'React']);
  assert.equal(result.score, 50);
  assert.deepEqual(result.missingSkills, ['react']);
});

test('server chat service returns assistant reply', async () => {
  const result = await sendChatMessage('What are key skills for fullstack dev?');
  assert.ok(result.reply);
  assert.equal(typeof result.reply, 'string');
});
