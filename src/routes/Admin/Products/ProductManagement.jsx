import { useState, useEffect } from "react";
import {
  X,
  Eye,
  Package,
  Store,
  Search,
  Loader2,
  AlertCircle,
  Trash2,
  PhilippinePeso,
  Tag,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import Select from "../../../components/Select";
import Modal from "../../../components/Modal";
import {
  getProducts,
  deleteProduct,
  approveProduct,
  rejectProduct,
} from "../../../lib/admin";

export default function ProductManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterShop, setFilterShop] = useState("All");
  const [statusFilter, setStatusFilter] = useState("pending"); // Default to pending
  const [products, setProducts] = useState([]);
  const [statusCounts, setStatusCounts] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalType, setModalType] = useState(null); // 'view', 'delete', 'reject'
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    fetchProducts();
  }, [statusFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getProducts(100, 0, statusFilter);
      setProducts(res.products || []);
      setStatusCounts(
        res.statusCounts || { pending: 0, approved: 0, rejected: 0 }
      );
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product, type) => {
    setSelectedProduct(product);
    setModalType(type);
    setRejectReason("");
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setModalType(null);
    setRejectReason("");
  };

  const handleApprove = async (product) => {
    setActionLoading(true);
    try {
      await approveProduct(product.id);
      // Refresh products
      fetchProducts();
    } catch (err) {
      console.error("Failed to approve product:", err);
      alert("Failed to approve product");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedProduct) return;
    setActionLoading(true);
    try {
      await rejectProduct(selectedProduct.id, rejectReason);
      // Refresh products
      fetchProducts();
      handleCloseModal();
    } catch (err) {
      console.error("Failed to reject product:", err);
      alert("Failed to reject product");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;
    setActionLoading(true);
    try {
      await deleteProduct(selectedProduct.id);
      setProducts(products.filter((p) => p.id !== selectedProduct.id));
      handleCloseModal();
      // Refresh to update counts
      fetchProducts();
    } catch (err) {
      console.error("Failed to delete product:", err);
    } finally {
      setActionLoading(false);
    }
  };

  // Get unique shops for filter
  const shops = [
    "All",
    ...new Set(products.map((p) => p.shop?.name).filter(Boolean)),
  ];

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesShop =
      filterShop === "All" || product.shop?.name === filterShop;
    return matchesSearch && matchesShop;
  });

  // Group by Shop
  const groupedProducts = filteredProducts.reduce((acc, product) => {
    const shopName = product.shop?.name || "Unknown Shop";
    if (!acc[shopName]) {
      acc[shopName] = [];
    }
    acc[shopName].push(product);
    return acc;
  }, {});

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 flex items-center gap-1">
            <Clock size={12} />
            Pending
          </span>
        );
      case "approved":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 flex items-center gap-1">
            <CheckCircle2 size={12} />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 flex items-center gap-1">
            <XCircle size={12} />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-gray-500 font-medium">Loading products...</p>
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
              Failed to load products
            </p>
            <p className="text-gray-500">{error}</p>
          </div>
          <button
            onClick={fetchProducts}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              value={filterShop}
              onChange={(e) => setFilterShop(e.target.value)}
            >
              {shops.map((shop) => (
                <option key={shop} value={shop}>
                  {shop === "All" ? "All Shops" : shop}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setStatusFilter("pending")}
          className={`flex items-center gap-2 px-6 py-3 font-semibold border-b-2 transition-all ${
            statusFilter === "pending"
              ? "border-amber-500 text-amber-600 bg-amber-50/50"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <Clock size={18} />
          Pending
          {statusCounts.pending > 0 && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-amber-100 text-amber-700">
              {statusCounts.pending}
            </span>
          )}
        </button>
        <button
          onClick={() => setStatusFilter("approved")}
          className={`flex items-center gap-2 px-6 py-3 font-semibold border-b-2 transition-all ${
            statusFilter === "approved"
              ? "border-green-500 text-green-600 bg-green-50/50"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <CheckCircle2 size={18} />
          Approved
          {statusCounts.approved > 0 && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">
              {statusCounts.approved}
            </span>
          )}
        </button>
        <button
          onClick={() => setStatusFilter("rejected")}
          className={`flex items-center gap-2 px-6 py-3 font-semibold border-b-2 transition-all ${
            statusFilter === "rejected"
              ? "border-red-500 text-red-600 bg-red-50/50"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <XCircle size={18} />
          Rejected
          {statusCounts.rejected > 0 && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-700">
              {statusCounts.rejected}
            </span>
          )}
        </button>
      </div>

      {Object.keys(groupedProducts).length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 text-gray-500">
          No {statusFilter} products found.
        </div>
      ) : (
        Object.entries(groupedProducts).map(([shopName, shopProducts]) => (
          <div
            key={shopName}
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
          >
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
              <Store size={20} className="text-blue-600" />
              <h3 className="font-bold text-gray-900">{shopName}</h3>
              <span className="text-sm text-gray-500">
                ({shopProducts.length} items)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-gray-100">
                  <tr>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase">
                      Product
                    </th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase">
                      Price
                    </th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase">
                      Type
                    </th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase">
                      Stock
                    </th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {shopProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <Package size={20} />
                          </div>
                          <span className="font-medium text-gray-900">
                            {product.name}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-sm font-medium text-gray-900">
                        ₱{product.price?.toLocaleString()}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            product.type === "Selling"
                              ? "bg-green-100 text-green-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {product.type}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {product.stock} units
                      </td>
                      <td className="p-4">{getStatusBadge(product.status)}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenModal(product, "view")}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                          {product.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleApprove(product)}
                                disabled={actionLoading}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                                title="Approve"
                              >
                                <CheckCircle2 size={18} />
                              </button>
                              <button
                                onClick={() =>
                                  handleOpenModal(product, "reject")
                                }
                                className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                title="Reject"
                              >
                                <XCircle size={18} />
                              </button>
                            </>
                          )}
                          {product.status === "rejected" && (
                            <button
                              onClick={() => handleApprove(product)}
                              disabled={actionLoading}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Approve"
                            >
                              <CheckCircle2 size={18} />
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenModal(product, "delete")}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}

      {/* View Product Modal */}
      <Modal
        isOpen={modalType === "view" && !!selectedProduct}
        onClose={handleCloseModal}
        title="Product Details"
      >
        {selectedProduct && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Package size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedProduct.name}
                </h3>
                <p className="text-gray-500">
                  {selectedProduct.shop?.name || "Unknown Shop"}
                </p>
              </div>
              <div className="ml-auto">
                {getStatusBadge(selectedProduct.status)}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <PhilippinePeso size={16} />
                  <span className="text-sm font-medium">Price</span>
                </div>
                <p className="text-gray-900 font-semibold">
                  ₱{selectedProduct.price?.toLocaleString()}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Tag size={16} />
                  <span className="text-sm font-medium">Category</span>
                </div>
                <p className="text-gray-900 font-semibold">
                  {selectedProduct.category || "N/A"}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Package size={16} />
                  <span className="text-sm font-medium">Stock</span>
                </div>
                <p className="text-gray-900 font-semibold">
                  {selectedProduct.stock} units
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Calendar size={16} />
                  <span className="text-sm font-medium">Created</span>
                </div>
                <p className="text-gray-900 font-semibold">
                  {formatDate(selectedProduct.createdAt)}
                </p>
              </div>
            </div>

            {selectedProduct.description && (
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm font-medium text-gray-500 mb-2">
                  Description
                </p>
                <p className="text-gray-700">{selectedProduct.description}</p>
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              {selectedProduct.status === "pending" && (
                <>
                  <button
                    onClick={() => {
                      handleApprove(selectedProduct);
                      handleCloseModal();
                    }}
                    className="px-4 py-2.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      handleCloseModal();
                      setTimeout(
                        () => handleOpenModal(selectedProduct, "reject"),
                        100
                      );
                    }}
                    className="px-4 py-2.5 bg-amber-100 text-amber-700 font-semibold rounded-xl hover:bg-amber-200 transition-colors"
                  >
                    Reject
                  </button>
                </>
              )}
              <button
                onClick={() => {
                  handleCloseModal();
                  handleOpenModal(selectedProduct, "delete");
                }}
                className="px-4 py-2.5 bg-red-100 text-red-600 font-semibold rounded-xl hover:bg-red-200 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Reject Product Modal */}
      <Modal
        isOpen={modalType === "reject" && !!selectedProduct}
        onClose={handleCloseModal}
        title="Reject Product"
      >
        {selectedProduct && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-amber-100 rounded-full">
                <XCircle className="w-8 h-8 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Reject this product?
                </h3>
                <p className="text-gray-500">
                  You are about to reject{" "}
                  <strong>{selectedProduct.name}</strong>.
                </p>
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
              <p className="text-sm text-amber-700">
                <strong>Note:</strong> The owner will be notified about this
                rejection. They can update their product and it will need to be
                reviewed again.
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
                className="flex-1 px-4 py-2.5 bg-amber-600 text-white font-semibold rounded-xl hover:bg-amber-700 transition-colors disabled:opacity-50"
              >
                {actionLoading ? "Rejecting..." : "Reject Product"}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={modalType === "delete" && !!selectedProduct}
        onClose={handleCloseModal}
        title="Delete Product"
      >
        {selectedProduct && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-red-100 rounded-full">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Delete this product?
                </h3>
                <p className="text-gray-500">
                  You are about to delete{" "}
                  <strong>{selectedProduct.name}</strong>.
                </p>
              </div>
            </div>
            <div className="p-4 bg-red-50 rounded-xl border border-red-100">
              <p className="text-sm text-red-700">
                <strong>Warning:</strong> This action cannot be undone. The
                product will be permanently removed from the platform.
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
                {actionLoading ? "Deleting..." : "Delete Product"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
