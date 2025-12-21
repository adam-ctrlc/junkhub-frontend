import api from "./api";

/**
 * Admin API module - Separate API calls for admin dashboard
 */

// ==================== STATS ====================

/**
 * Get dashboard statistics
 */
export async function getAdminStats() {
  return api.get("/admin/stats");
}

// ==================== USERS ====================

/**
 * Get all users with pagination
 */
export async function getUsers(limit = 50, offset = 0) {
  return api.get(`/admin/users?limit=${limit}&offset=${offset}`);
}

/**
 * Delete a user by ID
 */
export async function deleteUser(id) {
  return api.delete(`/admin/users/${id}`);
}

// ==================== OWNERS ====================

/**
 * Get all owners with pagination
 */
export async function getOwners(limit = 50, offset = 0) {
  return api.get(`/admin/owners?limit=${limit}&offset=${offset}`);
}

/**
 * Delete an owner by ID
 */
export async function deleteOwner(id) {
  return api.delete(`/admin/owners/${id}`);
}

/**
 * Approve an owner's business
 */
export async function approveOwner(id) {
  return api.put(`/admin/owners/${id}/approve`);
}

// ==================== PRODUCTS ====================

/**
 * Get all products with pagination and optional status filter
 */
export async function getProducts(limit = 50, offset = 0, status = null) {
  let url = `/admin/products?limit=${limit}&offset=${offset}`;
  if (status) {
    url += `&status=${status}`;
  }
  return api.get(url);
}

/**
 * Delete a product by ID
 */
export async function deleteProduct(id) {
  return api.delete(`/admin/products/${id}`);
}

/**
 * Approve a product by ID
 */
export async function approveProduct(id) {
  return api.put(`/admin/products/${id}/approve`);
}

/**
 * Reject a product by ID
 */
export async function rejectProduct(id, reason = null) {
  return api.put(`/admin/products/${id}/reject`, { reason });
}

// ==================== ADMIN PROFILE ====================

/**
 * Get admin profile
 */
export async function getAdminProfile() {
  return api.get("/admin/profile");
}

/**
 * Update admin password
 */
export async function updateAdminPassword(currentPassword, newPassword) {
  return api.put("/admin/profile/password", { currentPassword, newPassword });
}
