const AUTH_TOKEN_KEY = 'authToken';
const USER_KEY = 'user';

export function readStoredAuth() {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const userData = localStorage.getItem(USER_KEY);
  if (!token || !userData) {
    return null;
  }

  try {
    return { token, user: JSON.parse(userData) };
  } catch {
    clearStoredAuth();
    return null;
  }
}

export function persistAuth(user, token) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearStoredAuth() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getApiBaseUrl() {
  return process.env.REACT_APP_API_URL || '';
}
