import httpClient from '../../services/httpClient.js';

/**
 * skillsApi — skill catalog lookups and (future) user-skill management.
 *
 * match(studentSkills, requiredSkills, skillCatalog?)
 *   POST /api/ai/jobs/match
 *   Returns { score, matchingSkills, missingSkills, suggestions, source }
 */
export const skillsApi = {
  match: (studentSkills, requiredSkills, skillCatalog) => {
    if (import.meta.env.VITE_MOCK_AUTH === 'true') {
      const student = (studentSkills || []).map((skill) => String(skill).toLowerCase());
      const required = (requiredSkills || []).map((skill) => String(skill).toLowerCase());
      const matches = required.filter((skill) => student.includes(skill));
      const score = required.length ? Math.round((matches.length / required.length) * 100) : 0;
      return Promise.resolve({ data: { data: { score, matchingSkills: matches, missingSkills: required.filter((skill) => !student.includes(skill)), suggestions: [] } } });
    }
    return httpClient.post('/ai/jobs/match', { studentSkills, requiredSkills, skillCatalog });
  },
};

