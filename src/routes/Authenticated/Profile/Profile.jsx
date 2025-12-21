import { useState } from "react";
import { User, ShoppingBag, Heart, LogOut } from "lucide-react";

import AccountSettings from "./Manage-Account/AccountSettings";
import OrderHistory from "./Orders/OrderHistory";
import Wishlist from "./Wishlist/Wishlist";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

export default function Profile() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState("orders");

  const handleLogout = async () => {
    await logout();
    navigate("/login/user");
  };

  const sidebarButtons = [
    { id: "account", label: "Manage Account", icon: User },
    { id: "orders", label: "My Orders", icon: ShoppingBag },
    { id: "wishlist", label: "My Wishlist", icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-4 sticky top-24 self-start h-fit">
          {/* User Info */}
          <div className="bg-white rounded-lg p-4 border border-gray-100 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-500 flex items-center justify-center text-gray-800 font-bold text-lg overflow-hidden">
                {user?.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user?.firstName?.[0] || "U"
                )}
              </div>
              <div>
                <p className="font-bold text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg overflow-hidden border border-gray-100">
            {sidebarButtons.map((btn, idx) => (
              <button
                key={btn.id}
                onClick={() => setActiveTab(btn.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 group ${
                  activeTab === btn.id
                    ? "bg-[#FCD34D] text-gray-900 border-l-4 border-l-[#F59E0B]"
                    : "hover:bg-gray-100 text-gray-600 border-l-4 border-l-transparent"
                }`}
              >
                <btn.icon size={20} />
                {btn.label}
              </button>
            ))}

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-6 py-4 bg-white text-red-500 font-medium hover:bg-gray-50 transition-colors border-t border-gray-100"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 bg-white rounded-xl p-8 min-h-[600px]">
          {activeTab === "account" && <AccountSettings />}
          {activeTab === "orders" && <OrderHistory />}
          {activeTab === "wishlist" && <Wishlist />}
        </div>
      </div>
    </div>
  );
}
