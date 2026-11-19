const { extractResumeSkills } = require('../../../ai-service/src');

async function analyzeResume(resumeText, skillCatalog) {
  return extractResumeSkills(resumeText, skillCatalog);
}

module.exports = { analyzeResume };