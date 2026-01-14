import { Link } from "react-router-dom";
import { Star, MapPin, Store } from "lucide-react";
import { useShops } from "../../../lib/hooks";
import Select from "../../../components/Select";
import { ShopGridSkeleton } from "../../../components/Skeletons";

export default function Shop() {
  const { shops, isLoading, isError } = useShops();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white font-sans">
        <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="h-8 w-48 bg-gray-200 animate-pulse rounded" />
            <div className="h-10 w-48 bg-gray-200 animate-pulse rounded-lg" />
          </div>
          <ShopGridSkeleton count={6} />
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
              Failed to load shops. Please try again.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">All Shops</h1>
          <Select>
            <option>Sort by: Recommended</option>
            <option>Rating: High to Low</option>
            <option>Newest</option>
          </Select>
        </div>

        {shops.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {shops.map((shop) => (
              <Link
                key={shop.id}
                to={`/shop/${shop.id}`}
                className="border border-gray-200 rounded-lg overflow-hidden group bg-white hover:border-gray-300 transition-colors"
              >
                {/* Shop Logo/Image */}
                <div className="h-48 bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center text-emerald-600 group-hover:from-emerald-100 group-hover:to-emerald-200 transition-colors">
                  {shop.logo || shop.owner?.profilePic ? (
                    <img
                      src={shop.logo || shop.owner?.profilePic}
                      alt={shop.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Store size={64} strokeWidth={1} />
                  )}
                </div>

                {/* Content */}
                <div className="p-4 text-center">
                  {/* Rating */}
                  <div className="flex justify-center items-center gap-1 text-[#FCD34D] mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
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
                    <span className="text-xs text-gray-500 ml-1">
                      ({shop.reviewCount || 0})
                    </span>
                  </div>

                  {/* Shop Name */}
                  <h3 className="font-bold text-gray-900 text-lg mb-1 leading-tight">
                    {shop.name}
                  </h3>

                  {/* Location */}
                  {shop.businessAddress && (
                    <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500 mb-4">
                      <MapPin size={12} />
                      <span className="line-clamp-1">
                        {shop.businessAddress}
                      </span>
                    </div>
                  )}

                  {/* Products Count */}
                  <div className="text-xs text-gray-500 mb-4">
                    {shop._count?.products || 0} Products
                  </div>

                  {/* Action Button */}
                  <div className="w-full py-2 text-sm font-semibold rounded-lg bg-gray-50 text-gray-900 group-hover:bg-[#FCD34D] transition-colors">
                    Visit Shop
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <Store size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No shops available yet.</p>
          </div>
        )}
      </main>
    </div>
  );
}
