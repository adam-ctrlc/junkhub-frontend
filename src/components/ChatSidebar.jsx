import { useState, useEffect, useRef } from "react";
import { X, Send, MessageCircle, Package, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import api from "../lib/api";

export default function ChatSidebar({
  isOpen,
  onClose,
  chatId,
  orderId,
  recipientName,
  isOwner = false,
  messagesData = [],
  mutateMessages,
}) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const apiPrefix = isOwner ? "/owner" : "";

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesData]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || !chatId) return;

    setSending(true);
    try {
      await api.post(`${apiPrefix}/chats/${chatId}/messages`, {
        content: message.trim(),
      });
      setMessage("");
      mutateMessages?.();
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateStr) => {
    try {
      return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
    } catch {
      return "Just now";
    }
  };

  const getSenderName = (msg) => {
    if (msg.senderType === "user") {
      return msg.senderUser
        ? `${msg.senderUser.firstName} ${msg.senderUser.lastName}`
        : "User";
    }
    return msg.senderOwner?.businessName || "Shop";
  };

  const isOwnMessage = (msg) => {
    if (isOwner) {
      return msg.senderType === "owner";
    }
    return msg.senderType === "user";
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />

      {/* Sidebar */}
      <div
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
          <div className="flex items-center gap-3">
            <MessageCircle size={22} />
            <div>
              <h2 className="font-bold">{recipientName}</h2>
              {orderId && (
                <p className="text-xs text-indigo-200 flex items-center gap-1">
                  <Package size={12} />
                  Order #{orderId?.slice(-8)}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/20 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {messagesData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8">
              <MessageCircle size={48} className="opacity-30 mb-4" />
              <p className="font-medium">No messages yet</p>
              <p className="text-sm mt-1 text-center">
                Start the conversation about this order
              </p>
            </div>
          ) : (
            messagesData.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  isOwnMessage(msg) ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                    isOwnMessage(msg)
                      ? "bg-indigo-600 text-white rounded-br-md"
                      : "bg-white border border-gray-200 text-gray-800 rounded-bl-md"
                  }`}
                >
                  {!isOwnMessage(msg) && (
                    <p className="text-xs font-semibold text-indigo-600 mb-1">
                      {getSenderName(msg)}
                    </p>
                  )}
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  <p
                    className={`text-[10px] mt-1 ${
                      isOwnMessage(msg) ? "text-indigo-200" : "text-gray-400"
                    }`}
                  >
                    {formatTime(msg.createdAt)}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={handleSend}
          className="p-4 border-t border-gray-100 bg-white flex gap-2"
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 text-sm"
            disabled={sending || !chatId}
          />
          <button
            type="submit"
            disabled={sending || !message.trim() || !chatId}
            className="px-4 py-3 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {sending ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </form>
      </div>
    </>
  );
}
