import api from "./api";

const TOKEN_KEY = "token";
const USER_KEY = "user";

/**
 * Save auth data to localStorage
 */
function saveAuth(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/**
 * Clear auth data from localStorage
 */
function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/**
 * Get stored user from localStorage
 */
export function getStoredUser() {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
}

/**
 * Get stored token
 */
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
  return !!getToken();
}

/**
 * Login as user
 */
export async function loginUser(email, password) {
  const data = await api.post("/auth/login/user", { email, password });
  saveAuth(data.token, { ...data.user, role: "user" });
  return data;
}

/**
 * Login as owner
 */
export async function loginOwner(email, password) {
  const data = await api.post("/auth/login/owner", { email, password });
  saveAuth(data.token, { ...data.owner, role: "owner" });
  return data;
}

/**
 * Login as admin
 */
export async function loginAdmin(email, password) {
  const data = await api.post("/auth/login/admin", { email, password });
  saveAuth(data.token, { ...data.admin, role: "admin" });
  return data;
}

/**
 * Register new user
 */
export async function registerUser(userData) {
  const data = await api.post("/auth/register/user", userData);
  saveAuth(data.token, { ...data.user, role: "user" });
  return data;
}

/**
 * Register new owner
 */
export async function registerOwner(ownerData) {
  const data = await api.post("/auth/register/owner", ownerData);
  // Only save auth if token exists (owner is approved)
  if (data.token) {
    saveAuth(data.token, { ...data.owner, role: "owner" });
  }
  return data;
}

/**
 * Logout - clear local storage and call API
 */
export async function logout() {
  try {
    await api.post("/auth/logout", {});
  } catch (e) {
    // Ignore logout API errors
  }
  clearAuth();
}

/**
 * Get current user from API
 */
export async function getCurrentUser() {
  const data = await api.get("/auth/me");
  return data.user;
}

export default {
  loginUser,
  loginOwner,
  loginAdmin,
  registerUser,
  registerOwner,
  logout,
  getCurrentUser,
  getStoredUser,
  getToken,
  isAuthenticated,
};
