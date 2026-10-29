const API_ROOT = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_BASE_URL = `${API_ROOT}/api/auth`;

// Keeps the frontend usable when the backend is down, in DEV builds only.
const FALLBACK_TO_MOCK_IF_BACKEND_OFFLINE = import.meta.env.DEV;

const OFFLINE_USERS = {
  admin: {
    id: 1,
    username: 'admin',
    name: 'Sarah Jenkins',
    email: 'sarah@unspokencues.com',
    role: 'admin',
    assigned_venue: 'Fall Fest 2026'
  },
  staff: {
    id: 2,
    username: 'staff',
    name: 'Marcus Davis',
    email: 'marcus@unspokencues.com',
    role: 'staff',
    assigned_venue: 'Fall Fest 2026'
  }
};

const isNetworkError = (err) => err instanceof TypeError;

export async function loginStaff(username, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Sends and receives HttpOnly cookie
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }
    return data.user;
  } catch (err) {
    // If backend server isn't running and fallback is enabled in dev
    if (FALLBACK_TO_MOCK_IF_BACKEND_OFFLINE && isNetworkError(err)) {
      const cleanUser = username.trim().toLowerCase();
      if (OFFLINE_USERS[cleanUser] && password === 'password123') {
        localStorage.setItem('uc_offline_user', JSON.stringify(OFFLINE_USERS[cleanUser]));
        return OFFLINE_USERS[cleanUser];
      }
      throw new Error('Invalid username or password. (Offline Mock Mode)');
    }
    if (isNetworkError(err)) {
      throw new Error('Unable to reach the server. Please try again.');
    }
    throw err;
  }
}

export async function fetchCurrentSession() {
  try {
    const response = await fetch(`${API_BASE_URL}/me`, {
      method: 'GET',
      credentials: 'include'
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.user;
  } catch {
    if (FALLBACK_TO_MOCK_IF_BACKEND_OFFLINE) {
      try {
        const saved = localStorage.getItem('uc_offline_user');
        return saved ? JSON.parse(saved) : null;
      } catch {
        return null;
      }
    }
    return null;
  }
}

export async function logoutStaff() {
  localStorage.removeItem('uc_offline_user');
  try {
    await fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
      credentials: 'include'
    });
  } catch {
    // nothing to clear server-side
  }
}