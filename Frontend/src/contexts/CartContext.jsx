import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// Axios instance
const api = axios.create({
  baseURL: "https://hari-om-fashion.onrender.com/api",
});

// Attach JWT token if exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const isLoggedIn = !!localStorage.getItem("token"); // check user login

  // Fetch cart items
  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await api.get("/cart");
      setCart(res.data.items || []);
    } catch (err) {
      console.error("Fetch cart error:", err.response?.data || err.message);
      if (isLoggedIn) {
        toast.dismiss();
        toast.error(err.response?.data?.message || "Failed to fetch cart", { toastId: "fetchCartError" });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) fetchCart();
  }, []);

  // Add item
  const addToCart = async ({ _id, selectedSize, quantity = 1 }) => {
    if (!isLoggedIn) return; // only for logged in user
    if (!selectedSize) {
      toast.dismiss();
      toast.error("Please select a size", { toastId: `sizeError-${_id}` });
      return;
    }
    try {
      const res = await api.post("/cart/add", { productId: _id, selectedSize, quantity });
      setCart(res.data.items || []);
      toast.dismiss();
      toast.success("Added to cart!", { toastId: `add-${_id}` });
    } catch (err) {
      console.error("Add to cart error:", err.response?.data || err.message);
      toast.dismiss();
      toast.error(err.response?.data?.message || "Failed to add to cart", { toastId: `addError-${_id}` });
    }
  };

  // Remove item
  const removeFromCart = async (productId, selectedSize) => {
    if (!isLoggedIn) return;
    try {
      const res = await api.delete(`/cart/remove/${productId}?size=${selectedSize}`);
      setCart(res.data.items || []);
      toast.dismiss();
      toast.success("Removed from cart", { toastId: `remove-${productId}-${selectedSize}` });
    } catch (err) {
      console.error("Remove from cart error:", err.response?.data || err.message);
      toast.dismiss();
      toast.error(err.response?.data?.message || "Failed to remove item", { toastId: `removeError-${productId}-${selectedSize}` });
    }
  };

  // Update quantity
  const updateQuantity = async (productId, selectedSize, quantity) => {
    if (!isLoggedIn) return;
    if (quantity < 1) return;
    try {
      const res = await api.put("/cart/update", { productId, selectedSize, quantity });
      setCart(res.data.items || []);
    } catch (err) {
      console.error("Update quantity error:", err.response?.data || err.message);
      toast.dismiss();
      toast.error(err.response?.data?.message || "Failed to update quantity", { toastId: `updateQty-${productId}-${selectedSize}` });
    }
  };

  // Update size
  const updateSize = async (productId, oldSize, newSize) => {
    if (!isLoggedIn) return;
    try {
      const res = await api.put("/cart/update-size", { productId, oldSize, newSize });
      setCart(res.data.items || []);
      toast.dismiss();
      toast.success("Size updated!", { toastId: `updateSize-${productId}-${oldSize}` });
    } catch (err) {
      console.error("Update size error:", err.response?.data || err.message);
      toast.dismiss();
      toast.error(err.response?.data?.message || "Failed to update size", { toastId: `updateSizeError-${productId}-${oldSize}` });
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (!isLoggedIn) return;
    try {
      await api.delete("/cart/clear");
      setCart([]);
      toast.dismiss();
      toast.success("Cart cleared", { toastId: "clearCart" });
    } catch (err) {
      console.error("Clear cart error:", err.response?.data || err.message);
      toast.dismiss();
      toast.error(err.response?.data?.message || "Failed to clear cart", { toastId: "clearCartError" });
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        fetchCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateSize,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
