import { useState, useMemo, useEffect } from "react";
import EditProductModal from "../components/EditProductModal";
import ConfirmDialog from "../components/ConfirmDialog";
import {
  Plus,
  Edit3,
  Trash2,
  Search,
  Tag,
  ArrowRightLeft,
  Loader2,
  X,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useOwnerProducts, useMyShops } from "../../../lib/hooks";
import { api } from "../../../lib/api";
import Select from "../../../components/Select";
import Modal from "../components/Modal";

// Helper to safely get first image from images field (could be JSON string or array)
const getFirstImage = (images) => {
  if (!images) return "";
  // If it's already an array
  if (Array.isArray(images)) return images[0] || "";
  // If it's a JSON string, try to parse it
  if (typeof images === "string") {
    try {
      const parsed = JSON.parse(images);
      if (Array.isArray(parsed)) return parsed[0] || "";
    } catch {
      // If parsing fails, it might be a direct URL
      return images;
    }
  }
  return "";
};

export default function Products() {
  const [activeTab, setActiveTab] = useState("Selling");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: "" });

  // Debounced search for API
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input - fixed useEffect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch ALL products (don't filter by type in API - filter locally to preserve state)
  const {
    products: allProducts,
    isLoading,
    mutate: mutateProducts,
  } = useOwnerProducts({
    search: debouncedSearch,
    category: categoryFilter,
  });

  // Fetch shops to get shopId for creating products
  const { shops } = useMyShops();

  // Filter products locally for immediate feedback and tab switching
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const matchesSearch =
        !searchQuery ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        !categoryFilter || product.category === categoryFilter;

      const matchesType = product.type === activeTab;

      return matchesSearch && matchesCategory && matchesType;
    });
  }, [allProducts, searchQuery, categoryFilter, activeTab]);

  // Get unique categories from products
  const categories = useMemo(() => {
    const cats = new Set(allProducts.map((p) => p.category));
    return Array.from(cats).filter(Boolean);
  }, [allProducts]);

  // Modal Handlers
  const handleAddClick = () => {
    setSelectedProduct(null);
    setIsEditModalOpen(true);
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveProduct = async (productData) => {
    setIsSubmitting(true);
    try {
      // Get shopId from first shop (owner must have at least one shop)
      const shopId = shops[0]?.id;
      if (!shopId && !selectedProduct) {
        setErrorModal({
          isOpen: true,
          message: "You need to create a shop first before adding products.",
        });
        setIsSubmitting(false);
        return;
      }

      // Prepare API payload - clean values
      const priceValue =
        parseFloat(String(productData.price).replace(/[^0-9.]/g, "")) || 0;
      const stockValue =
        parseInt(String(productData.stock).replace(/[^0-9]/g, "")) || 0;

      const payload = {
        name: productData.name,
        description: productData.description || "",
        price: priceValue,
        category: productData.category,
        stock: stockValue,
        type: productData.type === "selling" ? "Selling" : "Buying",
      };

      // Handle images
      if (productData.image && productData.image.startsWith("data:")) {
        // New base64 upload
        payload.images = [productData.image];
      } else if (productData.image) {
        // Keep existing image URL when editing
        payload.images = [productData.image];
      } else {
        // No image
        payload.images = [];
      }

      console.log("Saving product with payload:", payload);

      if (selectedProduct) {
        // Update existing product - don't need shopId
        await api.put(`/products/${selectedProduct.id}`, payload);
      } else {
        // Create new product - need shopId
        await api.post("/products", { ...payload, shopId });
      }

      // Refresh products list
      mutateProducts();
      setIsEditModalOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Failed to save product:", error);
      // Show detailed validation errors if available
      const errorMsg = error.data?.errors
        ? error.data.errors.map((e) => e.msg).join(", ")
        : error.data?.error || "Failed to save product";
      setErrorModal({ isOpen: true, message: errorMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async () => {
    setIsSubmitting(true);
    try {
      await api.delete(`/products/${productToDelete.id}`);
      mutateProducts();
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (error) {
      console.error("Failed to delete product:", error);
      setErrorModal({
        isOpen: true,
        message: error.data?.error || "Failed to delete product",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getProductImage = (product) => {
    const image = getFirstImage(product.images);
    if (image) return image;
    // Fallback placeholder
    return `https://placehold.co/400x400/f3f4f6/9ca3af?text=${encodeURIComponent(
      product.name?.slice(0, 12) || "Product"
    )}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Products Management
            </h1>
            <p className="text-gray-500">
              Manage what you sell and what you want to buy.
            </p>
          </div>
          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 px-6 py-3 bg-[#4F46E5] text-white font-bold rounded-xl hover:bg-indigo-700 hover:-translate-y-0.5 transition-all"
          >
            <Plus size={20} />
            Add New Item
          </button>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("Selling")}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-all ${
              activeTab === "Selling"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
            }`}
          >
            <Tag size={18} />
            My Products (Selling)
          </button>
          <button
            onClick={() => setActiveTab("Buying")}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-all ${
              activeTab === "Buying"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
            }`}
          >
            <ArrowRightLeft size={18} />
            Buying from Users
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </Select>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-indigo-600" size={40} />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <Package size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || categoryFilter
                ? "Try adjusting your filters"
                : `You haven't added any ${activeTab.toLowerCase()} products yet.`}
            </p>
            <button
              onClick={handleAddClick}
              className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"
            >
              Add Your First Product
            </button>
          </div>
        )}

        {/* Product List */}
        {!isLoading && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden group transition-all"
              >
                <div className="h-40 bg-gray-100 relative overflow-hidden">
                  <img
                    src={getProductImage(product)}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 flex gap-2">
                    {/* Status Badge */}
                    {product.status === "pending" && (
                      <div className="px-2 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 flex items-center gap-1">
                        <Clock size={12} />
                        Pending
                      </div>
                    )}
                    {product.status === "approved" && (
                      <div className="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 flex items-center gap-1">
                        <CheckCircle2 size={12} />
                        Approved
                      </div>
                    )}
                    {product.status === "rejected" && (
                      <div className="px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 flex items-center gap-1">
                        <XCircle size={12} />
                        Rejected
                      </div>
                    )}
                    {/* Type Badge */}
                    <div className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700">
                      {product.type}
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-indigo-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg text-sm">
                      ₱{product.price}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-semibold">
                      {product.category}
                    </span>
                    <span>• Stock: {product.stock}</span>
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleEditClick(product)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 text-sm font-semibold transition-colors"
                    >
                      <Edit3 size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(product)}
                      className="flex items-center justify-center p-2 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Add New Card */}
            <button
              onClick={handleAddClick}
              className="h-full min-h-[300px] border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-3 text-gray-400 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all group"
            >
              <div className="w-14 h-14 rounded-full bg-gray-100 group-hover:bg-indigo-100 flex items-center justify-center transition-colors">
                <Plus size={28} />
              </div>
              <span className="font-semibold">Add New Item</span>
            </button>
          </div>
        )}
      </main>

      {/* Modals */}
      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProduct(null);
        }}
        onSave={handleSaveProduct}
        product={
          selectedProduct
            ? {
                ...selectedProduct,
                // Only pass actual base64/data URL images, not placeholder URLs
                image: getFirstImage(selectedProduct.images) || "",
                type: selectedProduct.type === "Selling" ? "selling" : "buying",
              }
            : null
        }
        isLoading={isSubmitting}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={handleDeleteProduct}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />

      {/* Error Modal */}
      <Modal
        isOpen={errorModal.isOpen}
        onClose={() => setErrorModal({ isOpen: false, message: "" })}
        title="Error"
        size="sm"
      >
        <div className="flex flex-col items-center text-center py-4">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <AlertCircle size={28} className="text-red-600" />
          </div>
          <p className="text-gray-700 mb-6">{errorModal.message}</p>
          <button
            onClick={() => setErrorModal({ isOpen: false, message: "" })}
            className="px-8 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            OK
          </button>
        </div>
      </Modal>
    </div>
  );
}
