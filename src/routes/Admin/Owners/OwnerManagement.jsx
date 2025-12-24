import { useState, useEffect } from "react";
import {
  Check,
  X,
  Eye,
  Store,
  Search,
  Loader2,
  AlertCircle,
  MapPin,
  Phone,
  Mail,
  Calendar,
} from "lucide-react";
import Select from "../../../components/Select";
import Modal from "../../../components/Modal";
import { getOwners, deleteOwner, approveOwner } from "../../../lib/admin";

export default function OwnerManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [modalType, setModalType] = useState(null); // 'view', 'accept', 'reject'
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getOwners(100, 0);
      setOwners(res.owners || []);
    } catch (err) {
      console.error("Failed to fetch owners:", err);
      setError(err.message || "Failed to load owners");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (owner, type) => {
    setSelectedOwner(owner);
    setModalType(type);
  };

  const handleCloseModal = () => {
    setSelectedOwner(null);
    setModalType(null);
  };

  const handleAccept = async () => {
    if (!selectedOwner) return;
    setActionLoading(true);
    try {
      await approveOwner(selectedOwner.id);
      // Update local state
      setOwners(
        owners.map((o) =>
          o.id === selectedOwner.id ? { ...o, approved: true } : o
        )
      );
      handleCloseModal();
    } catch (err) {
      console.error("Failed to approve owner:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedOwner) return;
    setActionLoading(true);
    try {
      await deleteOwner(selectedOwner.id);
      setOwners(owners.filter((o) => o.id !== selectedOwner.id));
      handleCloseModal();
    } catch (err) {
      console.error("Failed to reject owner:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredOwners = owners.filter((owner) => {
    const businessName = owner.businessName || "";
    const email = owner.email || "";
    const matchesSearch =
      businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by approval status
    const matchesStatus =
      filterStatus === "All" ||
      (filterStatus === "Approved" && owner.approved) ||
      (filterStatus === "Pending" && !owner.approved);

    return matchesSearch && matchesStatus;
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
          <p className="text-gray-500 font-medium">Loading owners...</p>
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
              Failed to load owners
            </p>
            <p className="text-gray-500">{error}</p>
          </div>
          <button
            onClick={fetchOwners}
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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Owner Management</h1>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search owners..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 text-sm font-semibold text-gray-600">
                  Business
                </th>
                <th className="p-4 text-sm font-semibold text-gray-600">
                  Contact
                </th>
                <th className="p-4 text-sm font-semibold text-gray-600">
                  Status
                </th>
                <th className="p-4 text-sm font-semibold text-gray-600">
                  Shops
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
              {filteredOwners.length > 0 ? (
                filteredOwners.map((owner) => (
                  <tr
                    key={owner.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {owner.profilePic ? (
                          <img
                            src={owner.profilePic}
                            alt={owner.businessName}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                            {owner.businessName?.slice(0, 2).toUpperCase() ||
                              "OW"}
                          </div>
                        )}
                        <span className="font-medium text-gray-900">
                          {owner.businessName || "Unnamed Business"}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm font-medium text-gray-900">
                        {owner.email}
                      </p>
                      <p className="text-xs text-gray-500">
                        {owner.phone || "No phone"}
                      </p>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          owner.approved
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {owner.approved ? "Approved" : "Pending"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                        {owner._count?.shops || 0} shops
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {formatDate(owner.createdAt)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenModal(owner, "accept")}
                          className={`p-2 rounded-lg transition-colors ${
                            owner.approved
                              ? "text-gray-300 cursor-not-allowed"
                              : "text-green-600 hover:bg-green-50"
                          }`}
                          title={owner.approved ? "Already approved" : "Approve"}
                          disabled={owner.approved}
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={() => handleOpenModal(owner, "reject")}
                          className={`p-2 rounded-lg transition-colors ${
                            !owner.approved
                              ? "text-gray-300 cursor-not-allowed"
                              : "text-red-600 hover:bg-red-50"
                          }`}
                          title={!owner.approved ? "Not yet approved" : "Reject"}
                          disabled={!owner.approved}
                        >
                          <X size={18} />
                        </button>
                        <button
                          onClick={() => handleOpenModal(owner, "view")}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    No owners found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Owner Details Modal */}
      <Modal
        isOpen={modalType === "view" && !!selectedOwner}
        onClose={handleCloseModal}
        title="Business Details"
      >
        {selectedOwner && (
          <div className="space-y-6">
            {/* Business Header */}
            <div className="flex items-center gap-4">
              {selectedOwner.profilePic ? (
                <img
                  src={selectedOwner.profilePic}
                  alt={selectedOwner.businessName}
                  className="w-16 h-16 rounded-2xl object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-2xl">
                  {selectedOwner.businessName?.slice(0, 2).toUpperCase() ||
                    "OW"}
                </div>
              )}
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedOwner.businessName || "Unnamed Business"}
                </h3>
                <p className="text-gray-500">
                  Owner ID: {selectedOwner.id?.slice(0, 8)}...
                </p>
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Mail size={16} />
                  <span className="text-sm font-medium">Email</span>
                </div>
                <p className="text-gray-900 font-semibold">
                  {selectedOwner.email}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Phone size={16} />
                  <span className="text-sm font-medium">Phone</span>
                </div>
                <p className="text-gray-900 font-semibold">
                  {selectedOwner.phone || "Not provided"}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl md:col-span-2">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <MapPin size={16} />
                  <span className="text-sm font-medium">Business Address</span>
                </div>
                <p className="text-gray-900 font-semibold">
                  {selectedOwner.businessAddress || "Not provided"}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Store size={16} />
                  <span className="text-sm font-medium">Shops</span>
                </div>
                <p className="text-gray-900 font-semibold">
                  {selectedOwner._count?.shops || 0} registered
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Calendar size={16} />
                  <span className="text-sm font-medium">Joined</span>
                </div>
                <p className="text-gray-900 font-semibold">
                  {formatDate(selectedOwner.createdAt)}
                </p>
              </div>
            </div>

            {/* Actions */}
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
                  handleOpenModal(selectedOwner, "reject");
                }}
                className="px-4 py-2.5 bg-red-100 text-red-600 font-semibold rounded-xl hover:bg-red-200 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Accept Confirmation Modal */}
      <Modal
        isOpen={modalType === "accept" && !!selectedOwner}
        onClose={handleCloseModal}
        title="Approve Business"
      >
        {selectedOwner && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-green-100 rounded-full">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Approve this business?
                </h3>
                <p className="text-gray-500">
                  You are about to approve{" "}
                  <strong>{selectedOwner.businessName}</strong>.
                </p>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600">
                This will allow the owner to operate their business on the
                platform. They will have full access to create shops and list
                products.
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
                onClick={handleAccept}
                disabled={actionLoading}
                className="flex-1 px-4 py-2.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {actionLoading ? "Approving..." : "Approve Business"}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Reject Confirmation Modal */}
      <Modal
        isOpen={modalType === "reject" && !!selectedOwner}
        onClose={handleCloseModal}
        title="Remove Business"
      >
        {selectedOwner && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-red-100 rounded-full">
                <X className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Remove this business?
                </h3>
                <p className="text-gray-500">
                  You are about to remove{" "}
                  <strong>{selectedOwner.businessName}</strong>.
                </p>
              </div>
            </div>
            <div className="p-4 bg-red-50 rounded-xl border border-red-100">
              <p className="text-sm text-red-700">
                <strong>Warning:</strong> This action cannot be undone. The
                owner will lose access to their account and all associated shops
                and products will be removed.
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
                onClick={handleReject}
                disabled={actionLoading}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {actionLoading ? "Removing..." : "Remove Business"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
