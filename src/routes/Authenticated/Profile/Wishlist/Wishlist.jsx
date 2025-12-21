import { useState } from "react";
import Card from "../../../../components/Card";
import Modal from "../../components/Modal";
import { ShoppingCart, Bell, Trash2 } from "lucide-react";
import { useWishlist } from "../../../../lib/hooks";
import api from "../../../../lib/api";

export default function Wishlist() {
  const { wishlist, isLoading, isError, mutate } = useWishlist();
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: null,
    item: null,
  });

  const handleOpenModal = (type, item) => {
    setModalConfig({ isOpen: true, type, item });
  };

  const handleCloseModal = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
  };

  const handleConfirmRemove = async () => {
    try {
      // Use PUT to toggle (remove) the item from wishlist
      await api.put("/users/wishlist", { productId: modalConfig.item?.id });
      mutate(); // Refresh wishlist
    } catch (err) {
      console.error("Failed to remove from wishlist:", err);
    }
    handleCloseModal();
  };

  const handleAddToCart = () => {
    // Add to cart logic here
    handleCloseModal();
  };

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
        <p className="text-red-600">
          Failed to load wishlist. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
        <span className="text-gray-500 text-sm font-medium">
          {wishlist.length} items
        </span>
      </div>

      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {wishlist.map((item) => {
            const images = item.images ? JSON.parse(item.images) : [];
            const inStock = item.stock > 0;

            return (
              <Card
                key={item.id}
                image={images[0] || "📦"}
                title={item.name}
                badges={[
                  <span
                    key="price"
                    className="text-[#F59E0B] font-bold text-lg"
                  >
                    ₱{item.price.toFixed(2)}
                  </span>,
                ]}
                details={[
                  <span
                    key="status"
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      inStock
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {inStock ? "In Stock" : "Out of Stock"}
                  </span>,
                ]}
                actionButton={{
                  text: inStock ? "Add to Cart" : "Notify Me",
                  variant: inStock ? "primary" : "secondary",
                  onClick: () =>
                    inStock
                      ? handleOpenModal("add-to-cart", item)
                      : handleOpenModal("notify", item),
                }}
                onRemove={() => handleOpenModal("remove", item)}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200 mb-12">
          <p className="text-gray-500">Your wishlist is empty.</p>
        </div>
      )}

      {/* Interactions Modal */}
      <Modal
        isOpen={modalConfig.isOpen}
        onClose={handleCloseModal}
        title={
          modalConfig.type === "remove"
            ? "Remove Item"
            : modalConfig.type === "add-to-cart"
            ? "Added to Cart"
            : "Notification Set"
        }
        actions={
          modalConfig.type === "remove" ? (
            <>
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-white text-gray-700 font-bold rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRemove}
                className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700"
              >
                Remove
              </button>
            </>
          ) : (
            <button
              onClick={handleCloseModal}
              className="px-4 py-2 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800"
            >
              Close
            </button>
          )
        }
      >
        {modalConfig.type === "add-to-cart" && (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart size={32} />
            </div>
            <p className="text-gray-600">
              <span className="font-bold text-gray-900">
                {modalConfig.item?.name}
              </span>{" "}
              has been added to your shopping cart.
            </p>
          </div>
        )}

        {modalConfig.type === "notify" && (
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell size={32} />
            </div>
            <p className="text-gray-600">
              We'll notify you when{" "}
              <span className="font-bold text-gray-900">
                {modalConfig.item?.name}
              </span>{" "}
              is back in stock!
            </p>
          </div>
        )}

        {modalConfig.type === "remove" && (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={32} />
            </div>
            <p className="text-gray-600">
              Are you sure you want to remove{" "}
              <span className="font-bold text-gray-900">
                {modalConfig.item?.name}
              </span>{" "}
              from your wishlist?
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
