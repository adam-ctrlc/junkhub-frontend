import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Shield,
  LogOut,
  Menu,
  X,
  Bell,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useAdminNotifications, useAdminUnreadCount } from "../../../lib/hooks";
import NotificationSidebar from "../../../components/NotificationSidebar";

export default function AdminNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { notifications, mutate } = useAdminNotifications();
  const { unreadCount } = useAdminUnreadCount();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const handleLogout = async () => {
    if (logout) await logout();
    navigate("/admin/login");
  };

  const isActive = (path) => {
    return location.pathname === path
      ? "text-[#2563EB] bg-blue-50"
      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50";
  };

  const navItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/owners", label: "Owners", icon: Shield },
    { path: "/admin/products", label: "Products", icon: ShoppingBag },
    { path: "/admin/users", label: "User Control", icon: Users },
  ];

  const adminInitials = user?.firstName
    ? user.firstName.slice(0, 2).toUpperCase()
    : "AD";
  const adminName = user?.firstName
    ? `${user.firstName} ${user.lastName || ""}`
    : "Admin User";
  const adminEmail = user?.email || "admin@junkhub.com";

  return (
    <>
      <nav className="w-full bg-white border-b border-gray-200 font-sans sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center">
              <img
                src="/team/Logo.png"
                alt="Logo"
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <span className="text-lg sm:text-xl font-bold tracking-tight text-gray-900">
              Junk<span className="font-extrabold text-[#2563EB]">HUB</span>{" "}
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 ml-1">
                ADMIN
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isActive(
                  item.path
                )}`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setIsNotifOpen(true)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full relative transition-colors"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 min-w-4 h-4 px-1 bg-red-500 rounded-full border-2 border-white text-white text-[10px] flex items-center justify-center font-bold">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

            <Link
              to="/admin/profile"
              className="hidden sm:flex items-center gap-2 sm:gap-4 group"
            >
              <div className="text-right hidden lg:block">
                <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {adminName}
                </div>
                <div className="text-xs text-gray-500">{adminEmail}</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#2563EB] flex items-center justify-center text-white font-bold ring-2 ring-blue-100 group-hover:ring-[#2563EB] transition-all overflow-hidden">
                {user?.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  adminInitials
                )}
              </div>
            </Link>

            <button
              onClick={handleLogout}
              className="hidden sm:flex p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 md:hidden shadow-lg animate-in slide-in-from-top-2">
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(
                    item.path
                  )}`}
                >
                  <item.icon size={20} />
                  {item.label}
                </Link>
              ))}

              <hr className="my-2 border-gray-200" />

              {/* Mobile User Info */}
              <Link
                to="/admin/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-4 px-4 py-2"
              >
                <div className="w-10 h-10 rounded-full bg-[#2563EB] flex items-center justify-center text-white font-bold ring-2 ring-blue-100 overflow-hidden">
                  {user?.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    adminInitials
                  )}
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900">
                    {adminName}
                  </div>
                  <div className="text-xs text-gray-500">{adminEmail}</div>
                </div>
              </Link>

              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Notification Sidebar */}
      <NotificationSidebar
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        notifications={notifications}
        mutate={mutate}
        apiPrefix="/admin"
      />
    </>
  );
}
