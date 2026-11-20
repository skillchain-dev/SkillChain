import httpClient from '../../services/httpClient.js';

/**
 * analyticsApi — fetches role-specific analytics summaries.
 *
 * summary(role, stats?, series?)
 *   GET /api/analytics/:role/summary
 *   Returns { role, stats, series, generatedAt }
 */
export const analyticsApi = {
  summary: (role, params = {}) =>
    httpClient.get(`/analytics/${role}/summary`, { params }),
};

