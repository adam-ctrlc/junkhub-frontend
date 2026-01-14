import { useState, useEffect, useRef } from "react";
import {
  User,
  Lock,
  Bell,
  AlertTriangle,
  ShieldCheck,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
  AlertCircle,
  Camera,
} from "lucide-react";
import { getAdminProfile, updateAdminPassword } from "../../../lib/admin";
import { api } from "../../../lib/api";

export default function AdminProfile() {
  const [activeTab, setActiveTab] = useState("account");
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAdminProfile();
      setAdmin(res.admin);
      setProfilePicPreview(res.admin?.profilePic || null);
    } catch (err) {
      console.error("Failed to fetch admin profile:", err);
      setError(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      setProfilePic(base64);
      setProfilePicPreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfilePic = async () => {
    if (!profilePic) return;
    setProfileLoading(true);
    setProfileSuccess("");
    try {
      await api.put("/admin/profile", { profilePic });
      setProfileSuccess("Profile picture updated!");
      setProfilePic(null);
      fetchProfile();
    } catch (err) {
      console.error("Failed to update profile pic:", err);
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    // Frontend validation
    if (!currentPassword) {
      setPasswordError("Current password is required");
      return;
    }

    if (!newPassword) {
      setPasswordError("New password is required");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    setPasswordLoading(true);
    try {
      await updateAdminPassword(currentPassword, newPassword);
      setPasswordSuccess("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      // Parse validation errors from backend
      if (err.errors && Array.isArray(err.errors)) {
        setPasswordError(err.errors.map((e) => e.msg).join(", "));
      } else {
        setPasswordError(err.message || "Failed to update password");
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  const sidebarButtons = [
    { id: "account", label: "Account Settings", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-gray-500 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="p-4 bg-red-100 rounded-full">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <div>
            <p className="text-gray-900 font-bold text-lg">
              Failed to load profile
            </p>
            <p className="text-gray-500">{error}</p>
          </div>
          <button
            onClick={fetchProfile}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <aside className="w-full md:w-64 flex-shrink-0 space-y-4">
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {sidebarButtons.map((btn, idx) => (
            <button
              key={btn.id}
              onClick={() => setActiveTab(btn.id)}
              className={`w-full flex items-center gap-3 px-6 py-4 transition-colors 
                ${idx !== 0 ? "border-t border-gray-100" : ""}
                ${
                  activeTab === btn.id
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "bg-white text-gray-600 font-medium hover:bg-gray-50"
                }
              `}
            >
              <btn.icon size={20} />
              {btn.label}
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 bg-white rounded-2xl border border-gray-100 p-8 min-h-[400px]">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          {activeTab === "account" && "Account Settings"}
          {activeTab === "security" && "Security Settings"}
          {activeTab === "notifications" && "Notification Preferences"}
        </h2>

        {activeTab === "account" && (
          <div className="space-y-6 max-w-lg">
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
              <ShieldCheck className="text-blue-600 shrink-0" size={20} />
              <p className="text-sm text-blue-800">
                Administrator details are managed by the system. Contact the
                master admin to request changes.
              </p>
            </div>

            {/* Profile Picture Section */}
            <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-2xl overflow-hidden relative group cursor-pointer"
              >
                {profilePicPreview ? (
                  <img
                    src={profilePicPreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  admin?.name?.slice(0, 2).toUpperCase() || "AD"
                )}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="text-white" size={20} />
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{admin?.name}</p>
                <p className="text-sm text-gray-500">{admin?.email}</p>
                {profilePic && (
                  <button
                    onClick={handleSaveProfilePic}
                    disabled={profileLoading}
                    className="mt-2 px-4 py-1.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {profileLoading ? "Saving..." : "Save Picture"}
                  </button>
                )}
                {profileSuccess && (
                  <p className="mt-1 text-sm text-green-600">
                    {profileSuccess}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Admin Name
              </label>
              <input
                type="text"
                value={admin?.name || ""}
                readOnly
                disabled
                className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={admin?.email || ""}
                readOnly
                disabled
                className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <input
                type="text"
                value={admin?.role?.toUpperCase() || "ADMIN"}
                readOnly
                disabled
                className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed focus:outline-none"
              />
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="max-w-lg space-y-8">
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
              <AlertTriangle className="text-red-600 shrink-0" size={20} />
              <div className="space-y-1">
                <h4 className="font-semibold text-red-900 text-sm">
                  Security Warning
                </h4>
                <p className="text-sm text-red-800">
                  Please keep your credentials secret. Write them down on paper
                  and store them safely. As an administrator, your account
                  security is critical.
                </p>
              </div>
            </div>

            {passwordSuccess && (
              <div className="p-4 bg-green-50 border border-green-100 rounded-xl flex items-center gap-3">
                <CheckCircle className="text-green-600" size={20} />
                <p className="text-sm text-green-800 font-medium">
                  {passwordSuccess}
                </p>
              </div>
            )}

            {passwordError && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3">
                <AlertCircle className="text-red-600" size={20} />
                <p className="text-sm text-red-800 font-medium">
                  {passwordError}
                </p>
              </div>
            )}

            <form className="space-y-6" onSubmit={handlePasswordSubmit}>
              <h3 className="font-semibold text-gray-900">Change Password</h3>

              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPass ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 pr-10"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPass ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 pr-10"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={passwordLoading}
                className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {passwordLoading ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
              <span className="font-medium text-gray-900">
                New Owner Registrations
              </span>
              <div className="w-10 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
              <span className="font-medium text-gray-900">
                New Product Submissions
              </span>
              <div className="w-10 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
