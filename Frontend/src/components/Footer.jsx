import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaWhatsapp, FaCreditCard } from "react-icons/fa";
import { MdDeliveryDining } from "react-icons/md";
import { RiWalletFill } from "react-icons/ri"; // Wallet icon for UPI

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-700 to-pink-500 text-white pt-16 pb-8 mt-12">
      <div className="container mx-auto px-6 md:px-0 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Brand Info */}
        <div>
          <h2 className="text-3xl font-bold mb-3 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-white to-pink-300">
            Hari Om Fashion
          </h2>
          <p className="mb-2">Premium Ladies Wear — Ethnic & Western Collection</p>
          <p className="mb-2">📞 +91 63553 83106</p>
          <p>📍 Lucknow, India</p>
          <div className="flex gap-4 mt-4 text-xl">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-300 transition">
              <FaFacebookF />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-300 transition">
              <FaInstagram />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-300 transition">
              <FaTwitter />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-300 transition">
              <FaYoutube />
            </a>
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="hover:text-green-300 transition">
              <FaWhatsapp />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4 border-b border-white pb-2 w-fit">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-pink-300 transition">Home</Link></li>
            <li><Link to="/shop" className="hover:text-pink-300 transition">Shop</Link></li>
            <li><Link to="/about" className="hover:text-pink-300 transition">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-pink-300 transition">Contact</Link></li>
            <li><Link to="/blog" className="hover:text-pink-300 transition">Blog</Link></li>
          </ul>
        </div>

        {/* Policies */}
        <div>
          <h3 className="text-xl font-semibold mb-4 border-b border-white pb-2 w-fit">Policies</h3>
          <ul className="space-y-2">
            <li><Link to="/return-policy" className="hover:text-pink-300 transition">Return Policy</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-pink-300 transition">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-pink-300 transition">Terms & Conditions</Link></li>
            <li><Link to="/shipping-info" className="hover:text-pink-300 transition">Shipping Info</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-xl font-semibold mb-4 border-b border-white pb-2 w-fit">Newsletter</h3>
          <p className="mb-3">Subscribe to get latest updates, offers & deals.</p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Your email address"
              className="px-3 py-2 rounded-l-md border-none text-black w-full focus:outline-none"
            />
            <button className="bg-pink-500 px-4 py-2 rounded-r-md hover:bg-pink-600 transition">
              Subscribe
            </button>
          </div>
          <p className="text-sm mt-4">© 2025 Hari Om Fashion. All Rights Reserved.</p>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="container mx-auto px-6 md:px-0 mt-12 border-t border-white pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-semibold">We Accept:</p>
        <div className="flex gap-6 items-center">
          <div className="flex items-center gap-2">
            <FaCreditCard size={24} /> <span>Card</span>
          </div>
          <div className="flex items-center gap-2">
            <RiWalletFill size={24} /> <span>UPI</span>
          </div>
          <div className="flex items-center gap-2">
            <MdDeliveryDining size={24} /> <span>Cash on Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
