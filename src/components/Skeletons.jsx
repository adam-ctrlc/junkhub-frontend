/**
 * Skeleton Loading Components
 * Reusable skeleton loaders for various page layouts
 */

// Base skeleton pulse animation classes
const skeletonBase = "bg-gray-200 animate-pulse rounded";

// Skeleton block - basic building block
export function Skeleton({ className = "" }) {
  return <div className={`${skeletonBase} ${className}`} />;
}

// Card Skeleton - for product/shop cards
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <Skeleton className="w-full h-48" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="w-4 h-4 rounded-full" />
          ))}
        </div>
        <Skeleton className="h-8 w-full rounded-lg" />
      </div>
    </div>
  );
}

// Product Grid Skeleton
export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(count)].map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

// Shop Grid Skeleton
export function ShopGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-gray-100 overflow-hidden text-center"
        >
          <div className="p-6">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
              <Skeleton className="w-full h-full rounded-full" />
            </div>
            <div className="flex justify-center gap-1 mb-3">
              {[...Array(5)].map((_, j) => (
                <Skeleton key={j} className="w-4 h-4 rounded-full" />
              ))}
            </div>
            <Skeleton className="h-5 w-3/4 mx-auto mb-2" />
            <Skeleton className="h-3 w-1/2 mx-auto mb-4" />
            <Skeleton className="h-3 w-1/3 mx-auto mb-4" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Product Details Skeleton
export function ProductDetailsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      {/* Breadcrumb */}
      <Skeleton className="h-4 w-32 mb-6" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left - Images */}
        <div className="space-y-4">
          <Skeleton className="w-full aspect-square rounded-2xl" />
          <div className="flex gap-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="w-20 h-20 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Right - Info */}
        <div className="space-y-6">
          <Skeleton className="h-8 w-3/4" />
          <div className="flex gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-10 w-32" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <Skeleton className="h-32 w-full rounded-xl" />
          <div className="flex gap-4">
            <Skeleton className="h-12 flex-1 rounded-xl" />
            <Skeleton className="h-12 flex-1 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Reviews section */}
      <div className="mt-12">
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    </div>
  );
}

// Shop Details Skeleton
export function ShopDetailsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      {/* Breadcrumb */}
      <Skeleton className="h-4 w-32 mb-6" />

      {/* Shop Header */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          <Skeleton className="w-32 h-32 rounded-full mx-auto md:mx-0" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
            <div className="flex gap-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-24" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <Skeleton className="h-6 w-32 mb-6" />
      <ProductGridSkeleton count={8} />
    </div>
  );
}

// Cart Skeleton
export function CartSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Skeleton className="h-8 w-48 mb-8" />
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-100 p-4 flex gap-4"
          >
            <Skeleton className="w-24 h-24 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/3" />
            </div>
            <Skeleton className="w-24 h-10 rounded-lg" />
          </div>
        ))}
      </div>
      <div className="mt-8 bg-gray-50 rounded-xl p-6">
        <Skeleton className="h-6 w-32 mb-4" />
        <Skeleton className="h-4 w-48 mb-2" />
        <Skeleton className="h-4 w-40 mb-4" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </div>
  );
}

// Profile/Account Skeleton
export function ProfileSkeleton() {
  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <div className="w-full md:w-64 space-y-2">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-xl" />
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white rounded-2xl border border-gray-100 p-6">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="flex gap-6 mb-8">
          <Skeleton className="w-32 h-32 rounded-full" />
          <div className="flex-1 space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Homepage Skeleton
export function HomepageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      {/* Hero Carousel */}
      <Skeleton className="h-64 md:h-80 w-full rounded-2xl mb-12" />

      {/* Section */}
      <div className="mb-12">
        <Skeleton className="h-6 w-48 mb-6" />
        <ProductGridSkeleton count={4} />
      </div>

      {/* Categories */}
      <div className="mb-12">
        <Skeleton className="h-6 w-32 mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="text-center">
              <Skeleton className="w-16 h-16 rounded-full mx-auto mb-2" />
              <Skeleton className="h-4 w-20 mx-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* Products Section */}
      <div className="mb-12">
        <Skeleton className="h-6 w-40 mb-6" />
        <ProductGridSkeleton count={8} />
      </div>

      {/* Popular Shops */}
      <div>
        <Skeleton className="h-6 w-36 mb-6" />
        <ShopGridSkeleton count={3} />
      </div>
    </div>
  );
}

// Account Settings Skeleton
export function AccountSettingsSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <Skeleton className="h-8 w-48 mb-8" />

      <div className="flex flex-col md:flex-row gap-8 mb-8">
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-3">
          <Skeleton className="w-32 h-32 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>

        {/* Form Fields */}
        <div className="flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
        </div>
      </div>

      <Skeleton className="h-px w-full my-8" />

      <div className="space-y-6">
        <Skeleton className="h-6 w-32" />
        <div className="flex justify-between items-center p-4 border border-gray-100 rounded-lg">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-32 rounded-lg" />
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-8">
        <Skeleton className="h-10 w-24 rounded-lg" />
        <Skeleton className="h-10 w-24 rounded-lg" />
      </div>
    </div>
  );
}

// Order History Skeleton
export function OrderHistorySkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-4 mb-6">
        <Skeleton className="h-10 w-24 rounded-lg" />
        <Skeleton className="h-10 w-24 rounded-lg" />
      </div>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="w-16 h-16 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Wishlist Skeleton
export function WishlistSkeleton() {
  return (
    <div>
      <div className="flex justify-between mb-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
