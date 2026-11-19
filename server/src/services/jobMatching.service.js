const { matchJob } = require('../../../ai-service/src');

async function calculateJobMatch(studentSkills, requiredSkills, skillCatalog) {
  return matchJob(studentSkills, requiredSkills, skillCatalog);
}

module.exports = { calculateJobMatch };