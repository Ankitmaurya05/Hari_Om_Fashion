import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import axios from "axios";
import { SlidersHorizontal } from "lucide-react";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [category, setCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [size, setSize] = useState("All");
  const [showFilters, setShowFilters] = useState(false); // mobile toggle

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
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-pink-50">
        <div className="w-12 h-12 border-4 border-pink-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading products...</p>
      </div>
    );

  return (
    <div className="bg-[#fff9fb] min-h-screen flex flex-col md:flex-row">
      {/* Sidebar / Filters */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-4/5 max-w-xs bg-white shadow-md transform transition-transform duration-300 md:static md:translate-x-0 md:w-64 border-r border-gray-200
        ${showFilters ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-5 flex justify-between items-center border-b border-gray-200 md:hidden">
          <h2 className="text-lg font-semibold text-gray-700">Filters</h2>
          <button
            onClick={() => setShowFilters(false)}
            className="text-pink-500 font-semibold"
          >
            ✕
          </button>
        </div>

        <div className="p-6 flex flex-col gap-8 overflow-y-auto h-full">
          {/* Category Filter */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 uppercase mb-3">
              Category
            </h3>
            <div className="flex flex-wrap gap-2">
              {["All", "Jeans", "Kurtis", "Gowns", "Lehenga", "Salwar"].map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-1.5 rounded-full border text-sm transition-all ${
                      category === cat
                        ? "bg-pink-500 text-white border-pink-500 shadow-md"
                        : "border-gray-300 text-gray-700 hover:border-pink-400 hover:text-pink-500"
                    }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 uppercase mb-3">
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
                  className={`px-3 py-1.5 rounded-full border text-sm transition-all ${
                    priceRange[0] === p.range[0] && priceRange[1] === p.range[1]
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
            <h3 className="text-sm font-bold text-gray-700 uppercase mb-3">
              Size
            </h3>
            <div className="flex flex-wrap gap-2">
              {["All", "XS", "S", "M", "L", "XL", "XXL"].map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`px-3 py-1.5 rounded-full border text-sm transition-all ${
                    size === s
                      ? "bg-pink-500 text-white border-pink-500 shadow-md"
                      : "border-gray-300 text-gray-700 hover:border-pink-400 hover:text-pink-500"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for Mobile */}
      {showFilters && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={() => setShowFilters(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        {/* Header / Filter Toggle */}
        <div className="flex justify-between items-center mb-4 md:hidden">
          <h1 className="text-xl font-semibold text-gray-800">Shop</h1>
          <button
            onClick={() => setShowFilters(true)}
            className="flex items-center gap-2 text-pink-600 border border-pink-400 px-3 py-1.5 rounded-full text-sm font-medium"
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>
        </div>

        {/* Active Filters */}
        <div className="flex flex-wrap gap-2 mb-5">
          {category !== "All" && (
            <span className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-sm flex items-center gap-1">
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
            <span className="px-3 py-1 bg-pink-50 text-pink-600 rounded-full text-sm flex items-center gap-1">
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center mt-10">
            <p className="text-gray-500 text-lg">No products found.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Shop;
