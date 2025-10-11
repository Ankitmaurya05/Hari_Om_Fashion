import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({ baseURL: "https://hari-om-fashion.onrender.com/api" });

// ✅ Automatically attach token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const isLoggedIn = !!localStorage.getItem("token");

  // ✅ Fetch Wishlist
  const fetchWishlist = async () => {
    if (!isLoggedIn) {
      setWishlist([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get("/wishlist");
      setWishlist(res.data.products || []);
    } catch (err) {
      console.error("Fetch wishlist error:", err);
      if (isLoggedIn) {
        toast.dismiss();
        toast.error("Failed to fetch wishlist", { toastId: "fetchWishlistError" });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) fetchWishlist();
  }, []);

  // ✅ Add to Wishlist
  const addToWishlist = async (product) => {
    if (!isLoggedIn) return; // ❌ no toast if not logged in

    try {
      const res = await api.post("/wishlist/add", { productId: product._id });
      setWishlist(res.data.products || []);
      toast.dismiss();
      toast.success("Added to wishlist!", { toastId: `add-${product._id}` });
    } catch (err) {
      console.error("Add to wishlist error:", err);
      toast.dismiss();
      toast.error(
        err.response?.data?.message || "Failed to add to wishlist",
        { toastId: `addError-${product._id}` }
      );
    }
  };

  // ✅ Remove from Wishlist
  const removeFromWishlist = async (productId) => {
    if (!isLoggedIn) return; // ❌ no toast if not logged in

    try {
      const res = await api.delete(`/wishlist/remove/${productId}`);
      setWishlist(res.data.products || []);
      toast.dismiss();
      toast.success("Removed from wishlist", { toastId: `remove-${productId}` });
    } catch (err) {
      console.error("Remove from wishlist error:", err);
      toast.dismiss();
      toast.error("Failed to remove from wishlist", { toastId: `removeError-${productId}` });
    }
  };

  const wishlistCount = wishlist.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        addToWishlist,
        removeFromWishlist,
        wishlistCount,
        fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

// ✅ Custom Hook
export const useWishlist = () => useContext(WishlistContext);
