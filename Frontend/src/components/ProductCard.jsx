import React, { useState, useEffect, useCallback } from "react";
import { Heart, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useWishlist } from "../contexts/WishlistContext";
import axios from "axios";

const BACKEND_URL = "https://hari-om-fashion.onrender.com";
const PLACEHOLDER =
  "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D'400'%20height%3D'300'%20xmlns%3D'http%3A//www.w3.org/2000/svg'%3E%3Crect%20fill%3D'%23f3f4f6'%20width%3D'400'%20height%3D'300'/%3E%3Ctext%20x%3D'50%25'%20y%3D'50%25'%20dominant-baseline%3D'middle'%20text-anchor%3D'middle'%20fill%3D'%239ca3af'%20font-family%3D'Arial'%20font-size%3D'16'%3ENo%20Image%3C/text%3E%3C/svg%3E";

// ✅ Normalize any image (localhost, HTTP, relative)
const normalizeImageUrl = (img) => {
  if (!img) return PLACEHOLDER;
  if (/^https?:\/\//i.test(img))
    return img.replace(/^http:\/\//i, "https://");
  const clean = img.replace(/^\/+/, "");
  return `${BACKEND_URL}/${clean}`;
};

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const [hovered, setHovered] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [wishlisted, setWishlisted] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(true);

  const images =
    product.images?.length > 0
      ? product.images.map(normalizeImageUrl)
      : [normalizeImageUrl(product.mainImage)];

  useEffect(() => {
    setWishlisted(wishlist.some((item) => item._id === product._id));
  }, [wishlist, product._id]);

  const fetchReviews = useCallback(async () => {
    setLoadingReviews(true);
    try {
      const res = await axios.get(
        `${BACKEND_URL}/api/reviews/product/${product._id}`
      );
      setReviews(res.data || []);
    } catch (err) {
      if (err.response?.status !== 404)
        toast.error("Failed to load reviews.");
      setReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  }, [product._id]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const avgRating = reviews.length
    ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length
    : 0;

  const handleToggleWishlist = async (e) => {
    e.stopPropagation();
    if (!token) {
      toast.warning("Please log in to manage your wishlist.");
      navigate("/login");
      return;
    }

    try {
      if (wishlisted) {
        await removeFromWishlist(product._id);
        setWishlisted(false);
        toast.info("💔 Removed from Wishlist");
      } else {
        await addToWishlist(product);
        setWishlisted(true);
        toast.success("💖 Added to Wishlist");
      }
    } catch (err) {
      toast.error("Error updating wishlist!", err);
    }
  };

  const prevImg = (e) => {
    e.stopPropagation();
    setCurrentImg((p) => (p === 0 ? images.length - 1 : p - 1));
  };
  const nextImg = (e) => {
    e.stopPropagation();
    setCurrentImg((p) => (p === images.length - 1 ? 0 : p + 1));
  };

  const renderStars = () =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={i < Math.round(avgRating) ? "text-yellow-400" : "text-gray-300"}
      />
    ));

  return (
    <div
      onClick={() => navigate(`/product/${product._id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg border border-gray-100 cursor-pointer transition-transform duration-300 hover:-translate-y-1"
    >
      {/* Image Section */}
      <div className="relative w-full aspect-[3/4] overflow-hidden">
        <img
          src={images[currentImg]}
          alt={product.name}
          onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Wishlist */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-2 right-2 p-2 rounded-full shadow transition-all ${
            wishlisted
              ? "bg-red-500 text-white"
              : "bg-white text-gray-700 hover:bg-pink-100"
          }`}
        >
          <Heart size={16} className={wishlisted ? "fill-current" : ""} />
        </button>

        {/* Arrows */}
        {hovered && images.length > 1 && (
          <>
            <button
              onClick={prevImg}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-1 shadow hover:bg-white"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={nextImg}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-1 shadow hover:bg-white"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}
        {/* Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentImg === i ? "bg-gray-800" : "bg-gray-300"
                }`}
              ></span>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 mb-1">
          {product.name}
        </h3>
        <p className="text-gray-500 text-xs mb-2 capitalize">
          {product.category || "Fashion"}
        </p>

        {/* Price & Rating */}
        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold text-[#1565c0]">
            ₹{product.price?.toLocaleString("en-IN")}
          </p>
          <div className="flex items-center gap-1">
            {renderStars()}
            {!loadingReviews && (
              <span className="text-xs text-gray-500 ml-1">
                ({reviews.length})
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
