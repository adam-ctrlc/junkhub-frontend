import { useState, useEffect, useCallback } from "react";

const CART_KEY = "junk-hub-cart";

/**
 * Get cart from localStorage
 */
function getStoredCart() {
  try {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch {
    return [];
  }
}

/**
 * Save cart to localStorage
 */
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

/**
 * Hook for managing cart with localStorage
 */
export function useCart() {
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart on mount
  useEffect(() => {
    setCart(getStoredCart());
    setIsLoading(false);
  }, []);

  // Add item to cart
  const addToCart = useCallback((product, quantity = 1) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.productId === product.id
      );

      let newCart;
      if (existingIndex >= 0) {
        // Update quantity if product exists
        newCart = prevCart.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new product
        newCart = [
          ...prevCart,
          {
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.images?.[0] || null,
            shopName: product.shop?.name || "Unknown Shop",
            shopId: product.shop?.id || null,
            quantity,
          },
        ];
      }

      saveCart(newCart);
      return newCart;
    });
  }, []);

  // Update quantity
  const updateQuantity = useCallback((productId, change) => {
    setCart((prevCart) => {
      const newCart = prevCart.map((item) => {
        if (item.productId === productId) {
          const newQty = Math.max(1, item.quantity + change);
          return { ...item, quantity: newQty };
        }
        return item;
      });

      saveCart(newCart);
      return newCart;
    });
  }, []);

  // Remove item from cart
  const removeFromCart = useCallback((productId) => {
    setCart((prevCart) => {
      const newCart = prevCart.filter((item) => item.productId !== productId);
      saveCart(newCart);
      return newCart;
    });
  }, []);

  // Clear entire cart
  const clearCart = useCallback(() => {
    setCart([]);
    saveCart([]);
  }, []);

  // Calculate totals
  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return {
    cart,
    isLoading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    itemCount,
  };
}

export default useCart;
