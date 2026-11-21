import httpClient from '../../services/httpClient.js';

export const profileApi = {
  mine: () => httpClient.get('/profile/me'),
  update: (payload) => httpClient.patch('/profile/me', payload),
};