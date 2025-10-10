// src/pages/Home.jsx
import React, { useEffect, useState, useRef, useCallback, Suspense } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
motion
import {
  ShoppingBag,
  Sparkles,
  ThumbsUp,
  ChevronRight,
  Star,
} from "lucide-react";

const ProductCard = React.lazy(() => import("../components/ProductCard"));

// ---------- Assets ----------
import bn1 from "../assets/banner/bn1.jpg";
import bn2 from "../assets/banner/bn2.jpg";
import jeans from "../assets/catagery/jeans.jpg";
import lahnga from "../assets/catagery/lahnga.jpg";
import growns from "../assets/catagery/growns.jpg";
import kurti from "../assets/catagery/kurti.jpg";
import salwar from "../assets/catagery/salwar.jpg";
// ----------------------------

// ✅ Toast System
const Toasts = ({ toasts, removeToast }) => (
  <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
    {toasts.map((t) => (
      <motion.div
        key={t.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="min-w-[220px] bg-white/95 backdrop-blur-sm border border-pink-100 shadow-lg rounded-xl p-3 flex items-start gap-3"
      >
        <Sparkles className="text-pink-500 mt-1" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-800">{t.title}</p>
          {t.description && (
            <p className="text-xs text-gray-500 mt-1">{t.description}</p>
          )}
        </div>
        <button
          onClick={() => removeToast(t.id)}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </motion.div>
    ))}
  </div>
);

const useToasts = () => {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(1);
  const showToast = useCallback((title, description = "", ttl = 3500) => {
    const id = idRef.current++;
    const toast = { id, title, description };
    setToasts((s) => [toast, ...s]);
    if (ttl > 0)
      setTimeout(() => {
        setToasts((s) => s.filter((t) => t.id !== id));
      }, ttl);
  }, []);
  const removeToast = (id) => setToasts((s) => s.filter((t) => t.id !== id));
  return { toasts, showToast, removeToast };
};

// ✅ Lazy Image
const LazyImage = ({ src, alt, className = "" }) => {
  const ref = useRef();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setVisible(true));
      },
      { rootMargin: "200px" }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className="w-full h-full overflow-hidden bg-gray-100">
      {visible ? (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover ${className}`}
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full animate-pulse" />
      )}
    </div>
  );
};

// Data
const categories = [
  { name: "Jeans", image: jeans },
  { name: "Kurtis", image: kurti },
  { name: "Gowns", image: growns },
  { name: "Lehenga", image: lahnga },
  { name: "Salwar", image: salwar },
];

const reviews = [
  { name: "Priya Sharma", text: "Absolutely love the quality!", rating: 5 },
  { name: "Ananya Gupta", text: "Fast delivery and great support!", rating: 4 },
  { name: "Neha Patel", text: "Perfect fitting & premium fabric!", rating: 5 },
];

const bannerImages = [bn1, bn2];

const Home = () => {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { toasts, showToast, removeToast } = useToasts();

  const API_URL = "https://hari-om-fashion.onrender.com/api/products";

  // Fetch trending
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await axios.get(API_URL);
        const data = res.data?.filter((p) => p.isTrending) || [];
        setTrending(data);
      } catch {
        showToast("Error", "Couldn't load trending products");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  // Auto-slide banner
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((s) => (s + 1) % bannerImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#fff8fb] min-h-screen overflow-hidden">
      <Toasts toasts={toasts} removeToast={removeToast} />

      {/* 🏵 HERO SECTION */}
      <section className="relative max-w-7xl mx-auto px-4 pt-6 md:pt-10">
        <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-lg">
          {bannerImages.map((img, i) => (
            <motion.div
              key={i}
              animate={{
                opacity: i === currentSlide ? 1 : 0,
                zIndex: i === currentSlide ? 10 : 0,
              }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              <LazyImage src={img} alt={`banner-${i}`} />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-pink-200/10 flex items-center">
                <div className="text-white px-6 md:px-12">
                  <h1 className="text-3xl md:text-5xl font-extrabold drop-shadow">
                    Unleash Your Inner Diva
                  </h1>
                  <p className="mt-3 text-sm md:text-base text-white/90 max-w-md">
                    Curated trends, premium fabrics, and exclusive designs — made for you.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      to="/shop"
                      onClick={() => showToast("Loading shop...")}
                      className="inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-600 px-5 py-2 rounded-lg font-semibold shadow text-white transition"
                    >
                      <ShoppingBag size={18} /> Shop Now
                    </Link>
                    <Link
                      to="/shop"
                      className="inline-flex items-center gap-2 bg-white/90 text-pink-600 hover:text-pink-700 px-4 py-2 rounded-lg font-medium transition"
                    >
                      New Arrivals <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 💎 CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 mt-14">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold">Shop by Category</h2>
          <p className="text-gray-500">Find your perfect look</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {categories.map((c) => (
            <Link
              key={c.name}
              to={`/category/${c.name.toLowerCase()}`}
              className="group relative overflow-hidden rounded-2xl shadow hover:shadow-xl transition-transform hover:-translate-y-1 bg-white"
              onClick={() => showToast(`${c.name}`, "Opening category")}
            >
              <LazyImage src={c.image} alt={c.name} className="group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <h3 className="text-white text-xl md:text-2xl font-bold tracking-wide">
                  {c.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ✨ TRENDING PRODUCTS — Redesigned */}
      <section className="max-w-7xl mx-auto px-4 mt-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Sparkles className="text-pink-500" /> Trending Products
          </h2>
          <Link to="/shop" className="text-pink-600 font-medium hover:underline">
            View All
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl h-64 shadow-sm" />
            ))}
          </div>
        ) : trending.length === 0 ? (
          <p className="text-gray-600">No trending products found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {trending.map((p) => (
              <motion.div
                key={p._id}
                whileHover={{ scale: 1.03 }}
                className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 overflow-hidden cursor-pointer transition-all"
              >
                <div className="relative w-full h-48 sm:h-56 overflow-hidden">
                  <img
                    src={p.image || "/placeholder.png"}
                    alt={p.name}
                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-3 sm:p-4">
                  <h3 className="text-sm font-semibold text-gray-800 truncate">
                    {p.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5 capitalize">
                    {p.brand || p.category}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-pink-600 font-semibold text-sm">
                      ₹{p.price}
                    </span>
                    {p.oldPrice && (
                      <span className="text-gray-400 text-xs line-through">
                        ₹{p.oldPrice}
                      </span>
                    )}
                    {p.discount && (
                      <span className="text-green-600 text-xs font-medium">
                        ({p.discount}% OFF)
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 mt-1 text-yellow-500 text-xs">
                    <Star size={12} fill="currentColor" />
                    <span className="text-gray-700">{p.rating || "4.0"}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* 💬 REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 mt-20 mb-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold flex justify-center gap-2">
            <ThumbsUp className="text-pink-500" /> What Our Customers Say
          </h2>
          <p className="text-gray-500 mt-2">Real voices from our happy clients</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              className="bg-white p-6 rounded-2xl shadow-lg"
            >
              <p className="text-gray-700 italic">“{r.text}”</p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-pink-600 font-semibold">{r.name}</span>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} size={14} fill={j < r.rating ? "#facc15" : "none"} />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🚀 CTA */}
      <section className="max-w-7xl mx-auto px-4 mb-24">
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="rounded-3xl bg-gradient-to-r from-pink-500 to-pink-400 text-white p-8 md:p-14 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl"
        >
          <div>
            <h3 className="text-2xl md:text-3xl font-extrabold">
              Ready to Redefine Your Wardrobe?
            </h3>
            <p className="mt-2 text-white/90 max-w-xl">
              Discover new trends, exclusive designs, and luxury comfort — all in one place.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/shop"
              className="bg-white text-pink-600 px-5 py-3 rounded-lg font-semibold shadow hover:scale-[1.02] transition"
            >
              Explore Now
            </Link>
            <Link
              to="/contact"
              className="border border-white/50 px-5 py-3 rounded-lg font-medium hover:bg-white/10 transition"
            >
              Contact Us
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
