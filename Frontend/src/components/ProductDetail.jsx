import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Heart,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";
import { toast } from "react-toastify";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import Review from "../components/Review";

const BACKEND_BASE = "hari-om-fashion.onrender.com";
const BACKEND_URL_HTTPS = `https://${BACKEND_BASE}`;
const PLACEHOLDER =
  "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D'600'%20height%3D'400'%20xmlns%3D'http%3A//www.w3.org/2000/svg'%3E%3Crect%20width%3D'100%25'%20height%3D'100%25'%20fill%3D'%23f3f4f6'/%3E%3Ctext%20x%3D'50%25'%20y%3D'50%25'%20dominant-baseline%3D'middle'%20text-anchor%3D'middle'%20fill%3D'%239ca3af'%20font-family%3D'Arial%2C%20sans-serif'%20font-size%3D'20'%3EImage%20not%20available%3C/text%3E%3C/svg%3E";

// ✅ Normalize image URLs (fixes localhost + HTTP issues)
const normalizeImageUrl = (img) => {
  if (!img) return null;
  if (/^https?:\/\//i.test(img)) {
    return img.replace(/^http:\/\//i, "https://");
  }
  const clean = img.replace(/^\/+/, "");
  return `${BACKEND_URL_HTTPS}/${clean}`;
};

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");

  const token = localStorage.getItem("token");
  const { cart, addToCart } = useCart();
  const { wishlist, addToWishlist } = useWishlist();

  const fetchProduct = async () => {
    try {
      const res = await axios.get(
        `https://${BACKEND_BASE}/api/products/${id}`
      );
      setProduct(res.data);
    } catch (err) {
      console.error("Fetch product error:", err);
      toast.error("Failed to load product", { toastId: "fetch-product" });
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (!product)
    return (
      <p className="text-center mt-10 text-gray-600">Loading product...</p>
    );

  // ✅ Normalize image URLs
  const images = (
    product.images?.length
      ? product.images
      : product.mainImage
      ? [product.mainImage]
      : []
  )
    .map(normalizeImageUrl)
    .filter(Boolean);

  const isInCart = cart.some(
    (item) => item._id === product._id && item.selectedSize === selectedSize
  );
  const isInWishlist = wishlist.some((item) => item._id === product._id);

  const handleAddToCart = async () => {
    if (!token)
      return toast.info("Please login first", { toastId: "login-cart" });
    if (!selectedSize)
      return toast.error("Please select a size first", {
        toastId: "select-size",
      });
    if (isInCart)
      return toast.info("Already in cart", { toastId: "already-cart" });

    await addToCart({ ...product, selectedSize, quantity: 1 });
    toast.success("Added to Cart!", { toastId: `cart-${product._id}` });
  };

  const handleAddToWishlist = async () => {
    if (!token)
      return toast.info("Please login first", { toastId: "login-wishlist" });
    if (isInWishlist)
      return toast.info("Already wishlisted", { toastId: "already-wishlist" });

    await addToWishlist(product);
    toast.success("Added to Wishlist!", { toastId: `wishlist-${product._id}` });
  };

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={18}
        className={
          i < Math.round(rating || 0)
            ? "text-yellow-400"
            : "text-gray-300"
        }
      />
    ));

  const handleImgError = (e) => {
    e.currentTarget.src = PLACEHOLDER;
  };

  return (
    <div className="backdrop-blur-lg min-h-screen py-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 px-4 sm:px-8">
        {/* LEFT: Images */}
        <div className="flex flex-col items-center">
          <div
            className="relative w-full max-w-md h-[420px] sm:h-[500px] border rounded-lg overflow-hidden bg-gray-50 shadow-sm"
            onMouseEnter={() => setZoom(true)}
            onMouseLeave={() => setZoom(false)}
          >
            {images[selectedIndex] ? (
              <img
                src={images[selectedIndex]}
                alt={product.name || "product image"}
                onError={handleImgError}
                className={`w-full h-full object-cover transition-transform duration-500 ${
                  zoom ? "scale-110" : "scale-100"
                }`}
              />
            ) : (
              <img
                src={PLACEHOLDER}
                alt="placeholder"
                className="w-full h-full object-cover"
              />
            )}

            {images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setSelectedIndex((prev) =>
                      prev === 0 ? images.length - 1 : prev - 1
                    )
                  }
                  className="absolute top-1/2 left-2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-100"
                >
                  <ChevronLeft />
                </button>
                <button
                  onClick={() =>
                    setSelectedIndex((prev) =>
                      prev === images.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="absolute top-1/2 right-2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-100"
                >
                  <ChevronRight />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 mt-4 flex-wrap justify-center">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                onError={handleImgError}
                alt={`thumb-${i}`}
                className={`w-20 h-24 object-cover rounded-md border-2 cursor-pointer transition-all ${
                  selectedIndex === i
                    ? "border-[#1565c0] scale-105"
                    : "border-gray-300 hover:border-blue-300"
                }`}
                onClick={() => setSelectedIndex(i)}
              />
            ))}
          </div>
        </div>

        {/* RIGHT: Info */}
        <div className="flex flex-col justify-start">
          <p
            onClick={() => window.history.back()}
            className="text-sm text-gray-500 mb-2 cursor-pointer hover:underline"
          >
            ← Back to Products
          </p>

          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            {product.name}
          </h1>

          <div className="flex items-center gap-2 mb-2">
            <div className="flex">{renderStars(product.rating)}</div>
            <span className="text-gray-500 text-sm">
              ({product.reviewCount || 0} reviews)
            </span>
          </div>

          <p className="text-2xl font-semibold text-[#1565c0] mb-2">
            ₹{product.price?.toLocaleString("en-IN")}
          </p>

          <p className="text-sm text-gray-600 mb-3">
            Availability:{" "}
            <span className="font-medium text-green-600">In stock</span>
          </p>

          <p className="text-sm text-gray-600 mb-4">
            Product Code:{" "}
            <span className="font-medium text-gray-800">
              {product._id?.slice(-6).toUpperCase()}
            </span>
          </p>

          <p className="text-gray-700 mb-4 leading-relaxed">
            {product.description}
          </p>

          {/* Sizes */}
          {product.sizes?.length > 0 && (
            <div className="mb-5">
              <h3 className="font-semibold mb-2">Select Size:</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-4 py-2 rounded border text-sm ${
                      selectedSize === s
                        ? "bg-[#1565c0] text-white border-[#1565c0]"
                        : "bg-gray-100 hover:bg-gray-200 border-gray-300"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={handleAddToCart}
              disabled={!selectedSize || isInCart}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white shadow transition-all ${
                !selectedSize || isInCart
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#1565c0] hover:bg-blue-700"
              }`}
            >
              <ShoppingBag size={18} />
              {isInCart ? "In Cart" : "Add to Cart"}
            </button>

            <button
              onClick={handleAddToWishlist}
              disabled={isInWishlist}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white shadow transition-all ${
                isInWishlist
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-pink-500 hover:bg-pink-600"
              }`}
            >
              <Heart size={18} />
              {isInWishlist ? "Wishlisted" : "Add to Wishlist"}
            </button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 mt-12">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        <Review
          productId={id}
          token={token}
          onUpdateRating={(reviews) => {
            if (!reviews || !reviews.length) return;
            const avg =
              reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;
            setProduct((prev) => ({
              ...prev,
              rating: avg,
              reviewCount: reviews.length,
            }));
          }}
        />
      </div>
    </div>
  );
};

export default ProductDetail;
