import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";

const allowedCategories = ["jeans", "kurtis", "gowns", "lehenga", "salwar"];

const AdminCatagery = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const API_URL = `${import.meta.env.VITE_API_URL || "https://hari-om-fashion.onrender.com"}/api/products`; // Using env variable

  // Fetch all products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });
      // Ensure we always have an array
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts([]); // Set empty array on error
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    setDeletingId(id);
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });
      setProducts((prev) => (Array.isArray(prev) ? prev.filter((p) => p._id !== id) : []));
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete product. Check backend logs.");
    }
    setDeletingId(null);
  };

  // Filter products by category - ensure products is an array
  const filteredProducts = Array.isArray(products)
    ? category === "All"
      ? products
      : products.filter((p) => p.category?.toLowerCase() === category.toLowerCase())
    : [];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-[#1565c0] mb-6 text-center">
        Admin Product Management
      </h1>

      {/* Category filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {["All", ...allowedCategories].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1 rounded text-sm ${
              category === cat ? "bg-[#1565c0] text-white" : "bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading products...</p>
      ) : filteredProducts.length === 0 ? (
        <p className="text-center text-gray-500">No products found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-[#1565c0] text-white">
              <tr>
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">Product Name</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-left">Price</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <tr key={product._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{product.name}</td>
                  <td className="px-4 py-2">{product.category}</td>
                  <td className="px-4 py-2">₹{product.price}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-600 hover:text-red-800"
                      disabled={deletingId === product._id}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-gray-600">
            Total Products: <strong>{filteredProducts.length}</strong>
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminCatagery;
