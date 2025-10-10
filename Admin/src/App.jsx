// App.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "./pages/Sidebar";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const App = () => {
  const navigate = useNavigate();

  // Check if admin is logged in via token
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem("adminToken");
  });

  // Active tab in dashboard
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("activeTab") || "Products";
  });

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/admin/dashboard");
    }
  }, [isLoggedIn, navigate]);

  // Save activeTab whenever it changes
  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsLoggedIn(false);
    toast.info("Logged out successfully");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />
      {isLoggedIn ? (
        <>
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            handleLogout={handleLogout}
          />
          <main className="flex-1 p-6">
            <AdminDashboard activeTab={activeTab} />
          </main>
        </>
      ) : (
        <div className="flex items-center justify-center w-full h-screen bg-gray-100">
          <AdminLogin setIsLoggedIn={setIsLoggedIn} toast={toast} />
        </div>
      )}
    </div>
  );
};

export default App;
