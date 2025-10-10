import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import axios from "axios";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [category, setCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [size, setSize] = useState("All");
  const [showFilters, setShowFilters] = useState(false); // Mobile toggle

  const API_URL = "https://hari-om-fashion.onrender.com/api/products";

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(API_URL);
        setProducts(res.data);
      } catch (err) {
        console.error("❌ Backend error:", err.message);
        setProducts([]);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  // Filter Logic
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      category === "All" || p.category?.toLowerCase() === category.toLowerCase();
    const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
    const matchesSize = size === "All" || (p.sizes && p.sizes.includes(size));
    return matchesCategory && matchesPrice && matchesSize;
  });

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-pink-400 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-medium text-gray-600 animate-pulse">
          Loading products...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#fff9fb]">
      {/* Mobile Filter Toggle */}
      <div className="md:hidden px-4 py-3 bg-white border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-700">Filters</h2>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="text-pink-500 font-semibold"
        >
          {showFilters ? "Close" : "Show"}
        </button>
      </div>

      {/* Filters */}
      <div
        className={`${
          showFilters ? "block" : "hidden"
        } md:flex flex-col md:flex-row md:w-1/5 bg-white md:sticky md:top-0 px-4 py-6 md:px-6 md:py-8 border-b md:border-b-0 md:border-r border-gray-200 md:h-screen`}
      >
        <div className="flex flex-col gap-5 md:gap-6 w-full">
          {/* Category Filter */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 uppercase mb-2">
              Category
            </h3>
            <div className="flex flex-wrap gap-2">
              {["All", "Jeans", "Kurtis", "Gowns", "Lehenga", "Salwar"].map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-1 rounded-full border text-sm transition-all ${
                      category === cat
                        ? "bg-pink-500 text-white border-pink-500 shadow"
                        : "border-gray-300 text-gray-700 hover:border-pink-400 hover:text-pink-500"
                    }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Price Filter */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 uppercase mb-2">
              Price Range
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Under ₹500", range: [0, 500] },
                { label: "₹500 - ₹1000", range: [500, 1000] },
                { label: "₹1000 - ₹3000", range: [1000, 3000] },
                { label: "₹3000 - ₹5000", range: [3000, 5000] },
                { label: "₹5000+", range: [5000, 100000] },
              ].map((p) => (
                <button
                  key={p.label}
                  onClick={() => setPriceRange(p.range)}
                  className={`px-3 py-1 rounded-full border text-sm transition-all ${
                    priceRange[0] === p.range[0] &&
                    priceRange[1] === p.range[1]
                      ? "bg-pink-100 text-pink-600 font-semibold shadow"
                      : "border-gray-300 text-gray-700 hover:border-pink-400 hover:text-pink-500"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 uppercase mb-2">
              Size
            </h3>
            <div className="flex flex-wrap gap-2">
              {["All", "XS", "S", "M", "L", "XL", "XXL"].map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`px-3 py-1 rounded-full border text-sm transition-all ${
                    size === s
                      ? "bg-pink-500 text-white border-pink-500 shadow"
                      : "border-gray-300 text-gray-700 hover:border-pink-400 hover:text-pink-500"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-4 py-6 md:pl-6 md:flex-1">
        {/* Active Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          {category !== "All" && (
            <span className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-sm font-medium flex items-center gap-1">
              {category}
              <button
                onClick={() => setCategory("All")}
                className="hover:text-red-500 ml-1"
              >
                ×
              </button>
            </span>
          )}
          {size !== "All" && (
            <span className="px-3 py-1 bg-pink-50 text-pink-600 rounded-full text-sm font-medium flex items-center gap-1">
              {size}
              <button
                onClick={() => setSize("All")}
                className="hover:text-red-500 ml-1"
              >
                ×
              </button>
            </span>
          )}
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-10 text-lg">
            No products found.
          </p>
        )}
      </main>
    </div>
  );
};

export default Shop;
