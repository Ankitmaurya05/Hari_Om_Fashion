import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaWhatsapp, FaCreditCard } from "react-icons/fa";
import { MdDeliveryDining } from "react-icons/md";
import { RiWalletFill } from "react-icons/ri";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-700 to-pink-500 text-white pt-10 md:pt-16 pb-8 mt-12">
      <div className="container mx-auto px-4 md:px-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">

        {/* Brand Info */}
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-pink-300">
            Hari Om Fashion
          </h2>
          <p className="text-xs md:text-sm">Premium Ladies Wear — Ethnic & Western Collection</p>
          <p className="text-xs md:text-sm">📞 +91 63553 83106</p>
          <p className="text-xs md:text-sm">📍 Lucknow, India</p>
          <div className="flex gap-3 mt-3 text-lg md:text-2xl flex-wrap">
            {[FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaWhatsapp].map((Icon, i) => (
              <a
                key={i}
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-300 transition transform hover:scale-110"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg md:text-xl font-semibold mb-3 border-b border-white pb-1 md:pb-2 w-fit">Quick Links</h3>
          <ul className="space-y-2 text-xs md:text-sm">
            <li><Link to="/" className="hover:text-pink-300 transition">Home</Link></li>
            <li><Link to="/shop" className="hover:text-pink-300 transition">Shop</Link></li>
            <li><Link to="/about" className="hover:text-pink-300 transition">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-pink-300 transition">Contact</Link></li>
          </ul>
        </div>

        {/* Policies */}
        <div>
          <h3 className="text-lg md:text-xl font-semibold mb-3 border-b border-white pb-1 md:pb-2 w-fit">Policies</h3>
          <ul className="space-y-2 text-xs md:text-sm">
            <li><Link to="/return-policy" className="hover:text-pink-300 transition">Return Policy</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-pink-300 transition">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-pink-300 transition">Terms & Conditions</Link></li>
            <li><Link to="/shipping-info" className="hover:text-pink-300 transition">Shipping Info</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="flex flex-col gap-3">
          <h3 className="text-lg md:text-xl font-semibold mb-2 border-b border-white pb-1 md:pb-2 w-fit">Newsletter</h3>
          <p className="text-xs md:text-sm">Subscribe to get latest updates, offers & deals.</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="px-3 py-2 rounded-md sm:rounded-l-md border-none text-black w-full focus:outline-none focus:ring-2 focus:ring-pink-300 transition text-sm"
            />
            <button className="bg-pink-500 px-4 py-2 rounded-md sm:rounded-r-md hover:bg-pink-600 transition text-sm">
              Subscribe
            </button>
          </div>
          <p className="text-xs md:text-sm mt-2">© 2025 Hari Om Fashion. All Rights Reserved.</p>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="container mx-auto px-4 md:px-0 mt-8 md:mt-12 border-t border-white pt-4 flex flex-col sm:flex-row justify-between items-center gap-3 flex-wrap text-xs md:text-sm">
        <p className="font-semibold">We Accept:</p>
        <div className="flex gap-4 sm:gap-6 items-center flex-wrap">
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-md hover:bg-white/20 transition">
            <FaCreditCard size={20} /> <span>Card</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-md hover:bg-white/20 transition">
            <RiWalletFill size={20} /> <span>UPI</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-md hover:bg-white/20 transition">
            <MdDeliveryDining size={20} /> <span>Cash on Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
