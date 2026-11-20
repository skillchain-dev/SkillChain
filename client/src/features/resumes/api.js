import httpClient from '../../services/httpClient.js';

/**
 * resumeApi — calls the server's AI resume-analysis endpoint.
 *
 * analyze(resumeText, skillCatalog?)
 *   POST /api/ai/resume/analyze
 *   Returns { skills: Array<{name, normalizedName, source}>, source }
 */
export const resumeApi = {
  analyze: (resumeText, skillCatalog) =>
    httpClient.post('/ai/resume/analyze', { resumeText, skillCatalog }),
};

