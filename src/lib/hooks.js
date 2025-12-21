import useSWR from "swr";
import { fetcher } from "./api";

/**
 * Get current user profile
 */
export function useUser() {
  const { data, error, isLoading, mutate } = useSWR("/users/profile", fetcher);
  return {
    user: data?.user,
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Get products with optional filters
 */
export function useProducts(filters = {}) {
  const params = new URLSearchParams();
  if (filters.category) params.append("category", filters.category);
  if (filters.type) params.append("type", filters.type);
  if (filters.search) params.append("search", filters.search);
  if (filters.minPrice) params.append("minPrice", filters.minPrice);
  if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
  if (filters.shopId) params.append("shopId", filters.shopId);
  if (filters.limit) params.append("limit", filters.limit);

  const query = params.toString();
  const url = `/products${query ? `?${query}` : ""}`;

  const { data, error, isLoading, mutate } = useSWR(url, fetcher);
  return {
    products: data?.products || [],
    total: data?.total || 0,
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Get best-selling products for homepage
 */
export function useBestSellers(limit = 10) {
  const { data, error, isLoading } = useSWR(
    `/products/home/bestsellers?limit=${limit}`,
    fetcher
  );
  return {
    products: data?.products || [],
    isLoading,
    isError: error,
  };
}

/**
 * Get categories with product counts
 */
export function useCategories() {
  const { data, error, isLoading } = useSWR(
    "/products/home/categories",
    fetcher
  );
  return {
    categories: data?.categories || [],
    isLoading,
    isError: error,
  };
}

/**
 * Get single product by ID
 */
export function useProduct(id) {
  const { data, error, isLoading } = useSWR(
    id ? `/products/${id}` : null,
    fetcher
  );
  return {
    product: data?.product,
    isLoading,
    isError: error,
  };
}

/**
 * Get all shops
 */
export function useShops() {
  const { data, error, isLoading, mutate } = useSWR("/shops", fetcher);
  return {
    shops: data?.shops || [],
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Get single shop by ID
 */
export function useShop(id) {
  const { data, error, isLoading } = useSWR(
    id ? `/shops/${id}` : null,
    fetcher
  );
  return {
    shop: data?.shop,
    isLoading,
    isError: error,
  };
}

/**
 * Get user orders
 */
export function useOrders() {
  const { data, error, isLoading, mutate } = useSWR("/users/orders", fetcher);
  return {
    orders: data?.orders || [],
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Get user's sell offers
 */
export function useUserOffers() {
  const { data, error, isLoading, mutate } = useSWR("/offers", fetcher);
  return {
    offers: data?.offers || [],
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Get user wishlist
 */
export function useWishlist() {
  const { data, error, isLoading, mutate } = useSWR("/users/wishlist", fetcher);
  return {
    wishlist: data?.wishlist || [],
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Get user chats
 */
export function useChats() {
  const { data, error, isLoading, mutate } = useSWR("/chats", fetcher);
  return {
    chats: data?.chats || [],
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Get chat for a specific order (user)
 */
export function useChatByOrder(orderId) {
  const { data, error, isLoading, mutate } = useSWR(
    orderId ? `/chats/order/${orderId}` : null,
    fetcher
  );
  return {
    chat: data?.chat,
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Get chat messages
 */
export function useChatMessages(chatId) {
  const { data, error, isLoading, mutate } = useSWR(
    chatId ? `/chats/${chatId}/messages` : null,
    fetcher,
    { refreshInterval: 5000 } // Poll every 5 seconds
  );
  return {
    messages: data?.messages || [],
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Owner: Get all chats
 */
export function useOwnerChats() {
  const { data, error, isLoading, mutate } = useSWR("/owner/chats", fetcher);
  return {
    chats: data?.chats || [],
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Owner: Get chat messages
 */
export function useOwnerChatMessages(chatId) {
  const { data, error, isLoading, mutate } = useSWR(
    chatId ? `/owner/chats/${chatId}/messages` : null,
    fetcher,
    { refreshInterval: 5000 } // Poll every 5 seconds
  );
  return {
    messages: data?.messages || [],
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Owner: Get unread chat count
 */
export function useOwnerUnreadChats() {
  const { data, error, isLoading } = useSWR(
    "/owner/chats/unread/count",
    fetcher,
    { refreshInterval: 30000 }
  );
  return {
    unreadCount: data?.unreadCount || 0,
    isLoading,
    isError: error,
  };
}

/**
 * Get notifications
 */
export function useNotifications() {
  const { data, error, isLoading, mutate } = useSWR("/notifications", fetcher);
  return {
    notifications: data?.notifications || [],
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Get unread counts
 */
export function useUnreadCounts() {
  const { data: chatData } = useSWR("/chats/unread/count", fetcher);
  const { data: notifData } = useSWR("/notifications/unread/count", fetcher);
  return {
    unreadChats: chatData?.unreadCount || 0,
    unreadNotifications: notifData?.unreadCount || 0,
  };
}

/**
 * Owner: Get my shops
 */
export function useMyShops() {
  const { data, error, isLoading, mutate } = useSWR(
    "/shops/owner/my-shops",
    fetcher
  );
  return {
    shops: data?.shops || [],
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Owner: Get shop orders
 */
export function useShopOrders(shopId) {
  const { data, error, isLoading, mutate } = useSWR(
    shopId ? `/orders/shop/${shopId}` : null,
    fetcher
  );
  return {
    orders: data?.orders || [],
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Admin: Get dashboard stats
 */
export function useAdminStats() {
  const { data, error, isLoading } = useSWR("/admin/stats", fetcher);
  return {
    stats: data?.stats,
    isLoading,
    isError: error,
  };
}

/**
 * Admin: Get all users
 */
export function useAdminUsers() {
  const { data, error, isLoading, mutate } = useSWR("/admin/users", fetcher);
  return {
    users: data?.users || [],
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Admin: Get all owners
 */
export function useAdminOwners() {
  const { data, error, isLoading, mutate } = useSWR("/admin/owners", fetcher);
  return {
    owners: data?.owners || [],
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Admin: Get all products
 */
export function useAdminProducts() {
  const { data, error, isLoading, mutate } = useSWR("/admin/products", fetcher);
  return {
    products: data?.products || [],
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Owner: Get dashboard stats
 */
export function useOwnerStats(period = "7d") {
  const { data, error, isLoading, mutate } = useSWR(
    `/owner/stats?period=${period}`,
    fetcher
  );
  return {
    stats: data?.stats || {
      totalSales: 0,
      totalOrders: 0,
      pendingOffers: 0,
      activeProducts: 0,
    },
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Owner: Get recent activity
 */
export function useOwnerActivity(limit = 10) {
  const { data, error, isLoading, mutate } = useSWR(
    `/owner/activity?limit=${limit}`,
    fetcher
  );
  return {
    activity: data?.activity || [],
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Owner: Get products with filters
 */
export function useOwnerProducts(filters = {}) {
  const params = new URLSearchParams();
  if (filters.search) params.append("search", filters.search);
  if (filters.category) params.append("category", filters.category);
  if (filters.type) params.append("type", filters.type);

  const query = params.toString();
  const url = `/owner/products${query ? `?${query}` : ""}`;

  const { data, error, isLoading, mutate } = useSWR(url, fetcher);
  return {
    products: data?.products || [],
    total: data?.total || 0,
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Owner: Get offers for owner's products
 */
export function useOwnerOffers() {
  const { data, error, isLoading, mutate } = useSWR("/offers/shop", fetcher);
  return {
    offers: data?.offers || [],
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Owner: Get orders for owner's shops
 */
export function useOwnerOrders() {
  const { data, error, isLoading, mutate } = useSWR("/owner/orders", fetcher);
  return {
    orders: data?.orders || [],
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Owner: Get profile
 */
export function useOwnerProfile() {
  const { data, error, isLoading, mutate } = useSWR("/owner/profile", fetcher);
  return {
    owner: data?.owner,
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Owner: Get notifications
 */
export function useOwnerNotifications() {
  const { data, error, isLoading, mutate } = useSWR(
    "/owner/notifications",
    fetcher
  );
  return {
    notifications: data?.notifications || [],
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Owner: Get unread notification count
 */
export function useOwnerUnreadCount() {
  const { data, error, isLoading } = useSWR(
    "/owner/notifications/unread/count",
    fetcher
  );
  return {
    unreadCount: data?.unreadCount || 0,
    isLoading,
    isError: error,
  };
}

/**
 * Admin: Get notifications
 */
export function useAdminNotifications() {
  const { data, error, isLoading, mutate } = useSWR(
    "/admin/notifications",
    fetcher
  );
  return {
    notifications: data?.notifications || [],
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Admin: Get unread notification count
 */
export function useAdminUnreadCount() {
  const { data, error, isLoading } = useSWR(
    "/admin/notifications/unread/count",
    fetcher
  );
  return {
    unreadCount: data?.unreadCount || 0,
    isLoading,
    isError: error,
  };
}
