const { success, failure } = require('../utils/apiResponse');

function summary(request, response) {
  const allowedRoles = ['student', 'recruiter', 'admin'];
  const { role } = request.params;
  if (!allowedRoles.includes(role)) return response.status(400).json(failure('INVALID_ANALYTICS_ROLE', 'role must be student, recruiter, or admin'));
  let input = {};
  if (request.query.summary) {
    try {
      input = JSON.parse(request.query.summary);
    } catch (error) {
      return response.status(400).json(failure('INVALID_ANALYTICS_SUMMARY', 'summary must be valid JSON'));
    }
  }
  return response.json(success({ role, stats: input.stats || [], series: input.series || [], generatedAt: new Date().toISOString() }));
}

module.exports = { summary };