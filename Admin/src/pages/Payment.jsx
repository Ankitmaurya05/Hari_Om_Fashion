import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const API_URL = import.meta.env.VITE_API_URL || "https://hari-om-fashion.onrender.com";
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]; // card, upi, cod, pending

const Payment = () => {
  const [stats, setStats] = useState(null);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [methodFilter, setMethodFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const paymentsPerPage = 5;

  useEffect(() => {
    const fetchPaymentStats = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/admin/payments`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
        });
        setStats(data);
        setFilteredPayments(data.payments);
      } catch (err) {
        console.error("Failed to fetch payment stats:", err);
      }
    };
    fetchPaymentStats();
  }, []);

  useEffect(() => {
    if (!stats) return;

    let filtered = stats.payments;

    if (methodFilter !== "All") {
      filtered = filtered.filter(
        (p) => p.method.toLowerCase() === methodFilter.toLowerCase()
      );
    }

    if (statusFilter !== "All") {
      filtered = filtered.filter(
        (p) => p.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (p) =>
          p.order?._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPayments(filtered);
    setCurrentPage(1); // reset page on filter/search
  }, [methodFilter, statusFilter, searchTerm, stats]);

  if (!stats) return <div className="text-center py-10">Loading...</div>;

  const chartData = [
    { name: "Card", value: stats.stats.card },
    { name: "UPI", value: stats.stats.upi },
    { name: "COD", value: stats.stats.cod },
    { name: "Pending", value: stats.stats.pending },
  ];

  // Pagination logic
  const indexOfLast = currentPage * paymentsPerPage;
  const indexOfFirst = indexOfLast - paymentsPerPage;
  const currentPayments = filteredPayments.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredPayments.length / paymentsPerPage);

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gray-50">
      {/* 🔹 Top Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow text-center">
          <h2 className="text-sm text-gray-500">Products</h2>
          <p className="text-2xl font-bold">{stats.payments.length}</p>
          <p className="mt-1 text-gray-400">Total Items</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow text-center">
          <h2 className="text-sm text-gray-500">Payouts</h2>
          <p className="text-2xl font-bold">₹{stats.stats.totalAmount.toLocaleString("en-IN")}</p>
          <p className="mt-1 text-gray-400">Total Received</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow text-center">
          <h2 className="text-sm text-gray-500">Payments</h2>
          <p className="text-2xl font-bold">{stats.stats.card + stats.stats.upi + stats.stats.cod}</p>
          <p className="mt-1 text-gray-400">Transactions</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow text-center">
          <h2 className="text-sm text-gray-500 mb-2">Payment Overview</h2>
          <PieChart width={150} height={150}>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={60}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </div>
      </div>

      {/* 🔹 Filter & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          <select
            className="border rounded px-3 py-2 shadow focus:outline-none"
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
          >
            <option>All</option>
            <option>Card</option>
            <option>UPI</option>
            <option>COD</option>
            <option>Pending</option>
          </select>
          <select
            className="border rounded px-3 py-2 shadow focus:outline-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All</option>
            <option>Success</option>
            <option>Pending</option>
            <option>Failed</option>
          </select>
        </div>
        <input
          type="text"
          placeholder="Search by order/user"
          className="border rounded px-3 py-2 shadow w-full md:w-1/3 focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* 🔹 Payments Table + Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Table */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow overflow-x-auto">
          <table className="w-full table-auto border-collapse text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border-b">Order ID</th>
                <th className="p-3 border-b">User</th>
                <th className="p-3 border-b">Amount</th>
                <th className="p-3 border-b">Method</th>
                <th className="p-3 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {currentPayments.length ? (
                currentPayments.map((p) => (
                  <tr
                    key={p._id}
                    className="hover:bg-gray-50 cursor-pointer transition"
                    onClick={() => setSelectedPayment(p)}
                  >
                    <td className="p-3 border-b">{p.order?._id || p.order}</td>
                    <td className="p-3 border-b">{p.user ? `${p.user.name}` : "Guest"}</td>
                    <td className="p-3 border-b">₹{p.amount}</td>
                    <td className="p-3 border-b">{p.method}</td>
                    <td
                      className={`p-3 border-b font-semibold ${
                        p.status.toLowerCase() === "success"
                          ? "text-green-600"
                          : p.status.toLowerCase() === "pending"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {p.status}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-3" colSpan={5}>
                    No payments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-center mt-4 gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Payment Detail */}
        <div className="bg-white p-6 rounded-2xl shadow">
          {selectedPayment ? (
            <>
              <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
              <p>
                <span className="font-medium">Order ID: </span>
                {selectedPayment.order?._id || selectedPayment.order}
              </p>
              <p>
                <span className="font-medium">User: </span>
                {selectedPayment.user
                  ? `${selectedPayment.user.name} (${selectedPayment.user.email})`
                  : "Guest"}
              </p>
              <p>
                <span className="font-medium">Amount: </span>₹{selectedPayment.amount}
              </p>
              <p>
                <span className="font-medium">Method: </span>{selectedPayment.method}
              </p>
              <p>
                <span className="font-medium">Status: </span>{selectedPayment.status}
              </p>
            </>
          ) : (
            <p className="text-gray-500">Select a payment to view details</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;
