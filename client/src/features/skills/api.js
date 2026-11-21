import httpClient from '../../services/httpClient.js';

/**
 * skillsApi — skill catalog lookups and (future) user-skill management.
 *
 * match(studentSkills, requiredSkills, skillCatalog?)
 *   POST /api/ai/jobs/match
 *   Returns { score, matchingSkills, missingSkills, suggestions, source }
 */
export const skillsApi = {
  list: () => httpClient.get('/skills'),
  add: (payload) => httpClient.post('/skills', payload),
  remove: (id) => httpClient.delete(`/skills/${id}`),
  match: (studentSkills, requiredSkills, skillCatalog) =>
    httpClient.post('/ai/jobs/match', { studentSkills, requiredSkills, skillCatalog }),
};

