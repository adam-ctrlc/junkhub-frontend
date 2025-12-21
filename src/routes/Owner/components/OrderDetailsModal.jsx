import Modal from "./Modal";
import { useState, useEffect } from "react";
import {
  Package,
  User,
  CreditCard,
  MapPin,
  Calendar,
  CheckCircle,
  Clock,
  X,
  Save,
  Loader2,
} from "lucide-react";
import Select from "../../../components/Select";

export default function OrderDetailsModal({
  isOpen,
  onClose,
  order,
  onUpdateStatus,
  isLoading = false,
}) {
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    if (order) {
      setSelectedStatus(order.status || "pending");
    }
  }, [order]);

  if (!order) return null;

  // Status Badge Styles
  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    processing: "bg-blue-50 text-blue-700 border border-blue-100",
    shipped: "bg-indigo-50 text-indigo-700 border border-indigo-100",
    delivered: "bg-green-50 text-green-700 border border-green-100",
    cancelled: "bg-red-50 text-red-700 border border-red-100",
  };

  const handleSave = () => {
    if (onUpdateStatus && selectedStatus !== order.status) {
      onUpdateStatus(order.id, selectedStatus);
    }
  };

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  // Get customer info from populated data
  const customer = order.user || {};
  const customerName = customer.firstName
    ? `${customer.firstName} ${customer.lastName || ""}`
    : "Unknown Customer";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Order Details" size="lg">
      <div className="space-y-8">
        {/* Order Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-xl font-bold text-gray-900">
                Order #{order.id?.slice(-8)}
              </h3>
              <span
                className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                  statusStyles[order.status] || statusStyles.pending
                }`}
              >
                {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar size={14} />
              <span>Placed on {formatDate(order.createdAt)}</span>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <div className="text-sm text-gray-500">Total Amount</div>
            <div className="text-2xl font-bold text-gray-900">
              ₱{order.total?.toLocaleString() || "0"}
            </div>
          </div>
        </div>

        {/* Customer & Delivery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Customer Info */}
          <div>
            <div className="flex items-center gap-2 mb-4 text-gray-900 font-semibold">
              <User size={18} className="text-gray-400" />
              Customer Details
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-3">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                  Name
                </p>
                <p className="font-medium text-gray-900">{customerName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                  Email
                </p>
                <p className="font-medium text-gray-900">
                  {customer.email || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Delivery */}
          <div>
            <div className="flex items-center gap-2 mb-4 text-gray-900 font-semibold">
              <MapPin size={18} className="text-gray-400" />
              Delivery Address
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-4">
              <p className="font-medium text-gray-900 leading-relaxed">
                {order.shippingAddress}
                {order.shippingCity && `, ${order.shippingCity}`}
                {order.shippingZip && ` ${order.shippingZip}`}
              </p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div>
          <div className="flex items-center gap-2 mb-4 text-gray-900 font-semibold">
            <Package size={18} className="text-gray-400" />
            Items Ordered
          </div>
          <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-100">
            {order.items && order.items.length > 0 ? (
              order.items.map((item, index) => (
                <div
                  key={item.id || index}
                  className="flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      {item.product?.images?.[0] ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package size={20} className="text-gray-400" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {item.product?.name || "Unknown Product"}
                      </div>
                      <div className="text-xs text-gray-500">
                        Qty: {item.quantity} × ₱{item.price}
                      </div>
                    </div>
                  </div>
                  <div className="font-semibold text-gray-900">
                    ₱{(item.quantity * item.price).toLocaleString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                No items available
              </div>
            )}
          </div>
        </div>

        {/* Status Update */}
        <div className="pt-6 border-t border-gray-100 mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Update Order Status
          </label>
          <div className="flex gap-3">
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              containerClassName="flex-1"
              className="w-full"
              disabled={isLoading}
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </Select>
            <button
              onClick={handleSave}
              disabled={isLoading || selectedStatus === order.status}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              Save
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
