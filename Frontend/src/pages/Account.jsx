import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Account = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_URL = "https://hari-om-fashion.onrender.com/api/auth/me"; // Backend route to get current user

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first.");
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
        // Optional: store in localStorage for faster reloads
        localStorage.setItem("user", JSON.stringify(res.data.user));
      } catch (err) {
        console.error("Failed to fetch user:", err);
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  if (loading) return <p className="text-center mt-10">Loading account...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-[#1565c0]">
          My Account
        </h1>

        <div className="flex flex-col gap-4 text-gray-700">
          <div>
            <h2 className="font-semibold text-lg">Name</h2>
            <p>{user.name}</p>
          </div>
          <div>
            <h2 className="font-semibold text-lg">Email</h2>
            <p>{user.email}</p>
          </div>
          <div>
            <h2 className="font-semibold text-lg">Total Orders</h2>
            <p>{user.orders || 0}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-8 w-full bg-[#ff80ab] hover:bg-pink-500 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Account;
