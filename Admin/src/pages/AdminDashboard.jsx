import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

import AdminProducts from "./ProductAdmin";
import AdminReview from "./AdminReview";
import AdminCatagery from "./AdminCatagery";
import AdminUsers from "./Users";
import AdminOrders from "./Orders";
import Payment from "./Payment";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const AdminDashboard = ({ activeTab = "" }) => {
  const [counts, setCounts] = useState({
    totalProducts: 0,
    totalReviews: 0,
    totalUsers: 0,
  });
  const [loadingCounts, setLoadingCounts] = useState(true);
  const [paymentData, setPaymentData] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(true);

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL; // Env variable

  // Redirect if no token
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      toast.warning("Please login to access dashboard");
      navigate("/admin/login");
    }
  }, [navigate]);

  // Fetch counts
  const fetchCounts = async () => {
    setLoadingCounts(true);
    try {
      const res = await axios.get(`${API_URL}/dashboard/counts`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });
      setCounts(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard counts");
    }
    setLoadingCounts(false);
  };

  // Fetch payment data
  const fetchPayments = async () => {
    setLoadingPayments(true);
    try {
      const res = await axios.get(`${API_URL}/dashboard/payments`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });

      const data = [
        { method: "COD", count: res.data.cod || 0 },
        { method: "Card", count: res.data.card || 0 },
        { method: "UPI", count: res.data.upi || 0 },
        { method: "Pending", count: res.data.pending || 0 },
      ];

      setPaymentData(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load payment data");
    }
    setLoadingPayments(false);
  };

  useEffect(() => {
    fetchCounts();
    fetchPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "Products":
        return <AdminProducts />;
      case "Review":
        return <AdminReview />;
      case "Categories":
        return <AdminCatagery />;
      case "Users":
        return <AdminUsers />;
      case "Orders":
        return <AdminOrders />;
      case "Payments":
        return <Payment />;
      default:
        return (
          <div className="space-y-8">
            {/* Overview Cards */}
            <div className="grid grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition text-center">
                <h2 className="text-gray-500 font-medium">Total Products</h2>
                <p className="text-3xl font-bold mt-2">
                  {loadingCounts ? "..." : counts.totalProducts}
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition text-center">
                <h2 className="text-gray-500 font-medium">Total Reviews</h2>
                <p className="text-3xl font-bold mt-2">
                  {loadingCounts ? "..." : counts.totalReviews}
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition text-center">
                <h2 className="text-gray-500 font-medium">Total Users</h2>
                <p className="text-3xl font-bold mt-2">
                  {loadingCounts ? "..." : counts.totalUsers}
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition text-center">
                <h2 className="text-gray-500 font-medium">Pending Orders</h2>
                <p className="text-3xl font-bold mt-2">0</p>
              </div>
            </div>

            {/* Payments Overview */}
            <div className="bg-white p-6 rounded-xl shadow mt-6">
              <h2 className="text-xl font-semibold mb-4">Payments Overview</h2>
              {loadingPayments ? (
                <p>Loading chart...</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={paymentData}
                      dataKey="count"
                      nameKey="method"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {paymentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        );
    }
  };

  return <main className="flex-1 p-8 bg-gray-100 min-h-screen">{renderContent()}</main>;
};

export default AdminDashboard;
