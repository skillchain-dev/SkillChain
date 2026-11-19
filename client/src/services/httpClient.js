import axios from 'axios';
import { API_URL } from '../app/config.js';
import { clearSession, getToken } from './storage.js';

// Shared Axios instance — every feature's api.js should import this rather than
// creating its own client, so base URL, auth header and error handling stay in one place.
const httpClient = axios.create({ baseURL: API_URL });

httpClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let onUnauthorized = null;
// Called once by the auth provider so a 401 anywhere in the app can log the user out.
export function registerUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      clearSession();
      if (onUnauthorized) onUnauthorized();
    }
    const message = error?.response?.data?.error || error?.response?.data?.message || error.message || 'Something went wrong. Please try again.';
    return Promise.reject(Object.assign(new Error(message), { status: error?.response?.status, cause: error }));
  }
);

// Fetch-flavoured helper kept for feature modules that prefer `api(url, { method, body })`
// over the axios instance directly — resolves straight to the response body.
export const api = async (path, { method = 'GET', body, headers } = {}) => {
  const response = await httpClient.request({
    url: path,
    method,
    data: body ? (typeof body === 'string' ? JSON.parse(body) : body) : undefined,
    headers,
  });
  return response.data;
};

export default httpClient;
