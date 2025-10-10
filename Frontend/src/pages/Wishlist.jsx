import React from "react";
import { useWishlist } from "../contexts/WishlistContext";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
  const { wishlist, loading, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();

  if (loading) return <p className="text-center mt-10">Loading wishlist...</p>;
  if (!wishlist.length) return <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-yellow-50">
    <h2 className="text-2xl font-bold text-gray-700 mb-4">
      Your Wishlist is Empty!
    </h2>
    <p className="text-gray-600 mb-6">
      Start shopping now to place your first order.
    </p>
    <button
      onClick={() => navigate("/shop")}
      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
    >
      Shop Now
    </button>
  </div>;;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {wishlist.map((item) => {
          const product = item.product;
          if (!product) return null; // skip if product is null

          return (
            <div key={product._id} className="flex gap-4 border rounded p-4 shadow">
              <img
                src={product.mainImage || "/placeholder.png"}
                alt={product.name || "Product"}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="font-semibold">{product.name || "Unnamed Product"}</h2>
                  <p>₹{product.price || 0}</p>
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => removeFromWishlist(product._id)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                  <button
                    onClick={() => navigate(`/product/${product._id}`)}
                    className="text-blue-600"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;
