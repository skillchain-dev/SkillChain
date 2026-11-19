// TEMPORARY — mock implementation of authApi, used only while the real backend's
// User model (password hashing, comparePassword, toSafeObject) isn't finished yet.
// It stores fake accounts in localStorage and never talks to the network, so you can
// exercise registration, login, protected routes and all three dashboards on their own.
//
// Delete this file (and the branch in api.js that imports it) once the real
// /api/auth endpoints work end-to-end.

const USERS_KEY = 'skillchain_mock_users';
const DELAY_MS = 300; // small delay so loading states are visible too

function delay(value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), DELAY_MS));
}

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function fakeToken(email) {
  return `mock.${btoa(email)}.${Date.now()}`;
}

function toSafeUser(user) {
  const { password, ...safe } = user;
  return safe;
}

export const mockAuthApi = {
  register: async ({ name, email, password, role }) => {
    const users = readUsers();
    if (users.some((u) => u.email === email)) {
      await delay();
      throw new Error('An account with that email already exists (mock auth).');
    }
    const user = { _id: `mock-${Date.now()}`, name, email, password, role: role || 'student' };
    users.push(user);
    writeUsers(users);
    return delay({ user: toSafeUser(user), accessToken: fakeToken(email) });
  },

  login: async ({ email, password }) => {
    const users = readUsers();
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) {
      await delay();
      throw new Error('Invalid email or password (mock auth).');
    }
    return delay({ user: toSafeUser(user), accessToken: fakeToken(email) });
  },

  logout: async () => delay(undefined),

  me: async () => {
    const raw = localStorage.getItem('skillchain_user');
    const user = raw ? JSON.parse(raw) : null;
    if (!user) {
      await delay();
      throw new Error('Not signed in (mock auth).');
    }
    return delay({ user });
  },
};
