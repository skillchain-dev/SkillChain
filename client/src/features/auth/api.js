import httpClient from '../../services/httpClient.js';
import { mockAuthApi } from './mockApi.js';

// Optional local-only UI mock; the real backend auth endpoints are used by default.
const useMock = import.meta.env.VITE_MOCK_AUTH === 'true';
const unwrapResponse = (response) => response.data.data;

const realAuthApi = {
  login: (payload) => httpClient.post('/auth/login', payload).then(unwrapResponse),
  register: (payload) => httpClient.post('/auth/register', payload).then(unwrapResponse),
  requestPasswordReset: (payload) => httpClient.post('/auth/forgot-password', payload).then(unwrapResponse),
  resetPassword: (payload) => httpClient.post('/auth/reset-password', payload).then(unwrapResponse),
  logout: () => httpClient.post('/auth/logout'),
  me: () => httpClient.get('/auth/me').then(unwrapResponse),
};

export const authApi = useMock ? mockAuthApi : realAuthApi;
