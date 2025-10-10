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

  const API_URL = "http://localhost:5000/api/products";

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
    <div className="flex flex-col md:flex-row min-h-screen bg-[#fff9fb]">
      {/* Sidebar */}
      <aside className="w-full md:w-1/5 bg-white border-r border-pink-100 px-6 py-8 md:sticky md:top-0 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-6 tracking-wide border-b pb-3 border-pink-200">
          Filters
        </h2>

        {/* Category Filter */}
        <div className="flex flex-col gap-3 mb-6">
          <h3 className="text-sm font-bold text-gray-700 uppercase">Category</h3>
          {["All", "Jeans", "Kurtis", "Gowns", "Lehenga", "Salwar"].map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`text-left text-sm transition-all duration-300 rounded-md px-2 py-1 ${
                  category === cat
                    ? "bg-pink-100 text-pink-600 font-semibold shadow-inner"
                    : "text-gray-600 hover:text-pink-500 hover:bg-pink-50"
                }`}
              >
                {cat}
              </button>
            )
          )}
        </div>

        {/* Price Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-gray-700 uppercase mb-3">
            Price Range
          </h3>
          <div className="flex flex-col gap-2 text-sm">
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
                className={`text-left px-2 py-1 rounded-md transition-all ${
                  priceRange[0] === p.range[0] &&
                  priceRange[1] === p.range[1]
                    ? "bg-pink-100 text-pink-600 font-semibold shadow-inner"
                    : "text-gray-600 hover:text-pink-500 hover:bg-pink-50"
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
                className={`px-3 py-1 rounded-full border text-sm transition-all ${
                  size === s
                    ? "bg-pink-500 text-white border-pink-500 shadow-lg"
                    : "border-gray-300 text-gray-700 hover:border-pink-400 hover:text-pink-500"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b pb-4 border-pink-100">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest">
              Women &gt; {category}
            </p>
            <h1 className="text-3xl font-bold mt-1 text-gray-900">
              {category === "All" ? "All Products" : category}
            </h1>
          </div>

          <div className="flex flex-wrap gap-3 mt-4 sm:mt-0">
            <select className="border border-pink-200 bg-white rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-pink-300 outline-none">
              <option>Sort by</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
            <select
              className="border border-pink-200 bg-white rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-pink-300 outline-none"
              value={size}
              onChange={(e) => setSize(e.target.value)}
            >
              <option value="All">Size</option>
              {["XS", "S", "M", "L", "XL", "XXL"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
