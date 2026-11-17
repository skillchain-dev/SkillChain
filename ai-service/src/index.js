const { extractResumeSkills } = require('./parsers/resumeParser');
const { matchJob } = require('./matchers/jobMatcher');

module.exports = { extractResumeSkills, matchJob };