import { useState, useRef } from "react";
import Modal from "../../components/Modal";
import {
  useOrders,
  useUserOffers,
  useChatByOrder,
  useChatMessages,
} from "../../../../lib/hooks";
import api from "../../../../lib/api";
import {
  Loader2,
  Package,
  PhilippinePeso,
  Clock,
  CheckCircle,
  XCircle,
  MessageCircle,
  FileText,
  Download,
  Printer,
  CheckCircle2,
} from "lucide-react";
import ChatSidebar from "../../../../components/ChatSidebar";

export default function OrderHistory() {
  const {
    orders,
    isLoading: ordersLoading,
    isError: ordersError,
    mutate,
  } = useOrders();
  const {
    offers,
    isLoading: offersLoading,
    isError: offersError,
  } = useUserOffers();

  const [mainTab, setMainTab] = useState("orders"); // "orders" or "offers"
  const [orderFilter, setOrderFilter] = useState("All Orders");
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState(null);
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    order: null,
  });

  // Confirm order state
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmOrderId, setConfirmOrderId] = useState(null);

  // Receipt modal state
  const [receiptModal, setReceiptModal] = useState({
    isOpen: false,
    order: null,
  });
  const receiptRef = useRef(null);

  // Chat state
  const [chatOrderId, setChatOrderId] = useState(null);
  const { chat } = useChatByOrder(chatOrderId);
  const { messages, mutate: mutateMessages } = useChatMessages(chat?.id);

  const filteredOrders =
    orderFilter === "All Orders"
      ? orders
      : orders.filter((order) => order.status === orderFilter);

  const handleOpenModal = (order) => {
    setCancelError(null);
    setModalConfig({ isOpen: true, order });
  };

  const handleCloseModal = () => {
    setModalConfig({ isOpen: false, order: null });
  };

  const handleConfirmCancel = async () => {
    if (!modalConfig.order) return;

    setCancelLoading(true);
    setCancelError(null);

    try {
      await api.put(`/orders/${modalConfig.order.id}/cancel`);
      mutate();
      handleCloseModal();
    } catch (err) {
      setCancelError(
        err.message || "Failed to cancel order. Please try again."
      );
    } finally {
      setCancelLoading(false);
    }
  };

  const handleConfirmOrder = async (orderId) => {
    setConfirmLoading(true);
    setConfirmOrderId(orderId);

    try {
      const response = await api.put(`/orders/${orderId}/confirm`);
      mutate();
      // Show receipt modal
      const updatedOrder = orders.find((o) => o.id === orderId);
      if (updatedOrder) {
        setReceiptModal({
          isOpen: true,
          order: {
            ...updatedOrder,
            receiptNumber: response.receiptNumber,
            status: "completed",
          },
        });
      }
    } catch (err) {
      alert(err.data?.error || "Failed to confirm order. Please try again.");
    } finally {
      setConfirmLoading(false);
      setConfirmOrderId(null);
    }
  };

  const handlePrintReceipt = () => {
    if (receiptRef.current) {
      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
        <html>
          <head>
            <title>Receipt - ${receiptModal.order?.receiptNumber}</title>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; }
              .receipt { max-width: 400px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; }
              .header { text-align: center; border-bottom: 2px dashed #ddd; padding-bottom: 15px; margin-bottom: 15px; }
              .logo { font-size: 24px; font-weight: bold; color: #4F46E5; }
              .receipt-number { font-size: 12px; color: #666; margin-top: 5px; }
              .items { border-bottom: 1px dashed #ddd; padding-bottom: 15px; margin-bottom: 15px; }
              .item { display: flex; justify-content: space-between; margin-bottom: 8px; }
              .total { font-weight: bold; font-size: 18px; display: flex; justify-content: space-between; }
              .footer { text-align: center; color: #888; font-size: 12px; margin-top: 20px; }
            </style>
          </head>
          <body>
            ${receiptRef.current.innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const orderTabs = ["All Orders", "pending", "delivered", "cancelled"];
  const tabLabels = {
    "All Orders": "All Orders",
    pending: "Pending",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-[#FEF9C3] text-[#B45309]",
      completed: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
      processing: "bg-blue-100 text-blue-700",
      shipped: "bg-purple-100 text-purple-700",
      delivered: "bg-indigo-100 text-indigo-700",
      accepted: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
    };
    return styles[status] || "bg-gray-100 text-gray-700";
  };

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

  const isLoading = mainTab === "orders" ? ordersLoading : offersLoading;
  const isError = mainTab === "orders" ? ordersError : offersError;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-[#FCD34D] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12 bg-red-50 rounded-xl border border-red-200">
        <p className="text-red-600">Failed to load data. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-300">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Order History & Offers
      </h1>

      {/* Info Banner */}
      <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 flex items-start gap-3">
        <FileText className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-indigo-900">
            Receipt will be generated after order is delivered
          </p>
          <p className="text-xs text-indigo-600 mt-1">
            Once your order is marked as "Delivered", you can confirm receipt
            and a system-generated receipt will be available for download.
          </p>
        </div>
      </div>

      {/* Main Tabs: Orders vs Offers */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setMainTab("orders")}
          className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            mainTab === "orders"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Package size={18} />
          My Purchases
        </button>
        <button
          onClick={() => setMainTab("offers")}
          className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            mainTab === "offers"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <PhilippinePeso size={18} />
          My Sell Offers
          {offers.filter((o) => o.status === "pending").length > 0 && (
            <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full text-xs">
              {offers.filter((o) => o.status === "pending").length}
            </span>
          )}
        </button>
      </div>

      {mainTab === "orders" ? (
        <>
          {/* Order Filter Tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {orderTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setOrderFilter(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
                  orderFilter === tab
                    ? "bg-[#FCD34D] text-gray-900"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {tabLabels[tab]}
              </button>
            ))}
          </div>

          {/* Order List */}
          <div className="space-y-6">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="border border-gray-200 rounded-xl overflow-hidden"
                >
                  <div className="bg-gray-50 px-6 py-4 flex flex-wrap gap-4 items-center justify-between border-b border-gray-200">
                    <div className="flex flex-wrap gap-x-12 gap-y-2 items-center">
                      <span className="text-sm text-gray-900 font-bold block">
                        Order #{order.id.slice(0, 8)}
                      </span>
                      <span className="text-sm text-gray-500">
                        Placed on{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                      <span
                        className={`px-3 py-1 text-xs font-bold rounded-full capitalize ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                      {order.receiptNumber && (
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <FileText size={12} />
                          {order.receiptNumber}
                        </span>
                      )}
                    </div>
                    <div className="font-bold text-gray-900">
                      ₱{order.total.toFixed(2)}
                    </div>
                  </div>

                  <div className="p-6">
                    {order.items?.map((item, i) => {
                      const images = parseImages(item.product?.images);
                      return (
                        <div
                          key={i}
                          className={`flex gap-6 ${
                            i !== order.items.length - 1 ? "mb-6" : ""
                          }`}
                        >
                          <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                            {images[0] ? (
                              <img
                                src={images[0]}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-3xl">📦</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900">
                              {item.product?.name || "Product"}
                            </h3>
                            <p className="text-gray-500 text-sm mt-1">
                              Quantity: {item.quantity}
                            </p>
                            <p className="font-bold text-gray-900 mt-2">
                              ₱{item.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Actions */}
                  <div className="bg-white px-6 py-4 border-t border-gray-100 flex flex-wrap gap-3 justify-between items-center">
                    <div className="flex gap-3">
                      <button
                        onClick={() => setChatOrderId(order.id)}
                        className="px-4 py-2 text-indigo-600 text-sm font-semibold border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors flex items-center gap-2"
                      >
                        <MessageCircle size={16} />
                        Chat with Shop
                      </button>

                      {/* View Receipt button for completed orders */}
                      {order.status === "completed" && order.receiptNumber && (
                        <button
                          onClick={() =>
                            setReceiptModal({ isOpen: true, order })
                          }
                          className="px-4 py-2 text-green-600 text-sm font-semibold border border-green-200 rounded-lg hover:bg-green-50 transition-colors flex items-center gap-2"
                        >
                          <FileText size={16} />
                          View Receipt
                        </button>
                      )}
                    </div>

                    <div className="flex gap-3">
                      {/* Confirm Delivery button for delivered orders */}
                      {order.status === "delivered" && !order.receiptNumber && (
                        <button
                          onClick={() => handleConfirmOrder(order.id)}
                          disabled={
                            confirmLoading && confirmOrderId === order.id
                          }
                          className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                          {confirmLoading && confirmOrderId === order.id ? (
                            <>
                              <Loader2 size={16} className="animate-spin" />
                              Confirming...
                            </>
                          ) : (
                            <>
                              <CheckCircle2 size={16} />
                              Confirm Receipt
                            </>
                          )}
                        </button>
                      )}

                      {order.status === "pending" && (
                        <button
                          onClick={() => handleOpenModal(order)}
                          className="px-4 py-2 text-red-500 text-sm font-semibold border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <p className="text-gray-500">
                  No orders found in this category.
                </p>
              </div>
            )}
          </div>
        </>
      ) : (
        /* Offers Tab */
        <div className="space-y-4">
          {offers.length > 0 ? (
            offers.map((offer) => {
              const images = parseImages(offer.product?.images);
              const offerImages = parseImages(offer.images);
              return (
                <div
                  key={offer.id}
                  className="border border-gray-200 rounded-xl p-6 bg-white"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                      {images[0] ? (
                        <img
                          src={images[0]}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package size={24} className="text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-gray-900">
                            {offer.product?.name || "Product"}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {offer.product?.shop?.name || "Shop"}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 text-xs font-bold rounded-full capitalize flex items-center gap-1 ${getStatusBadge(
                            offer.status
                          )}`}
                        >
                          {offer.status === "pending" && <Clock size={12} />}
                          {offer.status === "accepted" && (
                            <CheckCircle size={12} />
                          )}
                          {offer.status === "rejected" && <XCircle size={12} />}
                          {offer.status}
                        </span>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Quantity:</span>
                          <span className="ml-2 font-semibold text-gray-900">
                            {offer.quantity} units
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Value:</span>
                          <span className="ml-2 font-bold text-orange-600">
                            ₱
                            {(
                              (offer.product?.price || 0) * offer.quantity
                            ).toLocaleString()}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-500">Contact:</span>
                          <span className="ml-2 font-semibold text-gray-900">
                            {offer.contactNumber}
                          </span>
                        </div>
                        {offer.description && (
                          <div className="col-span-2">
                            <span className="text-gray-500">Description:</span>
                            <p className="text-gray-900 mt-1">
                              {offer.description}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Offer Images */}
                      {offerImages.length > 0 && (
                        <div className="mt-3">
                          <span className="text-sm text-gray-500">
                            Your photos:
                          </span>
                          <div className="flex gap-2 mt-2">
                            {offerImages.map((img, idx) => (
                              <div
                                key={idx}
                                className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200"
                              >
                                <img
                                  src={img}
                                  alt={`Offer ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <p className="text-xs text-gray-400 mt-3">
                        Submitted{" "}
                        {new Date(offer.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <PhilippinePeso size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-gray-500 font-medium">No sell offers yet</p>
              <p className="text-sm text-gray-400 mt-1">
                When you submit offers to sell items to shops, they'll appear
                here.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={modalConfig.isOpen}
        onClose={handleCloseModal}
        title="Cancel Order"
        actions={
          <>
            <button
              onClick={handleCloseModal}
              disabled={cancelLoading}
              className="px-4 py-2 bg-white text-gray-700 font-bold rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
            >
              Keep Order
            </button>
            <button
              onClick={handleConfirmCancel}
              disabled={cancelLoading}
              className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
            >
              {cancelLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Yes, Cancel Order"
              )}
            </button>
          </>
        }
      >
        <div className="text-center">
          {cancelError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {cancelError}
            </div>
          )}
          <p className="text-gray-600">
            Are you sure you want to cancel order{" "}
            <span className="font-bold text-gray-900">
              #{modalConfig.order?.id.slice(0, 8)}
            </span>
            ? This action cannot be undone.
          </p>
        </div>
      </Modal>

      {/* Receipt Modal */}
      <Modal
        isOpen={receiptModal.isOpen}
        onClose={() => setReceiptModal({ isOpen: false, order: null })}
        title="Order Receipt"
      >
        {receiptModal.order && (
          <div className="space-y-4">
            {/* Printable Receipt Content */}
            <div ref={receiptRef} className="receipt">
              <div className="header">
                <div className="logo">🛒 JunkHub</div>
                <div className="text-sm text-gray-500 mt-1">
                  Official Receipt
                </div>
                <div className="receipt-number font-mono">
                  {receiptModal.order.receiptNumber}
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg mb-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-500">Order ID:</div>
                  <div className="font-mono text-right">
                    #{receiptModal.order.id.slice(0, 8)}
                  </div>
                  <div className="text-gray-500">Date:</div>
                  <div className="text-right">
                    {new Date(
                      receiptModal.order.createdAt
                    ).toLocaleDateString()}
                  </div>
                  <div className="text-gray-500">Status:</div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                      Completed
                    </span>
                  </div>
                </div>
              </div>

              <div className="items border-t border-b border-gray-200 py-4 space-y-3">
                {receiptModal.order.items?.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <div>
                      <span className="font-medium">
                        {item.product?.name || "Product"}
                      </span>
                      <span className="text-gray-500 ml-2">
                        ×{item.quantity}
                      </span>
                    </div>
                    <div className="font-medium">
                      ₱{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="total flex justify-between items-center py-4 text-lg">
                <span>Total</span>
                <span className="text-indigo-600">
                  ₱{receiptModal.order.total.toFixed(2)}
                </span>
              </div>

              <div className="footer text-center text-gray-400 text-xs pt-4 border-t border-dashed border-gray-200">
                <p>Thank you for shopping with JunkHub!</p>
                <p className="mt-1">
                  Completed on{" "}
                  {receiptModal.order.completedAt
                    ? new Date(receiptModal.order.completedAt).toLocaleString()
                    : new Date().toLocaleString()}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={() => setReceiptModal({ isOpen: false, order: null })}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              <button
                onClick={handlePrintReceipt}
                className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                <Printer size={18} />
                Print Receipt
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Chat Sidebar */}
      <ChatSidebar
        isOpen={!!chatOrderId}
        onClose={() => setChatOrderId(null)}
        chatId={chat?.id}
        orderId={chatOrderId}
        recipientName={chat?.owner?.businessName || "Shop"}
        isOwner={false}
        messagesData={messages}
        mutateMessages={mutateMessages}
      />
    </div>
  );
}
