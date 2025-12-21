import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useProduct, useWishlist } from "../../../lib/hooks";
import { useCart } from "../../../lib/cart";
import api from "../../../lib/api";

// Local components
import ProductImages from "./ProductImages";
import ProductInfo from "./ProductInfo";
import CartModal from "./CartModal";
import BuyNowModal from "./BuyNowModal";
import SellToShopModal from "./SellToShopModal";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, isLoading, isError } = useProduct(id);
  const { wishlist, mutate: mutateWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState(null);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  // Error state or no product
  if (isError || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-500 mb-6">
            The product you're looking for doesn't exist.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium"
          >
            <ArrowLeft size={16} />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  // Check if this is a "Buying" type product (shop wants to buy from users)
  const isBuyingType = product.type === "Buying";

  // Check if product is in wishlist
  const isInWishlist = wishlist.some((item) => item.id === product.id);

  const toggleWishlist = async () => {
    try {
      await api.put("/users/wishlist", { productId: product.id });
      mutateWishlist();
    } catch (error) {
      console.error("Failed to toggle wishlist:", error);
    }
  };

  // Parse images - handle string, array, or undefined
  const parseImages = (images) => {
    if (!images) return ["https://placehold.co/600x600?text=No+Image"];
    if (Array.isArray(images))
      return images.length > 0
        ? images
        : ["https://placehold.co/600x600?text=No+Image"];
    if (typeof images === "string") {
      try {
        const parsed = JSON.parse(images);
        return Array.isArray(parsed) && parsed.length > 0
          ? parsed
          : ["https://placehold.co/600x600?text=No+Image"];
      } catch {
        return [images];
      }
    }
    return ["https://placehold.co/600x600?text=No+Image"];
  };

  // Normalize product data for display
  const displayData = {
    title: product.name || "Product",
    price: product.price || 0,
    stock: product.stock || 0,
    description: product.description || "",
    images: parseImages(product.images),
    shop: product.shop || { id: null, name: "Unknown Shop" },
    category: product.category || "General",
  };

  const handleQuantityChange = (type) => {
    if (type === "decrease" && quantity > 1) setQuantity(quantity - 1);
    if (type === "increase" && quantity < displayData.stock)
      setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    addToCart(
      {
        id: product.id,
        name: displayData.title,
        price: displayData.price,
        images: displayData.images,
        shop: displayData.shop,
      },
      quantity
    );
    setIsCartModalOpen(true);
  };

  const handleBuyNow = () => {
    setOrderError(null);
    setOrderSuccess(false);
    setIsBuyModalOpen(true);
  };

  const handleConfirmPurchase = async () => {
    setIsProcessing(true);
    setOrderError(null);

    try {
      await api.post("/orders", {
        items: [{ productId: product.id, quantity }],
        shippingAddress: "Default Address",
        shippingCity: "Default City",
        shippingZip: "00000",
      });

      setOrderSuccess(true);
      setTimeout(() => {
        setIsBuyModalOpen(false);
        setOrderSuccess(false);
        navigate("/profile");
      }, 2000);
    } catch (error) {
      setOrderError(
        error.message || "Failed to create order. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSellToShop = () => {
    setIsSellModalOpen(true);
  };

  const handleSubmitSellOffer = async ({
    quantity,
    contactNumber,
    description,
    images,
  }) => {
    setIsProcessing(true);

    try {
      await api.post("/offers", {
        productId: product.id,
        quantity,
        contactNumber,
        description,
        images,
      });

      setTimeout(() => {
        setIsSellModalOpen(false);
        navigate("/profile");
      }, 2000);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Failed to submit offer.",
      };
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 relative">
      {/* Breadcrumb / Back */}
      <div className="mb-6">
        <Link
          to="/products"
          className="inline-flex items-center text-sm text-gray-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Products
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column - Images */}
        <ProductImages
          images={displayData.images}
          selectedImage={selectedImage}
          onSelectImage={setSelectedImage}
          title={displayData.title}
        />

        {/* Right Column - Product Info */}
        <ProductInfo
          displayData={displayData}
          isBuyingType={isBuyingType}
          quantity={quantity}
          stock={product.stock}
          onQuantityChange={handleQuantityChange}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          onSellToShop={handleSellToShop}
          isInWishlist={isInWishlist}
          onToggleWishlist={toggleWishlist}
        />
      </div>

      {/* Modals */}
      <CartModal
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
        quantity={quantity}
        productTitle={displayData.title}
      />

      <BuyNowModal
        isOpen={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
        displayData={displayData}
        quantity={quantity}
        orderSuccess={orderSuccess}
        orderError={orderError}
        isProcessing={isProcessing}
        onConfirmPurchase={handleConfirmPurchase}
      />

      <SellToShopModal
        isOpen={isSellModalOpen}
        onClose={() => setIsSellModalOpen(false)}
        displayData={displayData}
        isProcessing={isProcessing}
        onSubmit={handleSubmitSellOffer}
      />
    </div>
  );
}
