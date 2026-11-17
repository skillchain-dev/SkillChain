const test = require('node:test');
const assert = require('node:assert/strict');
const { extractResumeSkills, matchJob } = require('../src');

test('extracts and normalizes catalog skills from realistic resume text', () => {
  const result = extractResumeSkills('Built a React.js and Node.js placement portal with MongoDB and Git.');
  assert.deepEqual(result.skills.map((skill) => skill.normalizedName), ['javascript', 'react', 'node js', 'mongodb', 'git']);
  assert.equal(result.source, 'fallback');
});

test('returns consistent score, gaps, and suggestions', () => {
  const result = matchJob(['React', 'JavaScript'], ['React', 'Node.js', 'MongoDB']);
  assert.equal(result.score, 33);
  assert.deepEqual(result.matchingSkills, ['react']);
  assert.deepEqual(result.missingSkills, ['node js', 'mongodb']);
  assert.equal(result.suggestions.length, 2);
});