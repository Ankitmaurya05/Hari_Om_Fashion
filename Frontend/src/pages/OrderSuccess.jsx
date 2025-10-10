import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const OrderSuccess = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchLatestOrder = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/orders/latest", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrder(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("Failed to fetch order details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestOrder();
  }, []);

  if (loading)
    return <p className="p-6 text-center">Loading order details...</p>;

  if (!order)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-yellow-50">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          You have no orders yet!
        </h2>
        <p className="text-gray-600 mb-6">
          Start shopping now to place your first order.
        </p>
        <Link
          to="/shop"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
        >
          Shop Now
        </Link>
      </div>
    );

  const { user, items, total, shippingFee, paymentMethod, status, createdAt } =
    order;

  return (
    <div className="min-h-screen p-6 bg-yellow-50 flex justify-center">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6 space-y-6">
        <h2 className="text-2xl font-bold text-green-600">
          Order Placed Successfully!
        </h2>
        <p className="text-gray-700">Thank you, {user?.name || "Customer"}!</p>
        <p>Order ID: {order._id}</p>
        <p>Status: {status}</p>
        <p>Placed At: {new Date(createdAt).toLocaleString()}</p>

        {/* Shipping Info */}
        <div className="border p-4 rounded space-y-2">
          <h3 className="font-semibold">Shipping Info</h3>
          <p>Name: {user?.name}</p>
          <p>Email: {user?.email}</p>
          <p>Phone: {user?.phone || "N/A"}</p>
          <p>
            Address:{" "}
            {user?.address
              ? `${user.address.line}, ${user.address.city}, ${user.address.state} - ${user.address.pincode}`
              : "N/A"}
          </p>
        </div>

        {/* Items */}
        <div className="border p-4 rounded space-y-2">
          <h3 className="font-semibold">Order Items</h3>
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 border-b py-2"
            >
              <img
                src={item.mainImage || ""}
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <p>{item.name}</p>
                <p>Price: ₹{(item.price || 0).toLocaleString("en-IN")}</p>
                <p>Qty: {item.quantity || 1}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="border p-4 rounded space-y-1 font-semibold text-gray-700">
          <p>Subtotal: ₹{(order.subtotal || 0).toLocaleString("en-IN")}</p>
          <p>Shipping: ₹{(shippingFee || 49).toLocaleString("en-IN")}</p>
          <p>
            Total: ₹{(order.total || 0).toLocaleString("en-IN")}
          </p>
          <p>Payment Method: {paymentMethod}</p>
        </div>

        <Link
          to="/shop"
          className="inline-block mt-4 w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
        >
          Back to Shop
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
