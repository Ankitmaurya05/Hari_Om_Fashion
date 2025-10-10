import React, { useState, useEffect, useCallback } from "react";
import { Heart, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useWishlist } from "../contexts/WishlistContext";
import axios from "axios";

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
      ? product.images
      : [product.mainImage || "/placeholder.png"];

  // ✅ Check wishlist
  useEffect(() => {
    setWishlisted(wishlist.some((item) => item._id === product._id));
  }, [wishlist, product._id]);

  // ✅ Fetch reviews
  const fetchReviews = useCallback(async () => {
    setLoadingReviews(true);
    try {
      const res = await axios.get(
        `https://hari-om-fashion.onrender.com/api/reviews/product/${product._id}`
      );
      setReviews(res.data || []);
    } catch (err) {
      if (err.response?.status !== 404) {
        toast.error("Failed to load reviews.");
      }
      setReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  }, [product._id]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const averageRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  // ✅ Wishlist toggle
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
      toast.error("Something went wrong while updating wishlist!",err);
    }
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImg((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImg((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const renderStars = () => {
    const rating = Math.round(averageRating);
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={i < rating ? "text-yellow-400" : "text-gray-300"}
      />
    ));
  };

  const handleViewDetails = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleViewDetails}
      className="relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg border border-gray-100 cursor-pointer transition-transform duration-300 hover:-translate-y-1"
    >
      {/* Image Section */}
      <div className="relative w-full aspect-[3/4] overflow-hidden">
        <img
          src={images[currentImg]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Discount Tag */}
        {product.discount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
            -{product.discount}%
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-2 right-2 p-2 rounded-full transition-all shadow ${
            wishlisted
              ? "bg-red-500 text-white"
              : "bg-white text-gray-700 hover:bg-pink-100"
          }`}
        >
          <Heart size={16} className={wishlisted ? "fill-current" : ""} />
        </button>

        {/* Carousel Arrows */}
        {hovered && images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-1 shadow hover:bg-white"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-1 shadow hover:bg-white"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}

        {/* Dots Indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full ${
                  i === currentImg ? "bg-pink-500" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3 text-center">
        <h3 className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2">
          {product.name}
        </h3>
        <div className="flex justify-center items-center mt-1">
          <div className="flex">{renderStars()}</div>
          <span className="text-xs text-gray-500 ml-1">
            {loadingReviews ? "..." : `(${reviews.length})`}
          </span>
        </div>

        {/* Price Section */}
        <div className="flex flex-col items-center mt-1">
          {product.oldPrice && (
            <span className="text-xs text-gray-400 line-through">
              ₹{product.oldPrice}
            </span>
          )}
          <span className="text-base font-bold text-green-600">
            ₹{product.price}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
