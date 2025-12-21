import { useState } from "react";
import {
  Search,
  Mail,
  Bell,
  ShoppingCart,
  User,
  Home,
  Store,
  Package,
} from "lucide-react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useUnreadCounts, useNotifications } from "../lib/hooks";
import NotificationSidebar from "./NotificationSidebar";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { unreadNotifications } = useUnreadCounts();
  const { notifications, mutate } = useNotifications();
  const [searchQuery, setSearchQuery] = useState("");
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <nav className="w-full bg-white shadow-sm flex-none z-50">
        {/* Top Accent Line */}
        <div className="w-full h-1 bg-[#FCD34D]"></div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between gap-8">
          {/* Logo & Main Nav */}
          <div className="flex items-center gap-12">
            <Link to="/dashboard" className="flex items-center gap-2">
              <img
                src="/favicon.png"
                alt="Logo"
                className="w-8 h-8 object-contain"
              />
              <span className="text-xl font-bold tracking-tight text-gray-900">
                Junk<span className="font-extrabold">HUB</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 hover:text-gray-900"
              >
                <Home size={18} />
                Home Page
              </Link>
              <Link
                to="/shop"
                className="flex items-center gap-2 hover:text-gray-900"
              >
                <Store size={18} />
                Shop
              </Link>
              <Link
                to="/products"
                className="flex items-center gap-2 hover:text-gray-900"
              >
                <Package size={18} />
                Products
              </Link>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-6 flex-1 justify-end">
            {/* Search */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex items-center w-full max-w-sm relative"
            >
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-[#FCD34D] focus:ring-1 focus:ring-[#FCD34D] text-sm"
              />
              <button
                type="submit"
                className="absolute right-3 text-gray-400 hover:text-gray-600"
              >
                <Search size={18} />
              </button>
            </form>

            {/* Icons */}
            <div className="flex items-center gap-5 text-gray-600">
              <button
                onClick={() => setIsNotifOpen(true)}
                className="hover:text-gray-900 relative"
              >
                <Bell size={20} />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white text-white text-[10px] flex items-center justify-center font-bold">
                    {unreadNotifications > 9 ? "9+" : unreadNotifications}
                  </span>
                )}
              </button>
              <Link to="/cart" className="hover:text-gray-900">
                <ShoppingCart size={20} />
              </Link>
              {isAuthenticated ? (
                <Link
                  to="/profile"
                  className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-gray-200"
                >
                  {user?.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="bg-gradient-to-br from-yellow-200 to-yellow-500 w-full h-full flex items-center justify-center text-gray-800 font-bold">
                      {user?.firstName?.[0] || "U"}
                    </div>
                  )}
                </Link>
              ) : (
                <Link
                  to="/login/user"
                  className="flex items-center gap-2 px-4 py-2 bg-[#FCD34D] text-gray-900 rounded-lg font-semibold hover:bg-[#FBBF24] transition-colors"
                >
                  <User size={18} />
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 w-full">
        <Outlet />
      </div>

      {/* Notification Sidebar */}
      <NotificationSidebar
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        notifications={notifications}
        mutate={mutate}
        apiPrefix=""
      />
    </div>
  );
}
