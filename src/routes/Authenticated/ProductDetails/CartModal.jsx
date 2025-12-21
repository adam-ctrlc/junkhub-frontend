import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

export default function CartModal({ isOpen, onClose, quantity, productTitle }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 scale-100 animate-in zoom-in-95 duration-200">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Added to Cart!
          </h3>
          <p className="text-gray-500 mb-6">
            You have added {quantity} unit(s) of "
            {productTitle.substring(0, 30)}..." to your cart.
          </p>

          <div className="flex flex-col gap-3">
            <Link
              to="/cart"
              className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors"
            >
              View Cart
            </Link>
            <button
              onClick={onClose}
              className="w-full bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
