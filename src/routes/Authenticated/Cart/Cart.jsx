import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../../lib/cart";
import { useState } from "react";
import api from "../../../lib/api";
import { CartSkeleton } from "../../../components/Skeletons";

export default function Cart() {
  const navigate = useNavigate();
  const {
    cart,
    isLoading,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
  } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);

  const shipping = subtotal > 5000 ? 0 : 15.0;
  const total = subtotal + shipping;

  // Parse image - handle string, array, or direct URL
  const parseImage = (image) => {
    if (!image) return null;
    if (typeof image === "string") {
      try {
        const parsed = JSON.parse(image);
        return Array.isArray(parsed) ? parsed[0] : image;
      } catch {
        return image;
      }
    }
    if (Array.isArray(image)) return image[0];
    return null;
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    setIsCheckingOut(true);
    setCheckoutError(null);

    try {
      await api.post("/orders", {
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        shippingAddress: "Default Address", // In a real app, collect from user
        shippingCity: "Default City",
        shippingZip: "00000",
      });

      clearCart();
      navigate("/profile"); // Navigate to orders page
    } catch (error) {
      setCheckoutError(
        error.message || "Failed to checkout. Please try again."
      );
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (isLoading) {
    return <CartSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items List */}
          <div className="flex-1 space-y-4">
            {cart.length > 0 ? (
              cart.map((item) => {
                const imageUrl = parseImage(item.image);
                return (
                  <div
                    key={item.productId}
                    className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-6"
                  >
                    {/* Image */}
                    <Link
                      to={`/products/${item.productId}`}
                      className="w-full sm:w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden"
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-4xl">📦</span>
                      )}
                    </Link>

                    {/* Details */}
                    <div className="flex-1 w-full text-center sm:text-left">
                      <Link
                        to={`/products/${item.productId}`}
                        className="font-bold text-gray-900 text-lg hover:text-indigo-600 transition-colors"
                      >
                        {item.name}
                      </Link>
                      <p className="text-sm text-gray-500 mb-2">
                        Sold by: {item.shopName}
                      </p>
                      <p className="font-bold text-gray-900">
                        ₱{item.price.toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity & Actions */}
                    <div className="flex items-center gap-6">
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.productId, -1)}
                          className="p-2 hover:bg-gray-50 text-gray-600 transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-12 text-center font-bold text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, 1)}
                          className="p-2 hover:bg-gray-50 text-gray-600 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-20 bg-white border border-gray-200 rounded-xl border-dashed">
                <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg mb-4">
                  Your cart is empty.
                </p>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Browse Products <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="w-full lg:w-96 flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.length} items)</span>
                  <span className="font-medium">₱{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `₱${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="border-t border-gray-100 pt-4 flex justify-between text-gray-900 font-bold text-lg">
                  <span>Total</span>
                  <span>₱{total.toFixed(2)}</span>
                </div>
              </div>

              {checkoutError && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
                  {checkoutError}
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={cart.length === 0 || isCheckingOut}
                className="w-full bg-[#FCD34D] text-gray-900 font-bold py-4 rounded-xl hover:bg-[#FBBF24] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCheckingOut ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Checkout <ArrowRight size={20} />
                  </>
                )}
              </button>

              {subtotal < 5000 && (
                <p className="text-xs text-gray-500 text-center mt-4">
                  Add ₱{(5000 - subtotal).toFixed(2)} more for free shipping!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
