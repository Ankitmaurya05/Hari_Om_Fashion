import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";

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
        setProducts([]);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [name]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-14 h-14 border-4 border-blue-400 border-t-pink-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-medium text-gray-600 animate-pulse">
          Loading {name.charAt(0).toUpperCase() + name.slice(1)} products...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/50 to-pink-50 py-10 px-3 sm:px-6 md:px-10">
      {/* Header Section */}
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent drop-shadow-sm">
          {name.charAt(0).toUpperCase() + name.slice(1)} Collection
        </h1>
        <div className="mt-2 h-1 w-24 mx-auto bg-gradient-to-r from-pink-500 to-blue-500 rounded-full"></div>
      </div>

      {/* Products Section */}
      {products.length > 0 ? (
        <div
          className="
            grid 
            gap-6 
            grid-cols-2 
            sm:grid-cols-2 
            md:grid-cols-3 
            lg:grid-cols-4 
            xl:grid-cols-5
          "
        >
          {products.map((product) => (
            <div
              key={product._id}
              className="
                transform 
                hover:scale-[1.02] 
                transition-all 
                duration-300 
                bg-white 
                rounded-2xl 
                shadow-lg 
                hover:shadow-2xl 
                border border-gray-100
              "
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-20">
          <img
            src="https://cdn-icons-png.flaticon.com/512/7486/7486740.png"
            alt="No products"
            className="w-40 h-40 opacity-70 mb-5"
          />
          <p className="text-lg md:text-xl font-semibold text-gray-500">
            No products found in this category.
          </p>
        </div>
      )}
    </div>
  );
};

export default Category;
