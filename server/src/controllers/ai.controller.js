const { calculateJobMatch } = require('../services/jobMatching.service');
const { success, failure } = require('../utils/apiResponse');

async function match(request, response) {
  const { studentSkills, requiredSkills, skillCatalog } = request.body || {};
  if (!Array.isArray(studentSkills) || !Array.isArray(requiredSkills)) return response.status(400).json(failure('INVALID_MATCH_INPUT', 'studentSkills and requiredSkills must be arrays'));
  return response.json(success(await calculateJobMatch(studentSkills, requiredSkills, skillCatalog)));
}

module.exports = { match };