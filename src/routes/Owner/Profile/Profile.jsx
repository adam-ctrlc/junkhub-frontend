import { useState, useEffect, useRef } from "react";
import { Edit, Camera, Save, X, Building, Lock, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useOwnerProfile } from "../../../lib/hooks";
import { api } from "../../../lib/api";
import Modal from "../components/Modal";

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { owner, isLoading, mutate } = useOwnerProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [passwordError, setPasswordError] = useState("");
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [formData, setFormData] = useState({
    businessName: "",
    businessAddress: "",
    phone: "",
  });
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const fileInputRef = useRef(null);

  // Load owner data into form
  useEffect(() => {
    if (owner) {
      setFormData({
        businessName: owner.businessName || "",
        businessAddress: owner.businessAddress || "",
        phone: owner.phone || "",
      });
      setProfilePicPreview(owner.profilePic || null);
    }
  }, [owner]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB");
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

  const handleSave = async () => {
    setLoading(true);
    setError("");
    setFieldErrors({});
    try {
      const updateData = {
        businessName: formData.businessName,
        businessAddress: formData.businessAddress,
        phone: formData.phone,
      };
      if (profilePic) {
        updateData.profilePic = profilePic;
      }
      await api.put("/owner/profile", updateData);
      mutate(); // Refresh owner data
      setIsEditing(false);
      setProfilePic(null);
    } catch (err) {
      // Parse validation errors from backend
      if (err.data?.errors && Array.isArray(err.data.errors)) {
        const errors = {};
        err.data.errors.forEach((e) => {
          if (e.path) {
            errors[e.path] = e.msg;
          }
        });
        setFieldErrors(errors);
        setError("Please fix the errors below");
      } else {
        setError(err.data?.error || "Failed to update profile");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError("");

    // Frontend validation
    if (!passwordData.currentPassword) {
      setPasswordError("Current password is required");
      return;
    }

    if (!passwordData.newPassword) {
      setPasswordError("New password is required");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setPasswordLoading(true);
    try {
      await api.put("/owner/profile", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setIsPasswordModalOpen(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      alert("Password updated successfully!");
    } catch (err) {
      // Parse validation errors from backend
      if (err.data?.errors && Array.isArray(err.data.errors)) {
        setPasswordError(err.data.errors.map((e) => e.msg).join(", "));
      } else {
        setPasswordError(err.data?.error || "Failed to update password");
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login/owner");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-4 sticky top-24 self-start h-fit">
          {/* Owner Info */}
          <div className="bg-white rounded-lg p-4 border border-gray-100 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                {owner?.profilePic ? (
                  <img
                    src={owner.profilePic}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  owner?.businessName?.[0] || "O"
                )}
              </div>
              <div>
                <p className="font-bold text-gray-900">
                  {owner?.businessName || "My Business"}
                </p>
                <p className="text-sm text-gray-500">{owner?.email}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg overflow-hidden border border-gray-100">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-indigo-100 text-indigo-700 border-l-4 border-l-indigo-600">
              <Building size={20} />
              Account Settings
            </button>

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
          <div className="animate-in fade-in duration-300">
            <div className="flex justify-between items-start mb-8">
              <h1 className="text-2xl font-bold text-gray-900">
                Business Information
              </h1>
              {isEditing ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg font-bold text-gray-700 hover:bg-gray-200 transition-colors"
                    disabled={loading}
                  >
                    <X size={16} />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-indigo-600 px-4 py-2 rounded-lg font-bold text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Save size={16} />
                    )}
                    Save
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 bg-indigo-100 px-4 py-2 rounded-lg font-bold text-indigo-700 hover:bg-indigo-200 transition-colors"
                >
                  <Edit size={16} />
                  Edit
                </button>
              )}
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-8 mb-12">
              <div className="flex flex-col items-center gap-3">
                <div
                  onClick={() => isEditing && fileInputRef.current?.click()}
                  className={`w-32 h-32 rounded-full bg-indigo-100 border-4 border-white overflow-hidden relative group ${
                    isEditing ? "cursor-pointer" : ""
                  }`}
                >
                  {profilePicPreview ? (
                    <img
                      src={profilePicPreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="bg-gradient-to-br from-indigo-400 to-indigo-600 w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                      {formData.businessName?.[0] || "O"}
                    </div>
                  )}
                  {isEditing && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="text-white" size={24} />
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
                {isEditing && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-blue-500 text-sm font-medium hover:underline"
                  >
                    Change Logo
                  </button>
                )}
              </div>

              <div className="flex-1 grid grid-cols-1 gap-6">
                <div className="space-y-1">
                  <label className="text-xs text-gray-500">Business Name</label>
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                        className={`w-full p-3 bg-white rounded-lg border focus:outline-none focus:ring-1 text-gray-900 ${
                          fieldErrors.businessName
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                        }`}
                      />
                      {fieldErrors.businessName && (
                        <p className="text-xs text-red-500 mt-1">
                          {fieldErrors.businessName}
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg text-gray-900 font-medium border border-gray-100">
                      {formData.businessName || "-"}
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-500">Email</label>
                  <div className="p-3 bg-gray-50 rounded-lg text-gray-500 font-medium border border-gray-100">
                    {owner?.email || "-"}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-500">Phone Number</label>
                  {isEditing ? (
                    <>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="09123456789"
                        className={`w-full p-3 bg-white rounded-lg border focus:outline-none focus:ring-1 text-gray-900 ${
                          fieldErrors.phone
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                        }`}
                      />
                      {fieldErrors.phone && (
                        <p className="text-xs text-red-500 mt-1">
                          {fieldErrors.phone}
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg text-gray-900 font-medium border border-gray-100">
                      {formData.phone || "-"}
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-500">
                    Business Address
                  </label>
                  {isEditing ? (
                    <>
                      <textarea
                        name="businessAddress"
                        value={formData.businessAddress}
                        onChange={handleChange}
                        rows={2}
                        className={`w-full p-3 bg-white rounded-lg border focus:outline-none focus:ring-1 text-gray-900 resize-none ${
                          fieldErrors.businessAddress
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                        }`}
                      />
                      {fieldErrors.businessAddress && (
                        <p className="text-xs text-red-500 mt-1">
                          {fieldErrors.businessAddress}
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg text-gray-900 font-medium border border-gray-100">
                      {formData.businessAddress || "-"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <hr className="border-gray-100 mb-8" />

            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Security</h2>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                <span className="font-medium text-gray-900">Password</span>
                <button
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="text-blue-600 font-semibold border border-blue-600 px-4 py-1.5 rounded-lg hover:bg-blue-50 transition-colors text-sm"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Change Password"
      >
        <div className="space-y-4">
          {passwordError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {passwordError}
            </div>
          )}
          <div className="space-y-1">
            <label className="text-sm text-gray-700 font-medium">
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className="w-full p-3 bg-white rounded-lg border border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-gray-900"
              placeholder="Enter current password"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-gray-700 font-medium">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="w-full p-3 bg-white rounded-lg border border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-gray-900"
              placeholder="Enter new password"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-gray-700 font-medium">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full p-3 bg-white rounded-lg border border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-gray-900"
              placeholder="Confirm new password"
            />
          </div>
          <div className="flex gap-2 pt-4">
            <button
              onClick={() => setIsPasswordModalOpen(false)}
              className="flex-1 px-4 py-2 bg-white text-gray-700 font-bold rounded-lg border border-gray-200 hover:bg-gray-50"
              disabled={passwordLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleChangePassword}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2"
              disabled={passwordLoading}
            >
              {passwordLoading && (
                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              Update Password
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
