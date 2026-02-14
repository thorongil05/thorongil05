/**
 * API utility for making authenticated requests to the backend.
 * Automatically adds JWT token and handles 401 responses by logging out the user.
 */

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

/**
 * Makes an authenticated fetch request
 * @param {string} endpoint - The API endpoint (e.g., '/api/competitions')
 * @param {RequestInit} options - Fetch options
 * @returns {Promise<Response>}
 */
export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("token");
  
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized - session expired or invalid token
  if (response.status === 401) {
    // Clear auth state
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // Redirect to login
    window.location.href = "/login";
    
    throw new Error("Session expired. Please log in again.");
  }

  return response;
}

/**
 * Helper for GET requests
 */
export async function apiGet(endpoint) {
  const response = await apiFetch(endpoint, { method: "GET" });
  return response.json();
}

/**
 * Helper for POST requests
 */
export async function apiPost(endpoint, data) {
  const response = await apiFetch(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response.json();
}

/**
 * Helper for PUT requests
 */
export async function apiPut(endpoint, data) {
  const response = await apiFetch(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return response.json();
}

/**
 * Helper for DELETE requests
 */
export async function apiDelete(endpoint) {
  const response = await apiFetch(endpoint, { method: "DELETE" });
  return response.json();
}
