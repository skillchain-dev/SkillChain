import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { authApi } from './api.js';
import { registerUnauthorizedHandler } from '../../services/httpClient.js';
import { clearSession, getStoredUser, getToken, setStoredUser, setToken } from '../../services/storage.js';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState('');

  const clearError = useCallback(() => setError(''), []);

  const applySession = useCallback((nextUser, accessToken) => {
    setToken(accessToken);
    setStoredUser(nextUser);
    setUser(nextUser);
  }, []);

  const logout = useCallback(async () => {
    try { await authApi.logout(); } catch { /* best-effort: still clear local session below */ }
    clearSession();
    setUser(null);
  }, []);

  // If a request ever comes back 401, drop the local session so the UI reflects it immediately.
  useEffect(() => { registerUnauthorizedHandler(() => setUser(null)); }, []);

  // Revalidate the stored token against the API once on load, so a stale/expired token doesn't leave stale UI.
  useEffect(() => {
    const token = getToken();
    if (!token) { setInitializing(false); return; }
    authApi.me()
      .then(({ user: freshUser }) => { setUser(freshUser); setStoredUser(freshUser); })
      .catch(() => { clearSession(); setUser(null); })
      .finally(() => setInitializing(false));
  }, []);

  const login = useCallback(async ({ email, password }) => {
    setError('');
    try {
      const { user: loggedInUser, accessToken } = await authApi.login({ email, password });
      applySession(loggedInUser, accessToken);
      return loggedInUser;
    } catch (err) {
      setError(err.message || 'Could not sign in');
      throw err;
    }
  }, [applySession]);

  const register = useCallback(async ({ name, email, password, role }) => {
    setError('');
    try {
      const { user: newUser, accessToken } = await authApi.register({ name, email, password, role });
      applySession(newUser, accessToken);
      return newUser;
    } catch (err) {
      setError(err.message || 'Could not create your account');
      throw err;
    }
  }, [applySession]);

  const value = useMemo(() => ({
    user,
    isAuthenticated: Boolean(user),
    initializing,
    error,
    clearError,
    login,
    register,
    logout,
  }), [user, initializing, error, clearError, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
