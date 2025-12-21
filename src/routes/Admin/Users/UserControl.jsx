import { useState, useEffect } from "react";
import {
  Ban,
  Eye,
  Search,
  Loader2,
  AlertCircle,
  Trash2,
  User,
  Mail,
  Phone,
  Calendar,
  ShoppingCart,
} from "lucide-react";
import Select from "../../../components/Select";
import Modal from "../../../components/Modal";
import { getUsers, deleteUser } from "../../../lib/admin";

export default function UserControl() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalType, setModalType] = useState(null); // 'view', 'delete'
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getUsers(100, 0);
      setUsers(res.users || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (user, type) => {
    setSelectedUser(user);
    setModalType(type);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setModalType(null);
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    try {
      await deleteUser(selectedUser.id);
      setUsers(users.filter((u) => u.id !== selectedUser.id));
      handleCloseModal();
    } catch (err) {
      console.error("Failed to delete user:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName || ""} ${
      user.lastName || ""
    }`.toLowerCase();
    const email = user.email?.toLowerCase() || "";
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase())
    );
  });

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-gray-500 font-medium">Loading users...</p>
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
              Failed to load users
            </p>
            <p className="text-gray-500">{error}</p>
          </div>
          <button
            onClick={fetchUsers}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 text-sm font-semibold text-gray-600">
                  User
                </th>
                <th className="p-4 text-sm font-semibold text-gray-600">
                  Contact
                </th>
                <th className="p-4 text-sm font-semibold text-gray-600">
                  Orders
                </th>
                <th className="p-4 text-sm font-semibold text-gray-600">
                  Joined
                </th>
                <th className="p-4 text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {user.profilePic ? (
                          <img
                            src={user.profilePic}
                            alt={`${user.firstName} ${user.lastName}`}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                            {user.firstName?.[0]?.toUpperCase() || "U"}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-gray-600">
                        {user.phone || "No phone"}
                      </p>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                        {user._count?.orders || 0} orders
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenModal(user, "view")}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleOpenModal(user, "delete")}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    No users found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View User Modal */}
      <Modal
        isOpen={modalType === "view" && !!selectedUser}
        onClose={handleCloseModal}
        title="User Details"
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              {selectedUser.profilePic ? (
                <img
                  src={selectedUser.profilePic}
                  alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-2xl">
                  {selectedUser.firstName?.[0]?.toUpperCase() || "U"}
                </div>
              )}
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedUser.firstName} {selectedUser.lastName}
                </h3>
                <p className="text-gray-500">
                  User ID: {selectedUser.id?.slice(0, 8)}...
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Mail size={16} />
                  <span className="text-sm font-medium">Email</span>
                </div>
                <p className="text-gray-900 font-semibold">
                  {selectedUser.email}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Phone size={16} />
                  <span className="text-sm font-medium">Phone</span>
                </div>
                <p className="text-gray-900 font-semibold">
                  {selectedUser.phone || "Not provided"}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <ShoppingCart size={16} />
                  <span className="text-sm font-medium">Orders</span>
                </div>
                <p className="text-gray-900 font-semibold">
                  {selectedUser._count?.orders || 0} total
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Calendar size={16} />
                  <span className="text-sm font-medium">Joined</span>
                </div>
                <p className="text-gray-900 font-semibold">
                  {formatDate(selectedUser.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleCloseModal();
                  handleOpenModal(selectedUser, "delete");
                }}
                className="px-4 py-2.5 bg-red-100 text-red-600 font-semibold rounded-xl hover:bg-red-200 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={modalType === "delete" && !!selectedUser}
        onClose={handleCloseModal}
        title="Delete User"
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-red-100 rounded-full">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Delete this user?
                </h3>
                <p className="text-gray-500">
                  You are about to delete{" "}
                  <strong>
                    {selectedUser.firstName} {selectedUser.lastName}
                  </strong>
                  .
                </p>
              </div>
            </div>
            <div className="p-4 bg-red-50 rounded-xl border border-red-100">
              <p className="text-sm text-red-700">
                <strong>Warning:</strong> This action cannot be undone. The user
                account and all associated data (orders, reviews, etc.) will be
                permanently removed.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={actionLoading}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {actionLoading ? "Deleting..." : "Delete User"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
