import { X, Loader2, CheckCircle } from "lucide-react";

export default function BuyNowModal({
  isOpen,
  onClose,
  displayData,
  quantity,
  orderSuccess,
  orderError,
  isProcessing,
  onConfirmPurchase,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 scale-100 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
          <h3 className="text-xl font-bold text-gray-900">
            Checkout Confirmation
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={displayData.images[0]}
              className="w-full h-full object-cover"
              alt={displayData.title}
            />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 line-clamp-2 text-sm mb-1">
              {displayData.title}
            </h4>
            <p className="text-sm text-gray-500">Quantity: {quantity}</p>
            <p className="text-[#F59E0B] font-bold">
              Total: ₱{(displayData.price * quantity).toLocaleString()}
            </p>
          </div>
        </div>

        {orderSuccess ? (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Order Placed Successfully!
            </h3>
            <p className="text-gray-500">Redirecting to your profile...</p>
          </div>
        ) : (
          <>
            <div className="bg-gray-50 p-4 rounded-xl mb-6 text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium text-gray-900">
                  ₱{(displayData.price * quantity).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping Fee</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="border-t border-gray-200 my-2 pt-2 flex justify-between text-base font-bold">
                <span className="text-gray-900">Total Payment</span>
                <span className="text-[#F59E0B]">
                  ₱{(displayData.price * quantity).toLocaleString()}
                </span>
              </div>
            </div>

            {orderError && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
                {orderError}
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={onClose}
                disabled={isProcessing}
                className="flex-1 bg-white border border-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={onConfirmPurchase}
                disabled={isProcessing}
                className="flex-1 bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Confirm Purchase"
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
