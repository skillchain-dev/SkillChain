import httpClient from '../../services/httpClient.js';

export const projectsApi = {
  list: () => httpClient.get('/projects'),
  create: (payload) => httpClient.post('/projects', payload),
  update: (id, payload) => httpClient.patch(`/projects/${id}`, payload),
  remove: (id) => httpClient.delete(`/projects/${id}`),
};