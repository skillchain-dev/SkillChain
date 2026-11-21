import httpClient from '../../services/httpClient.js';

export const adminApi = {
  recruiters: () => httpClient.get('/admin/recruiters'),
  jobs: () => httpClient.get('/admin/jobs'),
  moderateJob: (id, status) => httpClient.patch(`/admin/jobs/${id}`, { status }),
};
