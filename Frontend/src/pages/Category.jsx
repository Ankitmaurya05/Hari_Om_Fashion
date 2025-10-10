import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import axios from "axios";

const Category = () => {
  const { name } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = "https://hari-om-fashion.onrender.com/api/products";

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res =
          name.toLowerCase() === "all"
            ? await axios.get(API_URL)
            : await axios.get(`${API_URL}/category/${name.toLowerCase()}`);

        setProducts(res.data || []);
      } catch (err) {
        console.error("❌ Error fetching products:", err.message);
        setProducts([]); // fallback empty if API fails
      }
      setLoading(false);
    };

    fetchProducts();
  }, [name]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        {/* Loader Spinner */}
        <div className="w-14 h-14 border-4 border-blue-400 border-t-pink-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-medium text-gray-600 animate-pulse">
          Loading {name} products...
        </p>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center text-[#1565c0]">
        {name.charAt(0).toUpperCase() + name.slice(1)} Collection
      </h1>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg">
          No products found in this category.
        </p>
      )}
    </div>
  );
};

export default Category;
