import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Star } from "lucide-react";

const AdminReview = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const API_URL = "https://hari-om-fashion.onrender.com/api/reviews";

  // Fetch all reviews
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setReviews(res.data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Delete review
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    setDeletingId(id);
    try {
      await axios.delete(`${API_URL}/${id}`);
      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Error deleting review:", err);
      alert("Failed to delete review. Check backend logs.");
    }
    setDeletingId(null);
  };

  // Compute average rating
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-[#1565c0] mb-6 text-center">
        Admin Review Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="flex flex-wrap gap-4 justify-center mb-6">
        <div className="bg-white shadow rounded-lg p-4 w-48 text-center">
          <h2 className="text-lg font-semibold text-gray-700">Total Reviews</h2>
          <p className="text-2xl font-bold text-[#1565c0]">{reviews.length}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 w-48 text-center">
          <h2 className="text-lg font-semibold text-gray-700">Average Rating</h2>
          <p className="text-2xl font-bold text-yellow-400 flex items-center justify-center gap-1">
            {averageRating.toFixed(1)}
            <Star size={20} className="inline-block" />
          </p>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-center text-gray-500">No reviews found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-[#1565c0] text-white">
              <tr>
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">Product</th>
                <th className="px-4 py-2 text-left">User</th>
                <th className="px-4 py-2 text-left">Rating</th>
                <th className="px-4 py-2 text-left">Comment</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review, index) => (
                <tr key={review._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{review.product?.name || "Deleted Product"}</td>
                  <td className="px-4 py-2">{review.user}</td>
                  <td className="px-4 py-2">{review.rating} / 5</td>
                  <td className="px-4 py-2">{review.comment}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="text-red-600 hover:text-red-800"
                      disabled={deletingId === review._id}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminReview;
