import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Select from "../../../components/Select";
import Card from "../../../components/Card";
import { Filter, Search, X } from "lucide-react";
import { useProducts } from "../../../lib/hooks";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [filters, setFilters] = useState({
    category: "",
    type: "",
    search: initialSearch,
  });
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [sort, setSort] = useState("newest");

  // Update filters when URL changes
  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    if (urlSearch !== filters.search) {
      setFilters((prev) => ({ ...prev, search: urlSearch }));
      setSearchInput(urlSearch);
    }
  }, [searchParams]);

  const { products, isLoading, isError } = useProducts(filters);

  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = searchInput.trim();
    setFilters((prev) => ({ ...prev, search: trimmed }));
    if (trimmed) {
      setSearchParams({ search: trimmed });
    } else {
      setSearchParams({});
    }
  };

  const clearSearch = () => {
    setSearchInput("");
    setFilters((prev) => ({ ...prev, search: "" }));
    setSearchParams({});
  };

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    switch (sort) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "newest":
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  // Parse images safely
  const parseImages = (images) => {
    if (!images) return [];
    if (Array.isArray(images)) return images;
    if (typeof images === "string") {
      try {
        return JSON.parse(images);
      } catch {
        return [images];
      }
    }
    return [];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white font-sans">
        <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-[#FCD34D] rounded-full animate-spin"></div>
          </div>
        </main>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-white font-sans">
        <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <div className="text-center py-12 bg-red-50 rounded-xl border border-red-200">
            <p className="text-red-600">
              Failed to load products. Please try again.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            All Products
            {filters.search && (
              <span className="text-gray-500 font-normal text-lg ml-2">
                for "{filters.search}"
              </span>
            )}
          </h1>

          <div className="flex flex-wrap gap-4">
            {/* Search Form */}
            <form
              onSubmit={handleSearch}
              className="relative flex items-center"
            >
              <input
                type="text"
                placeholder="Search products..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-64 pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FCD34D] focus:ring-1 focus:ring-[#FCD34D] text-sm"
              />
              {searchInput ? (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              ) : (
                <Search size={16} className="absolute right-3 text-gray-400" />
              )}
            </form>

            <Select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="newest">Sort by: Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </Select>
          </div>
        </div>

        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedProducts.map((item) => {
              const images = parseImages(item.images);
              const inStock = item.stock > 0;

              return (
                <Link to={`/products/${item.id}`} key={item.id}>
                  <Card
                    image={
                      images[0] ? (
                        <img
                          src={images[0]}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-4xl">📦</span>
                      )
                    }
                    title={item.name}
                    badges={[
                      <span
                        key="price"
                        className="text-[#F59E0B] font-bold text-lg"
                      >
                        ₱{item.price.toFixed(2)}
                      </span>,
                      <span
                        key="stock"
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ml-2 ${
                          inStock
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {inStock ? "In Stock" : "Out of Stock"}
                      </span>,
                    ]}
                    details={[
                      { text: `Available Pieces: ${item.stock}` },
                      {
                        icon: (
                          <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
                        ),
                        text: item.shop?.name || "Unknown Shop",
                      },
                    ]}
                    actionButton={{ text: "View Details" }}
                    className="cursor-pointer"
                  />
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-gradient-to-b from-gray-50 to-white rounded-2xl border border-gray-200">
            {/* Illustration */}
            <div className="relative mx-auto w-32 h-32 mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-indigo-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-200 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-1 -left-3 w-4 h-4 bg-indigo-200 rounded-full animate-pulse delay-150"></div>
            </div>

            {/* Message */}
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {filters.search
                ? "Oops! No results found"
                : "No products available"}
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {filters.search
                ? `We couldn't find any products matching "${filters.search}". Try a different search term or check back later!`
                : "Products may be restocked soon. Check back later or explore our shops!"}
            </p>

            {/* Actions */}
            <div className="flex items-center justify-center gap-4">
              {filters.search && (
                <button
                  onClick={clearSearch}
                  className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Clear Search
                </button>
              )}
              <Link
                to="/shop"
                className="px-6 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Browse Shops
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
