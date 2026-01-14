import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useShop } from "../../../lib/hooks";
import api from "../../../lib/api";
import {
  MapPin,
  ArrowLeft,
  Package,
  Store,
  Star,
  Search,
  X,
  Tag,
  ArrowRightLeft,
  Send,
  CheckCircle,
} from "lucide-react";
import Select from "../../../components/Select";
import Modal from "../components/Modal";
import { ShopDetailsSkeleton } from "../../../components/Skeletons";

export default function ShopDetails() {
  const { id } = useParams();
  const { shop, isLoading, isError } = useShop(id);

  // Tabs and filters state
  const [activeTab, setActiveTab] = useState("selling");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Sell to shop modal state
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [selectedBuyingProduct, setSelectedBuyingProduct] = useState(null);
  const [sellForm, setSellForm] = useState({
    quantity: 1,
    description: "",
    contactNumber: "",
  });
  const [sellSubmitting, setSellSubmitting] = useState(false);
  const [sellSuccess, setSellSuccess] = useState(false);
  const [sellError, setSellError] = useState(null);

  // Parse images - handle string, array, or undefined
  const parseImages = (images) => {
    if (!images) return [];
    if (Array.isArray(images)) return images;
    if (typeof images === "string") {
      try {
        const parsed = JSON.parse(images);
        return Array.isArray(parsed) ? parsed : [images];
      } catch {
        return [images];
      }
    }
    return [];
  };

  // Separate products by type - using "Selling" and "Buying" (capital letters)
  const { sellingProducts, buyingProducts, categories } = useMemo(() => {
    if (!shop?.products)
      return { sellingProducts: [], buyingProducts: [], categories: [] };

    const selling = shop.products.filter(
      (p) => p.type === "Selling" || !p.type
    );
    const buying = shop.products.filter((p) => p.type === "Buying");
    const cats = [
      ...new Set(shop.products.map((p) => p.category).filter(Boolean)),
    ];

    return {
      sellingProducts: selling,
      buyingProducts: buying,
      categories: cats,
    };
  }, [shop?.products]);

  // Get products based on active tab
  const currentProducts =
    activeTab === "selling" ? sellingProducts : buyingProducts;

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...currentProducts];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (categoryFilter) {
      result = result.filter((p) => p.category === categoryFilter);
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-high":
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "name":
        result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        break;
      case "newest":
      default:
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    return result;
  }, [currentProducts, searchQuery, categoryFilter, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("");
    setSortBy("newest");
  };

  const hasActiveFilters = searchQuery || categoryFilter;

  // Handle selling to shop
  const handleSellClick = (product) => {
    setSelectedBuyingProduct(product);
    setSellForm({ quantity: 1, description: "", contactNumber: "" });
    setSellSuccess(false);
    setSellError(null);
    setIsSellModalOpen(true);
  };

  const handleSellSubmit = async () => {
    setSellSubmitting(true);
    setSellError(null);

    try {
      await api.post("/offers", {
        productId: selectedBuyingProduct.id,
        quantity: sellForm.quantity,
        contactNumber: sellForm.contactNumber,
        description: sellForm.description,
      });
      setSellSuccess(true);
    } catch (error) {
      setSellError(
        error.message || "Failed to submit offer. Please try again."
      );
    } finally {
      setSellSubmitting(false);
    }
  };

  const closeSellModal = () => {
    setIsSellModalOpen(false);
    setSelectedBuyingProduct(null);
    setSellSuccess(false);
    setSellError(null);
  };

  if (isLoading) {
    return <ShopDetailsSkeleton />;
  }

  if (isError || !shop) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Shop Not Found
          </h2>
          <p className="text-gray-500 mb-6">
            The shop you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium"
          >
            <ArrowLeft size={16} />
            Back to All Shops
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            to="/shop"
            className="inline-flex items-center text-sm text-gray-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to All Shops
          </Link>
        </div>

        {/* Shop Header */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Shop Logo */}
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 shrink-0 overflow-hidden">
              {shop.logo || shop.owner?.profilePic ? (
                <img
                  src={shop.logo || shop.owner?.profilePic}
                  alt={shop.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Store size={40} strokeWidth={1} />
              )}
            </div>

            {/* Shop Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {shop.name}
              </h1>
              {shop.description && (
                <p className="text-gray-600 mb-4">{shop.description}</p>
              )}

              {/* Rating */}
              <div className="flex items-center gap-1 text-[#FCD34D] mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={
                      i < Math.round(shop.averageRating || 0)
                        ? "currentColor"
                        : "none"
                    }
                    className={
                      i < Math.round(shop.averageRating || 0)
                        ? ""
                        : "text-gray-300"
                    }
                  />
                ))}
                <span className="text-gray-500 text-sm ml-2">
                  {shop.averageRating || 0} Rating ({shop.reviewCount || 0}{" "}
                  {shop.reviewCount === 1 ? "review" : "reviews"})
                </span>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                {shop.businessAddress && (
                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    <span>{shop.businessAddress}</span>
                  </div>
                )}
                {shop.owner?.businessName && (
                  <div className="flex items-center gap-1">
                    <span>By: {shop.owner.businessName}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Package size={14} />
                  <span>{sellingProducts.length} Selling</span>
                </div>
                <div className="flex items-center gap-1">
                  <ArrowRightLeft size={14} />
                  <span>{buyingProducts.length} Buying</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8 border-b border-gray-200 bg-white rounded-t-xl">
          <button
            onClick={() => setActiveTab("selling")}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-all ${
              activeTab === "selling"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
            }`}
          >
            <Tag size={18} />
            Products for Sale ({sellingProducts.length})
          </button>
          <button
            onClick={() => setActiveTab("buying")}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-all ${
              activeTab === "buying"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
            }`}
          >
            <ArrowRightLeft size={18} />
            Shop is Buying ({buyingProducts.length})
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder={
                  activeTab === "selling"
                    ? "Search products for sale..."
                    : "Search items shop wants to buy..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-gray-900"
              />
            </div>

            {/* Category Filter */}
            {categories.length > 0 && (
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
            )}

            {/* Sort */}
            <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </Select>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1 border border-indigo-200 rounded-lg hover:bg-indigo-50"
              >
                <X size={14} />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Tab Description */}
        {activeTab === "buying" && buyingProducts.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <p className="text-blue-800 text-sm">
              <strong>Want to sell to this shop?</strong> The items below are
              what {shop.name} is looking to buy. Click "Sell to Shop" to submit
              your offer!
            </p>
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const images = parseImages(product.images);
              return (
                <div
                  key={product.id}
                  className="border border-gray-200 rounded-lg overflow-hidden group bg-white hover:border-gray-300 transition-colors"
                >
                  {/* Product Image */}
                  <Link
                    to={`/products/${product.id}`}
                    className="block h-48 bg-gray-100 flex items-center justify-center overflow-hidden"
                  >
                    {images[0] ? (
                      <img
                        src={images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <span className="text-4xl">📦</span>
                    )}
                  </Link>

                  {/* Product Info */}
                  <div className="p-4">
                    <Link to={`/products/${product.id}`}>
                      <h3 className="font-bold text-gray-900 text-lg mb-1 leading-tight line-clamp-2 hover:text-indigo-600 transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-[#F59E0B] font-bold text-lg mb-2">
                      ₱{product.price?.toLocaleString()}
                      {activeTab === "buying" && (
                        <span className="text-sm font-normal">/unit</span>
                      )}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                      {product.category && (
                        <span className="bg-gray-100 px-2 py-0.5 rounded">
                          {product.category}
                        </span>
                      )}
                      {activeTab === "selling" &&
                        product.stock !== undefined && (
                          <span className="text-gray-500">
                            Stock: {product.stock}
                          </span>
                        )}
                    </div>

                    {/* Action Button */}
                    {activeTab === "selling" ? (
                      <Link
                        to={`/products/${product.id}`}
                        className="block w-full py-2 text-sm font-semibold rounded-lg bg-gray-50 text-gray-900 hover:bg-[#FCD34D] transition-colors text-center"
                      >
                        View Product
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleSellClick(product)}
                        className="w-full py-2 text-sm font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Send size={14} />
                        Sell to Shop
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white border border-gray-200 rounded-xl border-dashed">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg mb-2">
              {hasActiveFilters
                ? "No products match your search."
                : activeTab === "selling"
                ? "No products for sale yet."
                : "This shop is not buying any items currently."}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </main>

      {/* Sell to Shop Modal */}
      <Modal
        isOpen={isSellModalOpen}
        onClose={closeSellModal}
        title={sellSuccess ? "Offer Submitted!" : `Sell to ${shop?.name}`}
        actions={
          !sellSuccess && (
            <>
              <button
                onClick={closeSellModal}
                disabled={sellSubmitting}
                className="px-4 py-2 bg-white text-gray-700 font-bold rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSellSubmit}
                disabled={sellSubmitting || !sellForm.contactNumber}
                className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
              >
                {sellSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Submit Offer
                  </>
                )}
              </button>
            </>
          )
        }
      >
        {sellSuccess ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Offer Submitted Successfully!
            </h3>
            <p className="text-gray-500 mb-4">
              The shop owner will review your offer and contact you soon.
            </p>
            <button
              onClick={closeSellModal}
              className="px-6 py-2 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {sellError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {sellError}
              </div>
            )}

            {/* Product Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Selling:</p>
              <p className="font-bold text-gray-900">
                {selectedBuyingProduct?.name}
              </p>
              <p className="text-[#F59E0B] font-bold">
                Shop's buying price: ₱
                {selectedBuyingProduct?.price?.toLocaleString()}/unit
              </p>
            </div>

            {/* Quantity */}
            <div className="space-y-1">
              <label className="text-sm text-gray-700 font-medium">
                Quantity you want to sell
              </label>
              <input
                type="number"
                min="1"
                value={sellForm.quantity}
                onChange={(e) =>
                  setSellForm((prev) => ({
                    ...prev,
                    quantity: parseInt(e.target.value) || 1,
                  }))
                }
                className="w-full p-3 bg-white rounded-lg border border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-gray-900"
              />
            </div>

            {/* Estimated Total */}
            <div className="bg-indigo-50 p-4 rounded-lg">
              <p className="text-sm text-indigo-600 mb-1">Estimated Total:</p>
              <p className="text-2xl font-bold text-indigo-700">
                ₱
                {(
                  (selectedBuyingProduct?.price || 0) * sellForm.quantity
                ).toLocaleString()}
              </p>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-sm text-gray-700 font-medium">
                Description (optional)
              </label>
              <textarea
                rows={3}
                value={sellForm.description}
                onChange={(e) =>
                  setSellForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Describe the condition of your item..."
                className="w-full p-3 bg-white rounded-lg border border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-gray-900 resize-none"
              />
            </div>

            {/* Contact Number */}
            <div className="space-y-1">
              <label className="text-sm text-gray-700 font-medium">
                Your Contact Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={sellForm.contactNumber}
                onChange={(e) =>
                  setSellForm((prev) => ({
                    ...prev,
                    contactNumber: e.target.value,
                  }))
                }
                placeholder="09XX XXX XXXX"
                className="w-full p-3 bg-white rounded-lg border border-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-gray-900"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
