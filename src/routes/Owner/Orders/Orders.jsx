import { useState } from "react";
import OrderDetailsModal from "../components/OrderDetailsModal";
import OfferManagementModal from "../components/OfferManagementModal";
import ConfirmDialog from "../components/ConfirmDialog";
import ChatSidebar from "../../../components/ChatSidebar";
import {
  Check,
  X,
  Package,
  User,
  Clock,
  Loader2,
  ShoppingBag,
  DollarSign,
  MessageCircle,
} from "lucide-react";
import {
  useOwnerOrders,
  useOwnerOffers,
  useOwnerChatMessages,
} from "../../../lib/hooks";
import { api } from "../../../lib/api";
import { formatDistanceToNow } from "date-fns";

export default function Orders() {
  const [activeTab, setActiveTab] = useState("orders");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Chat state
  const [chatOrderId, setChatOrderId] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [chatCustomerName, setChatCustomerName] = useState("");
  const { messages: chatMessages, mutate: mutateChatMessages } =
    useOwnerChatMessages(chatId);

  // Fetch real data
  const {
    orders,
    isLoading: ordersLoading,
    mutate: mutateOrders,
  } = useOwnerOrders();
  const {
    offers,
    isLoading: offersLoading,
    mutate: mutateOffers,
  } = useOwnerOffers();

  // Count new offers
  const newOffersCount = offers.filter((o) => o.status === "pending").length;

  // Modal Handlers
  const handleManageOrder = (order) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  const handleOfferClick = (offer) => {
    setSelectedOffer(offer);
    setIsOfferModalOpen(true);
  };

  const handleQuickAccept = (offer) => {
    setSelectedOffer(offer);
    setConfirmAction({ type: "accept", offer });
    setIsConfirmDialogOpen(true);
  };

  const handleQuickReject = (offer) => {
    setSelectedOffer(offer);
    setConfirmAction({ type: "reject", offer });
    setIsConfirmDialogOpen(true);
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setIsSubmitting(true);
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      mutateOrders();
      setIsOrderModalOpen(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error("Failed to update order:", error);
      alert(error.data?.error || "Failed to update order status");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAcceptOffer = async (offerId) => {
    setIsSubmitting(true);
    try {
      await api.put(`/offers/${offerId}/status`, { status: "accepted" });
      mutateOffers();
      setIsOfferModalOpen(false);
      setSelectedOffer(null);
    } catch (error) {
      console.error("Failed to accept offer:", error);
      alert(error.data?.error || "Failed to accept offer");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectOffer = async (offerId) => {
    setIsSubmitting(true);
    try {
      await api.put(`/offers/${offerId}/status`, { status: "rejected" });
      mutateOffers();
      setIsOfferModalOpen(false);
      setSelectedOffer(null);
    } catch (error) {
      console.error("Failed to reject offer:", error);
      alert(error.data?.error || "Failed to reject offer");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmAction = async () => {
    if (confirmAction?.type === "accept") {
      await handleAcceptOffer(confirmAction.offer.id);
    } else if (confirmAction?.type === "reject") {
      await handleRejectOffer(confirmAction.offer.id);
    } else if (confirmAction?.type === "revert") {
      // Revert offer to pending status
      setIsSubmitting(true);
      try {
        await api.put(`/offers/${confirmAction.offer.id}/status`, {
          status: "pending",
        });
        mutateOffers();
      } catch (error) {
        console.error("Failed to revert offer:", error);
        alert(error.data?.error || "Failed to revert offer");
      } finally {
        setIsSubmitting(false);
      }
    }
    setIsConfirmDialogOpen(false);
    setConfirmAction(null);
    setSelectedOffer(null);
  };

  const formatTime = (time) => {
    try {
      return formatDistanceToNow(new Date(time), { addSuffix: true });
    } catch {
      return "Recently";
    }
  };

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900">Orders & Offers</h1>
        <p className="text-gray-500 mb-8">
          Manage incoming orders and review sell-offers from users.
        </p>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors ${
              activeTab === "orders"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <ShoppingBag size={18} className="inline mr-2" />
            Customer Orders
          </button>
          <button
            onClick={() => setActiveTab("offers")}
            className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors ${
              activeTab === "offers"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <DollarSign size={18} className="inline mr-2" />
            User Sell-Offers
            {newOffersCount > 0 && (
              <span className="ml-2 bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs">
                {newOffersCount} New
              </span>
            )}
          </button>
        </div>

        {/* Loading State */}
        {(activeTab === "orders" ? ordersLoading : offersLoading) && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-indigo-600" size={40} />
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {activeTab === "orders" ? (
            <>
              {!ordersLoading && orders.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <Package size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="font-semibold">No orders yet</p>
                  <p className="text-sm mt-1">
                    Orders from customers will appear here
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Items
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {orders.map((order) => (
                        <tr
                          key={order.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            #{order.id?.slice(-8)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600">
                                <User size={12} />
                              </div>
                              {order.user?.firstName} {order.user?.lastName}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {order.items?.length || 0} item(s)
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-gray-900">
                            ₱{order.total?.toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${
                                order.status === "delivered"
                                  ? "bg-green-100 text-green-700"
                                  : order.status === "pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : order.status === "processing"
                                  ? "bg-blue-100 text-blue-700"
                                  : order.status === "shipped"
                                  ? "bg-indigo-100 text-indigo-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {order.status?.charAt(0).toUpperCase() +
                                order.status?.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={async () => {
                                  try {
                                    const response = await api.get(
                                      `/owner/chats/order/${order.id}`
                                    );
                                    setChatId(response.chat?.id);
                                    setChatOrderId(order.id);
                                    setChatCustomerName(
                                      `${order.user?.firstName} ${order.user?.lastName}`
                                    );
                                  } catch (error) {
                                    console.error(
                                      "Failed to open chat:",
                                      error
                                    );
                                  }
                                }}
                                className="text-indigo-600 hover:text-indigo-900 font-medium text-sm flex items-center gap-1"
                                title="Chat with customer"
                              >
                                <MessageCircle size={14} />
                                Chat
                              </button>
                              <button
                                onClick={() => handleManageOrder(order)}
                                className="text-indigo-600 hover:text-indigo-900 font-medium text-sm"
                              >
                                Manage
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          ) : (
            <>
              {!offersLoading && offers.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <DollarSign size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="font-semibold">No offers yet</p>
                  <p className="text-sm mt-1">
                    User sell offers will appear here
                  </p>
                </div>
              ) : (
                <div className="p-6 grid grid-cols-1 gap-4">
                  {offers.map((offer) => {
                    const productImages = parseImages(offer.product?.images);
                    const offerImages = parseImages(offer.images);
                    return (
                      <div
                        key={offer.id}
                        onClick={() => handleOfferClick(offer)}
                        className="p-4 rounded-xl border border-gray-100 hover:border-indigo-200 transition-all bg-white cursor-pointer"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                              {productImages[0] ? (
                                <img
                                  src={productImages[0]}
                                  alt={offer.product?.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Package size={24} className="text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-gray-900 truncate">
                                {offer.product?.name || "Unknown Product"}
                              </h3>
                              <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                <span className="flex items-center gap-1">
                                  <User size={14} />
                                  {offer.user?.firstName} {offer.user?.lastName}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock size={14} />
                                  {formatTime(offer.createdAt)}
                                </span>
                              </div>
                              {offer.description && (
                                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                  {offer.description}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-lg font-bold text-indigo-600">
                                Qty: {offer.quantity}
                              </p>
                              <p className="text-xs text-gray-500">
                                @ ₱{offer.product?.price?.toLocaleString()}/unit
                              </p>
                              <p className="text-sm font-semibold text-orange-600 mt-1">
                                ₱
                                {(
                                  (offer.product?.price || 0) * offer.quantity
                                ).toLocaleString()}
                              </p>
                            </div>
                            {offer.status === "pending" ? (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleQuickAccept(offer);
                                  }}
                                  className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                                  title="Accept"
                                >
                                  <Check size={20} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleQuickReject(offer);
                                  }}
                                  className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                                  title="Reject"
                                >
                                  <X size={20} />
                                </button>
                              </div>
                            ) : (
                              <div className="flex flex-col items-end gap-2">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                                    offer.status === "accepted"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {offer.status?.charAt(0).toUpperCase() +
                                    offer.status?.slice(1)}
                                </span>
                                {/* Allow status change on processed offers */}
                                <div className="flex gap-1">
                                  {offer.status !== "pending" && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setConfirmAction({
                                          type: "revert",
                                          offer,
                                          newStatus: "pending",
                                        });
                                        setIsConfirmDialogOpen(true);
                                      }}
                                      className="text-xs text-gray-500 hover:text-indigo-600 underline"
                                    >
                                      Revert
                                    </button>
                                  )}
                                  {offer.status === "rejected" && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleQuickAccept(offer);
                                      }}
                                      className="text-xs text-green-600 hover:text-green-700 underline ml-2"
                                    >
                                      Accept
                                    </button>
                                  )}
                                  {offer.status === "accepted" && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleQuickReject(offer);
                                      }}
                                      className="text-xs text-red-600 hover:text-red-700 underline ml-2"
                                    >
                                      Reject
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Offer Images Preview */}
                        {offerImages.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="flex items-center gap-2">
                              {offerImages.slice(0, 3).map((img, idx) => (
                                <div
                                  key={idx}
                                  className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0"
                                >
                                  <img
                                    src={img}
                                    alt={`Proof ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ))}
                              {offerImages.length > 3 && (
                                <span className="text-xs text-gray-500">
                                  +{offerImages.length - 3} more
                                </span>
                              )}
                              <span className="text-xs text-gray-400 ml-auto">
                                Click to view details
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Modals */}
      <OrderDetailsModal
        isOpen={isOrderModalOpen}
        onClose={() => {
          setIsOrderModalOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
        onUpdateStatus={handleUpdateOrderStatus}
        isLoading={isSubmitting}
      />

      <OfferManagementModal
        isOpen={isOfferModalOpen}
        onClose={() => {
          setIsOfferModalOpen(false);
          setSelectedOffer(null);
        }}
        offer={selectedOffer}
        onAccept={(offerId) => handleAcceptOffer(offerId)}
        onReject={(offerId) => handleRejectOffer(offerId)}
      />

      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => {
          setIsConfirmDialogOpen(false);
          setConfirmAction(null);
          setSelectedOffer(null);
        }}
        onConfirm={handleConfirmAction}
        title={
          confirmAction?.type === "accept"
            ? "Accept Offer"
            : confirmAction?.type === "revert"
            ? "Revert to Pending"
            : "Reject Offer"
        }
        message={
          confirmAction?.type === "accept"
            ? `Are you sure you want to accept the offer for "${confirmAction?.offer?.product?.name}"?`
            : confirmAction?.type === "revert"
            ? `Are you sure you want to revert this offer back to pending? The seller will need to be contacted again.`
            : `Are you sure you want to reject the offer for "${confirmAction?.offer?.product?.name}"?`
        }
        confirmText={
          confirmAction?.type === "accept"
            ? "Accept"
            : confirmAction?.type === "revert"
            ? "Revert"
            : "Reject"
        }
        cancelText="Cancel"
        variant={
          confirmAction?.type === "accept"
            ? "success"
            : confirmAction?.type === "revert"
            ? "warning"
            : "danger"
        }
      />

      {/* Chat Sidebar */}
      <ChatSidebar
        isOpen={!!chatOrderId}
        onClose={() => {
          setChatOrderId(null);
          setChatId(null);
          setChatCustomerName("");
        }}
        chatId={chatId}
        orderId={chatOrderId}
        recipientName={chatCustomerName || "Customer"}
        isOwner={true}
        messagesData={chatMessages}
        mutateMessages={mutateChatMessages}
      />
    </div>
  );
}
