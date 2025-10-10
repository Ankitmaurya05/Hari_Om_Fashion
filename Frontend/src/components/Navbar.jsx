import React, { useState, useEffect, useRef } from "react";
import { NavLink, Link } from "react-router-dom";
import {
  Menu,
  X,
  ShoppingBag,
  Heart,
  User,
  ChevronDown,
  ClipboardList,
} from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const dropdownRef = useRef();
  const { cart } = useCart();
  const { wishlistCount } = useWishlist();

  const categories = [
    { name: "Jeans", path: "/category/jeans" },
    { name: "Kurtis", path: "/category/kurtis" },
    { name: "Gowns", path: "/category/gowns" },
    { name: "Lehenga", path: "/category/lehenga" },
    { name: "Salwar", path: "/category/salwar" },
  ];

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "Categories", dropdown: true },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setCategoriesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-md">
      {/* Top Bar */}
      <div className="hidden md:flex justify-between items-center text-sm bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white py-2 px-10">
        <p>📞 +91 63553 83106</p>
        <p>✨ Hari Om Fashion — Ethnic • Western • Fusion</p>
        <p>📍 Surat, Gujarat</p>
      </div>

      {/* Main Navbar */}
      <nav className="flex justify-between items-center px-5 md:px-12 py-3">
        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-extrabold tracking-wide bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300"
        >
          HariOM<span className="text-pink-500">Fashion</span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-10 text-gray-700 font-medium">
          {navLinks.map((link, i) =>
            link.dropdown ? (
              <li key={i} className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setCategoriesOpen(!categoriesOpen)}
                  className="flex items-center gap-1 px-3 py-2 rounded-md hover:text-pink-500 transition"
                >
                  Categories <ChevronDown size={16} />
                </button>

                {/* Desktop Categories Dropdown */}
                <div
                  className={`absolute left-1/2 -translate-x-1/2 top-[48px] w-[400px] bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border p-5 grid grid-cols-3 gap-4 transition-all duration-300 ${
                    categoriesOpen
                      ? "opacity-100 translate-y-0 visible"
                      : "opacity-0 -translate-y-3 invisible"
                  }`}
                  style={{ zIndex: 9999 }}
                >
                  {categories.map((cat, idx) => (
                    <NavLink
                      key={idx}
                      to={cat.path}
                      className="cursor-pointer text-center text-sm font-semibold text-[#1565c0] hover:text-pink-500 transition"
                      onClick={() => setCategoriesOpen(false)}
                    >
                      {cat.name}
                    </NavLink>
                  ))}
                </div>
              </li>
            ) : (
              <li key={i}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `transition duration-200 pb-1 ${
                      isActive
                        ? "text-pink-500 font-semibold border-b-2 border-pink-500"
                        : "hover:text-pink-500"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              </li>
            )
          )}
        </ul>

        {/* Desktop Icons */}
        <div className="hidden md:flex items-center gap-6 text-[#1565c0]">
          <NavLink to="/wishlist" className="relative hover:text-pink-500 transition">
            <Heart size={22} />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                {wishlistCount}
              </span>
            )}
          </NavLink>

          <NavLink to="/cart" className="relative hover:text-pink-500 transition">
            <ShoppingBag size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                {cartCount}
              </span>
            )}
          </NavLink>

          <NavLink to="/order-success/:orderId" className="hover:text-pink-500 transition">
            <ClipboardList size={22} />
          </NavLink>

          <NavLink to="/account" className="hover:text-pink-500 transition">
            <User size={22} />
          </NavLink>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-[#1565c0] focus:outline-none"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-6 pb-6 shadow-md">
          <ul className="flex flex-col gap-4 mt-3 text-gray-700 font-medium">
            {navLinks.map((link, i) =>
              link.dropdown ? (
                <li key={i}>
                  <p
                    onClick={() => setCategoriesOpen(!categoriesOpen)}
                    className="flex justify-between items-center text-[#1565c0] font-semibold cursor-pointer"
                  >
                    Categories <ChevronDown size={18} />
                  </p>

                  {/* Swipeable Horizontal Categories */}
                  {categoriesOpen && (
                    <div className="mt-3 flex overflow-x-auto gap-4 pb-2">
                      {categories.map((cat, j) => (
                        <NavLink
                          key={j}
                          to={cat.path}
                          onClick={() => {
                            setMenuOpen(false);
                            setCategoriesOpen(false);
                          }}
                          className="flex-shrink-0 px-4 py-2 bg-[#e0e7ff] rounded-xl text-[#1565c0] font-medium hover:bg-pink-100 hover:text-pink-500 transition"
                        >
                          {cat.name}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </li>
              ) : (
                <li key={i}>
                  <NavLink
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `block py-1 ${
                        isActive ? "text-pink-500 font-semibold" : "hover:text-pink-500"
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                </li>
              )
            )}
          </ul>

          {/* Mobile Icons */}
          <div className="flex gap-6 mt-5 border-t pt-3 text-[#1565c0]">
            <NavLink to="/wishlist" onClick={() => setMenuOpen(false)} className="relative">
              <Heart size={22} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center animate-bounce">
                  {wishlistCount}
                </span>
              )}
            </NavLink>
            <NavLink to="/cart" onClick={() => setMenuOpen(false)} className="relative">
              <ShoppingBag size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center animate-bounce">
                  {cartCount}
                </span>
              )}
            </NavLink>
            <NavLink to="/order-success/:orderId" onClick={() => setMenuOpen(false)} className="relative">
              <ClipboardList size={22} />
            </NavLink>
            <NavLink to="/account" onClick={() => setMenuOpen(false)} className="relative">
              <User size={22} />
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
