// Sidebar.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Sidebar = ({ activeTab, setActiveTab, handleLogout }) => {
  const [dateTime, setDateTime] = useState(new Date());
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      toast.warning("Please login first");
      navigate("/admin/login");
    }
  }, [navigate]);

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const links = [
    { name: "Dashboard", icon: "📊" },
    { name: "Payments", icon: "💵" },
    { name: "Products", icon: "🛍️" },
    { name: "Review", icon: "⭐" },
    { name: "Categories", icon: "🏷️" },
    { name: "Orders", icon: "📦" },
    { name: "Users", icon: "👥" },
  ];

  const handleTabChange = (name) => {
    setActiveTab(name);
    localStorage.setItem("activeTab", name); // persist selected tab
  };

  return (
    <aside className="w-64 bg-white shadow-lg flex flex-col min-h-screen border-r border-gray-200">
      {/* Header */}
      <div className="p-5 border-b text-center">
        <h1 className="text-2xl font-bold text-blue-700">Admin Panel</h1>
        <p className="text-sm text-gray-500 mt-1">
          {dateTime.toLocaleDateString()} • {dateTime.toLocaleTimeString()}
        </p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 flex flex-col gap-2">
        {links.map((link) => (
          <button
            key={link.name}
            onClick={() => handleTabChange(link.name)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTab === link.name
                ? "bg-blue-100 text-blue-700 font-semibold shadow-sm scale-[1.02]"
                : "text-gray-700 hover:bg-gray-100 hover:scale-[1.02]"
            }`}
          >
            <span className="text-xl">{link.icon}</span>
            {link.name}
          </button>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold transition-all"
        >
          Logout
        </button>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Admin Dashboard
      </div>
    </aside>
  );
};

export default Sidebar;
