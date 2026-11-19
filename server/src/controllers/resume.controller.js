const { analyzeResume } = require('../services/resumeParser.service');
const { success, failure } = require('../utils/apiResponse');
const { maxResumeCharacters } = require('../config/env');

async function analyze(request, response) {
  const { resumeText, skillCatalog } = request.body || {};
  if (typeof resumeText !== 'string' || resumeText.trim().length < 20) return response.status(400).json(failure('INVALID_RESUME_TEXT', 'resumeText must contain at least 20 characters'));
  if (resumeText.length > maxResumeCharacters) return response.status(413).json(failure('RESUME_TOO_LARGE', 'resumeText exceeds the configured limit'));
  try {
    return response.json(success(await analyzeResume(resumeText, skillCatalog)));
  } catch (error) {
    return response.status(400).json(failure(error.code || 'RESUME_ANALYSIS_FAILED', error.message));
  }
}

module.exports = { analyze };