import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL; // Using env variable

  // Fetch all orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/admin/orders/all`);
      setOrders(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update order status
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await axios.patch(`${API_URL}/admin/orders/${orderId}/status`, {
        status: newStatus,
      });

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? { ...order, status: res.data.order?.status ?? order.status }
            : order
        )
      );

      toast.success("Order status updated!");
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("Failed to update status");
    }
  };

  // Print order receipt
  const handlePrint = (order) => {
    const printWindow = window.open("", "_blank", "width=800,height=600");
    printWindow.document.write("<html><head><title>Order Receipt</title></head><body>");
    printWindow.document.write(`<h1>Order Receipt</h1>`);
    printWindow.document.write(`<p><strong>Order ID:</strong> ${order._id}</p>`);
    printWindow.document.write(`<p><strong>Status:</strong> ${order.status}</p>`);
    printWindow.document.write(`<p><strong>Placed At:</strong> ${new Date(order.createdAt).toLocaleString()}</p>`);

    printWindow.document.write("<h2>Customer Info</h2>");
    printWindow.document.write(`<p>Name: ${order.user?.name ?? "N/A"}</p>`);
    printWindow.document.write(`<p>Email: ${order.user?.email ?? "N/A"}</p>`);
    printWindow.document.write(`<p>Phone: ${order.user?.phone ?? "N/A"}</p>`);
    printWindow.document.write(
      `<p>Address: ${
        order.user?.address
          ? `${order.user.address.line}, ${order.user.address.city}, ${order.user.address.state} - ${order.user.address.pincode}`
          : "N/A"
      }</p>`
    );

    printWindow.document.write("<h2>Items</h2>");
    order.items.forEach((item) => {
      printWindow.document.write(`<p>${item.name} - Qty: ${item.quantity} - ₹${item.price}</p>`);
    });

    printWindow.document.write(
      `<h3>Total: ₹${(order.total + (order.shippingFee ?? 49)).toLocaleString("en-IN")}</h3>`
    );

    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">All Orders</h1>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white p-4 rounded-xl shadow flex flex-col gap-3">
              {/* Order Header */}
              <div className="flex justify-between items-center">
                <p className="font-semibold">Order ID: {order._id}</p>
                <select
                  value={order.status ?? "Pending"}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Print Receipt Button */}
              <button
                onClick={() => handlePrint(order)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Print Receipt
              </button>

              {/* Customer Info & Items & Summary */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Customer Info</h3>
                  <p>Name: {order.user?.name ?? "N/A"}</p>
                  <p>Email: {order.user?.email ?? "N/A"}</p>
                  <p>Phone: {order.user?.phone ?? "N/A"}</p>
                  <p>
                    Address:{" "}
                    {order.user?.address
                      ? `${order.user.address.line}, ${order.user.address.city}, ${order.user.address.state} - ${order.user.address.pincode}`
                      : "N/A"}
                  </p>
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Items</h3>
                  {order.items?.map((item, idx) => (
                    <div
                      key={item.product?._id || idx}
                      className="flex items-center gap-3 border-b py-2"
                    >
                      <img
                        src={item.mainImage ?? ""}
                        alt={item.name ?? "Product"}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <p>{item.name ?? "N/A"}</p>
                        <p>Price: ₹{(item.price ?? 0).toLocaleString("en-IN")}</p>
                        <p>Qty: {item.quantity ?? 0}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Order Summary</h3>
                  <p>Subtotal: ₹{(order.total ?? 0).toLocaleString("en-IN")}</p>
                  <p>Shipping: ₹{(order.shippingFee ?? 49).toLocaleString("en-IN")}</p>
                  <p>Total: ₹{((order.total ?? 0) + (order.shippingFee ?? 49)).toLocaleString("en-IN")}</p>
                  <p>Payment: {order.paymentMethod ?? "N/A"}</p>
                  <p>Placed At: {order.createdAt ? new Date(order.createdAt).toLocaleString() : "N/A"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
