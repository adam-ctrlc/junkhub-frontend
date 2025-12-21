const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Get auth token from localStorage
 */
function getToken() {
  return localStorage.getItem("token");
}

/**
 * Make API request with automatic token handling
 */
async function request(endpoint, options = {}) {
  const token = getToken();

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.error || "API request failed");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * API helper methods
 */
export const api = {
  get: (endpoint) => request(endpoint, { method: "GET" }),

  post: (endpoint, body) =>
    request(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  put: (endpoint, body) =>
    request(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  delete: (endpoint) => request(endpoint, { method: "DELETE" }),
};

/**
 * SWR fetcher using our API client
 */
export const fetcher = (url) => api.get(url);

export default api;
