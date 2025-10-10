import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Star } from "lucide-react";

const Review = ({ productId, token, onUpdateRating }) => {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ user: "", comment: "", rating: 5 });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch Reviews
  const fetchReviews = async () => {
    if (!productId) return;
    setLoading(true);
    try {
      const res = await axios.get(`https://hari-om-fashion.onrender.com/api/reviews/product/${productId}`);
      setReviews(res.data);
      if (onUpdateRating) onUpdateRating(res.data);
    } catch (err) {
      console.error("Fetch Reviews Error:", err);
      toast.error(err.response?.data?.message || "Failed to load reviews");
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  // Render Stars
  const renderStars = (rating, size = 16) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={size}
        className={`${i < Math.round(rating || 0) ? "text-yellow-400" : "text-gray-300"} transition`}
      />
    ));

  // Add Review
  const handleAddReview = async () => {
    if (!token) return toast.info("Please log in to add a review");
    if (!form.user.trim() || !form.comment.trim())
      return toast.error("Please fill in all fields");

    try {
      setSubmitting(true);
      await axios.post(
        `https://hari-om-fashion.onrender.com/api/reviews/${productId}`,
        {
          user: form.user.trim(),
          comment: form.comment.trim(),
          rating: form.rating,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Review added successfully!");
      setForm({ user: "", comment: "", rating: 5 });
      fetchReviews();
    } catch (err) {
      console.error("Add Review Error:", err);
      toast.error(err.response?.data?.message || "Failed to add review");
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate Rating Breakdown
  const ratingCount = [5, 4, 3, 2, 1].map(
    (r) => reviews.filter((rev) => rev.rating === r).length
  );
  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
      : 0;

  return (
    <div className="mt-10 bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Reviews</h2>

      {/* Top Summary */}
      <div className="flex flex-col md:flex-row md:justify-between gap-6 mb-6">
        {/* Average Rating */}
        <div className="flex flex-col items-center border p-4 rounded-xl w-full md:w-1/3 bg-gray-50">
          <span className="text-3xl font-bold">{avgRating}</span>
          <div className="flex mt-1">{renderStars(avgRating)}</div>
          <span className="text-gray-500 text-sm mt-1">{totalReviews} reviews</span>
        </div>

        {/* Rating Breakdown */}
        <div className="flex flex-col justify-center gap-2 w-full md:w-2/3">
          {[5, 4, 3, 2, 1].map((r, idx) => (
            <div key={r} className="flex items-center gap-2">
              <span className="w-10 text-sm">{r} star</span>
              <div className="flex-1 bg-gray-200 h-2 rounded">
                <div
                  className="bg-yellow-400 h-2 rounded"
                  style={{ width: `${(ratingCount[idx] / totalReviews) * 100 || 0}%` }}
                ></div>
              </div>
              <span className="w-8 text-sm text-gray-600">{ratingCount[idx]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Review List */}
      <div className="mb-6 max-h-[320px] overflow-y-auto space-y-4">
        {loading ? (
          <p className="text-center text-gray-500 animate-pulse">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-center text-gray-500">No reviews yet</p>
        ) : (
          reviews.map((rev) => (
            <div
              key={rev._id}
              className="flex items-start gap-4 p-4 border rounded-xl bg-gray-50 hover:shadow-md transition"
            >
              {/* Avatar */}
              <div
                className="w-12 h-12 flex items-center justify-center rounded-full text-white font-bold text-lg"
                style={{
                  backgroundColor: `hsl(${rev.user.charCodeAt(0) * 15 % 360}, 70%, 50%)`,
                }}
              >
                {rev.user[0].toUpperCase()}
              </div>
              {/* Content */}
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800">{rev.user}</span>
                  <div className="flex">{renderStars(rev.rating)}</div>
                </div>
                <p className="text-gray-700 mt-1">{rev.comment}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(rev.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Review Form */}
      <div className="bg-gray-50 p-5 rounded-xl shadow-inner">
        <h3 className="font-semibold mb-3">Add Your Review</h3>
        <input
          type="text"
          placeholder="Your Name"
          value={form.user}
          onChange={(e) => setForm({ ...form, user: e.target.value })}
          className="w-full border border-gray-300 p-3 rounded-lg mb-3 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
        />
        <textarea
          placeholder="Your Comment"
          value={form.comment}
          onChange={(e) => setForm({ ...form, comment: e.target.value })}
          className="w-full border border-gray-300 p-3 rounded-lg mb-3 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
        />
        <select
          value={form.rating}
          onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
          className="w-full border border-gray-300 p-3 rounded-lg mb-3 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
        >
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r} Star{r > 1 ? "s" : ""}
            </option>
          ))}
        </select>
        <button
          onClick={handleAddReview}
          disabled={submitting}
          className={`w-full py-3 rounded-lg text-white font-semibold transition ${
            submitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-700 to-pink-500 hover:from-pink-500 hover:to-blue-700 shadow-lg"
          }`}
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </div>
    </div>
  );
};

export default Review;
