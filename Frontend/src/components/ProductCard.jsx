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
        toast.dismiss();
        toast.error("Failed to load reviews.", { toastId: `reviews-${product._id}` });
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
      toast.dismiss();
      toast.warning("Please log in to manage your wishlist.", { toastId: "loginWishlist" });
      navigate("/login");
      return;
    }

    try {
      toast.dismiss(); // clear any previous toast
      if (wishlisted) {
        await removeFromWishlist(product._id);
        setWishlisted(false);
        toast.info("💔 Removed from Wishlist", { toastId: `remove-${product._id}` });
      } else {
        await addToWishlist(product);
        setWishlisted(true);
        toast.success("💖 Added to Wishlist", { toastId: `add-${product._id}` });
      }
    } catch (err) {
      toast.dismiss();
      toast.error("Something went wrong while updating wishlist!",err, { toastId: `error-${product._id}` });
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
        size={16}
        className={i < rating ? "text-yellow-400" : "text-gray-300"}
      />
    ));
  };

  const handleViewDetails = () => {
    toast.dismiss();
    toast.info(`🔍 Viewing "${product.name}" details`, { toastId: `view-${product._id}` });
    navigate(`/product/${product._id}`);
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleViewDetails}
      className="relative group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 cursor-pointer"
    >
      <div className="relative w-full h-80 overflow-hidden">
        <img
          src={images[currentImg]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {hovered && images.length > 1 && (
          <>
            <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow hover:bg-white transition">
              <ChevronLeft size={18} />
            </button>
            <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow hover:bg-white transition">
              <ChevronRight size={18} />
            </button>
          </>
        )}

        <button
          onClick={handleToggleWishlist}
          className={`absolute top-3 right-3 p-2 rounded-full shadow transition-all duration-300 ${
            wishlisted ? "bg-red-500 text-white" : "bg-white/90 text-gray-700 hover:bg-pink-100"
          }`}
        >
          <Heart size={18} className={wishlisted ? "fill-current text-white" : ""} />
        </button>

        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === currentImg ? "bg-pink-500" : "bg-gray-300"}`} />
            ))}
          </div>
        )}
      </div>

      <div className="p-4 text-center">
        <h3 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h3>
        <p className="text-sm text-gray-500 capitalize mb-2">{product.category}</p>
        <div className="flex justify-center items-center mb-2">
          <div className="flex gap-1">{renderStars()}</div>
          <span className="text-xs text-gray-400 ml-1">{loadingReviews ? "Loading..." : `(${reviews.length})`}</span>
        </div>
        <p className="text-xl font-bold text-pink-500 mb-1">₹{product.price}</p>
        <p className="text-xs text-gray-400 italic">Tap to view details →</p>
      </div>
    </div>
  );
};

export default ProductCard;
