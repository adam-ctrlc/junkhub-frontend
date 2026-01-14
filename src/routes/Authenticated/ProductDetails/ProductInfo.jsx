import { Link } from "react-router-dom";
import {
  Star,
  ShoppingCart,
  Truck,
  ShieldCheck,
  Heart,
  Minus,
  Plus,
  Upload,
  PhilippinePeso,
} from "lucide-react";

export default function ProductInfo({
  displayData,
  isBuyingType,
  quantity,
  stock,
  onQuantityChange,
  onAddToCart,
  onBuyNow,
  onSellToShop,
  isInWishlist,
  onToggleWishlist,
}) {
  // Calculate average rating from reviews
  const reviews = displayData.reviews || [];
  const reviewCount = reviews.length;
  const averageRating =
    reviewCount > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(1)
      : "0.0";

  return (
    <div className="space-y-6">
      {/* Product type badge */}
      {isBuyingType && (
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
          <PhilippinePeso size={14} />
          We're Buying This Item
        </div>
      )}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-2">
          {displayData.title}
        </h1>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-yellow-500">
            <Star size={16} fill="currentColor" />
            <span className="font-bold text-gray-900">{averageRating}</span>
            <span className="text-gray-500 underline cursor-pointer hover:text-indigo-600">
              ({reviewCount} {reviewCount === 1 ? "Review" : "Reviews"})
            </span>
          </div>
          <span className="text-gray-300">|</span>
          <span className="text-gray-600">{displayData.category}</span>
        </div>
      </div>
      <div className="flex items-end gap-2">
        <h2 className="text-4xl font-bold text-[#F59E0B]">
          ₱{displayData.price.toLocaleString()}
        </h2>
        <span className="text-gray-500 mb-1">
          {isBuyingType ? "/ unit (buying price)" : "/ unit"}
        </span>
      </div>
      <p className="text-gray-600 leading-relaxed text-sm">
        {displayData.description}
      </p>
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <div className="text-gray-500">Category:</div>
          <div className="font-medium text-gray-900">
            {displayData.category}
          </div>
          <div className="text-gray-500">Shop:</div>
          <div className="font-medium text-gray-900">
            {displayData.shop.name}
          </div>
          <div className="text-gray-500">
            {isBuyingType ? "Looking for:" : "Availability:"}
          </div>
          <div className="font-medium text-green-600 flex items-center gap-1">
            <ShieldCheck size={14} />
            {isBuyingType
              ? `Accepting ${displayData.stock} units`
              : displayData.stock > 0
              ? `In Stock (${displayData.stock} available)`
              : "Out of Stock"}
          </div>
        </div>
      </div>
      <hr className="border-gray-100" />
      {/* Action Area - Different for Buying vs Selling type */}
      <div className="space-y-6">
        {isBuyingType ? (
          <>
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
              <h3 className="font-bold text-orange-900 mb-2 flex items-center gap-2">
                <PhilippinePeso size={18} />
                Sell Your Items to This Shop
              </h3>
              <p className="text-sm text-orange-700">
                This shop is looking to buy this type of item. If you have
                similar items to sell, submit an offer with photos of your
                items.
              </p>
            </div>

            <button
              onClick={onSellToShop}
              className="w-full bg-orange-500 text-white font-bold py-4 px-6 rounded-xl hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
            >
              <Upload size={20} />
              Sell to This Shop
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-6">
              <span className="text-sm font-semibold text-gray-900">
                Quantity
              </span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => onQuantityChange("decrease")}
                  className="p-2 hover:bg-gray-50 text-gray-600 disabled:opacity-50"
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <div className="w-12 text-center font-medium text-gray-900">
                  {quantity}
                </div>
                <button
                  onClick={() => onQuantityChange("increase")}
                  className="p-2 hover:bg-gray-50 text-gray-600 disabled:opacity-50"
                  disabled={quantity >= stock}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={onAddToCart}
                className="flex-1 bg-[#FCD34D] text-gray-900 font-bold py-3.5 px-6 rounded-xl hover:bg-[#FBBF24] transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>
              <button
                onClick={onBuyNow}
                className="flex-1 bg-gray-900 text-white font-bold py-3.5 px-6 rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                Buy Now
              </button>
              <button
                onClick={onToggleWishlist}
                className={`p-3.5 border rounded-xl transition-colors text-center ${
                  isInWishlist
                    ? "bg-red-50 border-red-200 text-red-500 hover:bg-red-100"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Heart
                  size={20}
                  fill={isInWishlist ? "currentColor" : "none"}
                />
              </button>
            </div>
          </>
        )}
      </div>
      <hr className="border-gray-100" />
      {/* Seller Info */}
      <div className="flex items-center gap-4">
        {displayData.shop.logo || displayData.shop.owner?.profilePic ? (
          <img
            src={displayData.shop.logo || displayData.shop.owner?.profilePic}
            alt={displayData.shop.name}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg">
            {displayData.shop.name?.substring(0, 2).toUpperCase() || "??"}
          </div>
        )}
        <div className="flex-1">
          <h4 className="font-bold text-gray-900">{displayData.shop.name}</h4>
          <p className="text-xs text-gray-500">
            {displayData.category} Products
          </p>
        </div>
        {displayData.shop.id && (
          <Link
            to={`/shop/${displayData.shop.id}`}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            View Shop
          </Link>
        )}
      </div>
    </div>
  );
}
