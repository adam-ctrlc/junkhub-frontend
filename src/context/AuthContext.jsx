import { createContext, useContext, useState, useEffect } from "react";
import {
  getStoredUser,
  getCurrentUser,
  logout as authLogout,
  isAuthenticated,
} from "../lib/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user on mount
  useEffect(() => {
    async function loadUser() {
      if (isAuthenticated()) {
        try {
          // Try to get fresh user data from API
          const userData = await getCurrentUser();
          setUser(userData);
        } catch (error) {
          // Check if error is due to pending approval
          if (error.data?.code === "PENDING_APPROVAL") {
            // Clear auth and redirect
            await authLogout();
            setUser(null);
          } else {
            // Fall back to stored user or clear if invalid
            const storedUser = getStoredUser();
            if (storedUser) {
              setUser(storedUser);
            } else {
              await authLogout();
            }
          }
        }
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    await authLogout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    role: user?.role,
    login,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
