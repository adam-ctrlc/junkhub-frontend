import Modal from "./Modal";
import {
  User,
  Package,
  PhilippinePeso,
  Calendar,
  MessageSquare,
  Phone,
  Camera,
  Check,
  X,
} from "lucide-react";
import { useState } from "react";

export default function OfferManagementModal({
  isOpen,
  onClose,
  offer,
  onAccept,
  onReject,
  isLoading = false,
}) {
  const [message, setMessage] = useState("");

  if (!offer) return null;

  // Parse images from JSON string or array
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

  const productImages = parseImages(offer.product?.images);
  const offerImages = parseImages(offer.images);

  const handleAccept = () => {
    if (onAccept) {
      onAccept(offer.id, message);
    }
  };

  const handleReject = () => {
    if (onReject) {
      onReject(offer.id, message);
    }
  };

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "N/A";
    }
  };

  const estimatedValue = (offer.product?.price || 0) * offer.quantity;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Offer Details" size="lg">
      <div className="space-y-6">
        {/* Offer Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-xl font-bold text-gray-900">
                Sell Offer #{offer.id?.slice(-8)}
              </h3>
              <span
                className={`px-2.5 py-0.5 text-xs font-semibold rounded-full capitalize ${
                  offer.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : offer.status === "accepted"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {offer.status}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar size={14} />
              <span>Received {formatDate(offer.createdAt)}</span>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <div className="text-sm text-gray-500">Estimated Value</div>
            <div className="text-2xl font-bold text-orange-600">
              ₱{estimatedValue.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Seller Information */}
          <div>
            <div className="flex items-center gap-2 mb-3 text-gray-900 font-semibold">
              <User size={18} className="text-gray-400" />
              Seller Details
            </div>
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                  {offer.user?.firstName?.[0]}
                  {offer.user?.lastName?.[0]}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {offer.user?.firstName} {offer.user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{offer.user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone size={14} className="text-gray-400" />
                <span className="font-medium text-gray-900">
                  {offer.contactNumber}
                </span>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div>
            <div className="flex items-center gap-2 mb-3 text-gray-900 font-semibold">
              <Package size={18} className="text-gray-400" />
              Product Information
            </div>
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                  {productImages[0] ? (
                    <img
                      src={productImages[0]}
                      alt={offer.product?.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package size={20} className="text-gray-400" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {offer.product?.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {offer.quantity} units @ ₱
                    {offer.product?.price?.toLocaleString()}/unit
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {offer.description && (
          <div>
            <div className="flex items-center gap-2 mb-3 text-gray-900 font-semibold">
              <MessageSquare size={18} className="text-gray-400" />
              Seller's Description
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-gray-700 text-sm">{offer.description}</p>
            </div>
          </div>
        )}

        {/* Offer Images (Proof Photos) */}
        {offerImages.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3 text-gray-900 font-semibold">
              <Camera size={18} className="text-gray-400" />
              Seller's Photos ({offerImages.length})
            </div>
            <div className="grid grid-cols-3 gap-3">
              {offerImages.map((img, idx) => (
                <div
                  key={idx}
                  className="aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-100"
                >
                  <img
                    src={img}
                    alt={`Proof ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Response Message */}
        {offer.status === "pending" && (
          <div>
            <div className="flex items-center gap-2 mb-3 text-gray-900 font-semibold">
              <MessageSquare size={18} className="text-gray-400" />
              Response Message (Optional)
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={2}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all resize-none text-sm"
              placeholder="Add a note to the seller..."
            />
          </div>
        )}

        {/* Actions */}
        {offer.status === "pending" && (
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <button
              onClick={handleReject}
              disabled={isLoading}
              className="px-6 py-3 text-sm font-bold text-red-600 bg-white border border-red-200 hover:bg-red-50 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <X size={18} />
              {isLoading ? "Processing..." : "Reject Offer"}
            </button>
            <button
              onClick={handleAccept}
              disabled={isLoading}
              className="px-6 py-3 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Check size={18} />
              {isLoading ? "Processing..." : "Accept Offer"}
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
