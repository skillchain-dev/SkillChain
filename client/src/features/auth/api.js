import httpClient from '../../services/httpClient.js';
import { mockAuthApi } from './mockApi.js';

// TEMPORARY: set VITE_MOCK_AUTH=true in client/.env to test the frontend (register,
// login, protected routes, all three dashboards) without a working backend. Remove
// this branch — and mockApi.js — once real /api/auth endpoints are wired up.
const useMock = import.meta.env.VITE_MOCK_AUTH === 'true';

const realAuthApi = {
  login: (payload) => httpClient.post('/auth/login', payload).then((res) => res.data),
  register: (payload) => httpClient.post('/auth/register', payload).then((res) => res.data),
  logout: () => httpClient.post('/auth/logout'),
  me: () => httpClient.get('/auth/me').then((res) => res.data),
};

export const authApi = useMock ? mockAuthApi : realAuthApi;
