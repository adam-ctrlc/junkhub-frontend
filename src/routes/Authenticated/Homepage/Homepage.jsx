import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  ArrowRight,
  Package,
  Store,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  useProducts,
  useShops,
  useBestSellers,
  useCategories,
} from "../../../lib/hooks";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
// Import shared components
import Card from "../../../components/Card";

// Shop Card for Carousel
function ShopSlide({ shop }) {
  // Reduced height from 400px to 250px, removed shadows
  return (
    <Link
      to={`/shop/${shop.id}`}
      className="relative w-full h-[250px] rounded-xl overflow-hidden group block"
    >
      {shop.logo ? (
        <img
          src={shop.logo}
          alt={shop.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-yellow-200 to-yellow-500 flex items-center justify-center">
          <span className="text-4xl font-bold text-gray-800">{shop.name}</span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <div className="flex items-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              size={14}
              fill="currentColor"
              className="text-yellow-400"
            />
          ))}
        </div>
        <h3 className="text-2xl font-bold mb-1">{shop.name}</h3>
        <p className="text-sm text-gray-200">
          {shop.businessAddress?.split(",")[0] || "Visit our shop"}
        </p>
      </div>
    </Link>
  );
}

// Section Header
function SectionHeader({ title, viewAllLink, count }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-bold text-gray-900">
        {title}
        {count !== undefined && (
          <span className="text-sm font-normal text-gray-500 ml-2">
            ({count})
          </span>
        )}
      </h2>
      {viewAllLink && (
        <Link
          to={viewAllLink}
          className="flex items-center gap-1 text-sm font-medium text-yellow-600 hover:text-yellow-700"
        >
          View All
          <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
}

// Loading Skeleton
function ProductSkeleton() {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white animate-pulse">
      <div className="aspect-square bg-gray-200" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-5 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-1/3 mt-2" />
      </div>
    </div>
  );
}

export default function Homepage() {
  const {
    products,
    isLoading: productsLoading,
    total,
  } = useProducts({ limit: 50 });
  const { shops, isLoading: shopsLoading } = useShops();
  const { products: bestSellers, isLoading: bestSellersLoading } =
    useBestSellers(8);
  const { categories, isLoading: categoriesLoading } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Featured shops (first 5)
  const featuredShops = shops.slice(0, 5);

  // Products by category
  const categoryProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-12">
        {/* Featured Shops Carousel */}
        <section>
          {/* Fixed link to /shop */}
          <SectionHeader title="Featured Shops" viewAllLink="/shop" />
          <div className="relative">
            {shopsLoading ? (
              <div className="w-full h-[250px] bg-gray-200 rounded-xl animate-pulse" />
            ) : featuredShops.length > 0 ? (
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={0}
                slidesPerView={1}
                navigation={{
                  prevEl: ".swiper-prev",
                  nextEl: ".swiper-next",
                }}
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                className="rounded-xl overflow-hidden"
              >
                {featuredShops.map((shop) => (
                  <SwiperSlide key={shop.id}>
                    <ShopSlide shop={shop} />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="w-full h-[250px] bg-gray-100 rounded-xl flex items-center justify-center">
                <p className="text-gray-500">No shops available</p>
              </div>
            )}
            {/* Custom Navigation Buttons - Removed Shadows */}
            <button className="swiper-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full border border-gray-200 flex items-center justify-center text-gray-800 transition-all">
              <ChevronLeft size={20} />
            </button>
            <button className="swiper-next absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full border border-gray-200 flex items-center justify-center text-gray-800 transition-all">
              <ChevronRight size={20} />
            </button>
          </div>
        </section>

        {/* Best Sellers */}
        {!bestSellersLoading && bestSellers.length > 0 && (
          <section>
            <SectionHeader title="Best Sellers" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {bestSellers.map((product) => {
                const images = product.images
                  ? typeof product.images === "string"
                    ? JSON.parse(product.images)
                    : product.images
                  : [];
                return (
                  <Link key={product.id} to={`/products/${product.id}`}>
                    <Card
                      image={
                        images[0] ? (
                          <img
                            src={images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package size={32} />
                        )
                      }
                      title={product.name}
                      subtitle={
                        <span className="text-yellow-600 font-bold">
                          ₱{product.price?.toFixed(2)}
                        </span>
                      }
                      details={[
                        {
                          icon: <Store size={14} />,
                          text: product.shop?.name || "Shop",
                        },
                      ]}
                      badges={
                        product.type === "Buying"
                          ? [
                              <span className="bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                                Buying
                              </span>,
                            ]
                          : []
                      }
                      className="h-full hover:border-yellow-400 transition-colors"
                    />
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Categories */}
        {!categoriesLoading && categories.length > 0 && (
          <section>
            <SectionHeader title="Browse by Category" />
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  !selectedCategory
                    ? "bg-yellow-500 text-white"
                    : "bg-white border border-gray-200 text-gray-700 hover:border-yellow-500"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === cat.name
                      ? "bg-yellow-500 text-white"
                      : "bg-white border border-gray-200 text-gray-700 hover:border-yellow-500"
                  }`}
                >
                  {cat.name} ({cat.count})
                </button>
              ))}
            </div>
            {selectedCategory && categoryProducts.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {categoryProducts.slice(0, 10).map((product) => {
                  const images = product.images
                    ? typeof product.images === "string"
                      ? JSON.parse(product.images)
                      : product.images
                    : [];
                  return (
                    <Link key={product.id} to={`/products/${product.id}`}>
                      <Card
                        image={
                          images[0] ? (
                            <img
                              src={images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package size={32} />
                          )
                        }
                        title={product.name}
                        subtitle={
                          <span className="text-yellow-600 font-bold">
                            ₱{product.price?.toFixed(2)}
                          </span>
                        }
                        details={[
                          {
                            icon: <Store size={14} />,
                            text: product.shop?.name || "Shop",
                          },
                        ]}
                        badges={
                          product.type === "Buying"
                            ? [
                                <span className="bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                                  Buying
                                </span>,
                              ]
                            : []
                        }
                        className="h-full hover:border-yellow-400 transition-colors"
                      />
                    </Link>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* All Products */}
        <section>
          {/* Custom products count and fixed view all link */}
          <SectionHeader
            title="Latest Products"
            count={total}
            viewAllLink="/products"
          />
          {productsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array(10)
                .fill(0)
                .map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {products.map((product) => {
                const images = product.images
                  ? typeof product.images === "string"
                    ? JSON.parse(product.images)
                    : product.images
                  : [];
                return (
                  <Link key={product.id} to={`/products/${product.id}`}>
                    <Card
                      image={
                        images[0] ? (
                          <img
                            src={images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package size={32} />
                        )
                      }
                      title={product.name}
                      subtitle={
                        <span className="text-yellow-600 font-bold">
                          ₱{product.price?.toFixed(2)}
                        </span>
                      }
                      details={[
                        {
                          icon: <Store size={14} />,
                          text: product.shop?.name || "Shop",
                        },
                      ]}
                      badges={
                        product.type === "Buying"
                          ? [
                              <span className="bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                                Buying
                              </span>,
                            ]
                          : []
                      }
                      className="h-full hover:border-yellow-400 transition-colors"
                    />
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
              <Package size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No products available yet.</p>
            </div>
          )}
        </section>

        {/* Shops Grid */}
        <section>
          {/* Fixed shop link */}
          <SectionHeader title="Popular Shops" viewAllLink="/shop" />
          {shopsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="border border-gray-200 rounded-xl overflow-hidden bg-white animate-pulse"
                  >
                    <div className="h-48 bg-gray-200" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
                      <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto" />
                    </div>
                  </div>
                ))}
            </div>
          ) : shops.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {shops.slice(0, 8).map((shop) => (
                <Link to={`/shop/${shop.id}`} key={shop.id}>
                  <Card
                    image={
                      shop.logo ? (
                        <img
                          src={shop.logo}
                          alt={shop.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-400 text-lg font-bold">
                          {shop.name?.[0]}
                        </span>
                      )
                    }
                    title={shop.name}
                    details={[
                      shop.businessAddress?.split(",")[0] || "Location",
                    ]}
                    badges={[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} size={12} fill="currentColor" />
                    ))}
                    className="h-full hover:border-yellow-400 transition-colors"
                  />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
              <p className="text-gray-500">No shops available yet.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
