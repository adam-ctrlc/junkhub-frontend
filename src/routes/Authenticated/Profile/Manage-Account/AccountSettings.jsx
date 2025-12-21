import { Edit, Camera, Save, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Modal from "../../components/Modal";
import { ButtonLoader } from "../../../../components/LoadingOverlay";
import { useUser } from "../../../../lib/hooks";
import api from "../../../../lib/api";

export default function AccountSettings() {
  const { user, isLoading, mutate } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const fileInputRef = useRef(null);

  // Load user data into form
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
      setProfilePicPreview(user.profilePic || null);
    }
  }, [user]);

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

    // Validate file type and size
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB");
      return;
    }

    // Convert to base64
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
    try {
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        address: formData.address,
      };
      if (profilePic) {
        updateData.profilePic = profilePic;
      }
      await api.put("/users/profile", updateData);
      mutate(); // Refresh user data
      setIsEditing(false);
      setProfilePic(null); // Reset staged profilePic
    } catch (err) {
      setError(err.data?.error || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setPasswordLoading(true);
    try {
      await api.put("/users/password", {
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
      setPasswordError(err.data?.error || "Failed to update password");
    } finally {
      setPasswordLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-[#FCD34D] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex justify-between items-start mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Account Information
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
              <ButtonLoader isLoading={loading} text="Saving...">
                <Save size={16} />
                <span>Save</span>
              </ButtonLoader>
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-[#FCD34D] px-4 py-2 rounded-lg font-bold text-gray-900 hover:bg-[#FBBF24] transition-colors"
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
            className={`w-32 h-32 rounded-full bg-yellow-200 border-4 border-white overflow-hidden relative group ${
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
              <div className="bg-gradient-to-br from-yellow-200 to-yellow-500 w-full h-full flex items-center justify-center text-gray-800 text-4xl font-bold">
                {formData.firstName?.[0] || "U"}
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
              Change Picture
            </button>
          )}
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-xs text-gray-500">First Name</label>
            {isEditing ? (
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-3 bg-white rounded-lg border border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-gray-900"
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded-lg text-gray-900 font-medium border border-gray-100">
                {formData.firstName || "-"}
              </div>
            )}
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-500">Last Name</label>
            {isEditing ? (
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-3 bg-white rounded-lg border border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-gray-900"
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded-lg text-gray-900 font-medium border border-gray-100">
                {formData.lastName || "-"}
              </div>
            )}
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-500">Email</label>
            <div className="p-3 bg-gray-50 rounded-lg text-gray-900 font-medium border border-gray-100">
              {formData.email}
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-500">Phone Number</label>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 bg-white rounded-lg border border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-gray-900"
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded-lg text-gray-900 font-medium border border-gray-100">
                {formData.phone || "-"}
              </div>
            )}
          </div>
          <div className="col-span-1 md:col-span-2 space-y-1">
            <label className="text-xs text-gray-500">Address</label>
            {isEditing ? (
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={2}
                className="w-full p-3 bg-white rounded-lg border border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-gray-900 resize-none"
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded-lg text-gray-900 font-medium border border-gray-100">
                {formData.address || "-"}
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

      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Change Password"
        actions={
          <>
            <button
              onClick={() => setIsPasswordModalOpen(false)}
              className="px-4 py-2 bg-white text-gray-700 font-bold rounded-lg border border-gray-200 hover:bg-gray-50"
              disabled={passwordLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleChangePassword}
              className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 flex items-center gap-2"
              disabled={passwordLoading}
            >
              {passwordLoading && (
                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              Update Password
            </button>
          </>
        }
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
        </div>
      </Modal>
    </div>
  );
}
