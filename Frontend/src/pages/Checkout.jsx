import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const BACKEND_URL = "http://localhost:5000/api";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address: { line: "", city: "", state: "", pincode: "" },
  });
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const subtotal = cart.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );
  const shippingFee = 49;
  const total = subtotal + shippingFee;

  const getAuthHeaders = () => {
    const token =
      localStorage.getItem("token") || localStorage.getItem("adminToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Fetch logged-in user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`${BACKEND_URL}/users/me`, {
          headers: getAuthHeaders(),
        });
        setUserData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || { line: "", city: "", state: "", pincode: "" },
        });
      } catch (err) {
        console.warn("Could not fetch user data", err);
      }
    };
    fetchUser();
  }, []);

  // Save phone & address
  const handleSaveUser = async () => {
    try {
      const payload = { phone: userData.phone, address: userData.address };
      await axios.put(`${BACKEND_URL}/users/me`, payload, {
        headers: getAuthHeaders(),
      });
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to save user info";
      toast.error(msg);
      return false;
    }
  };

  // Place order & handle payment
  const placeOrder = async (finalPaymentMethod) => {
    if (!cart.length) {
      toast.error("Your cart is empty");
      return;
    }
    setLoading(true);

    const saved = await handleSaveUser();
    if (!saved) {
      setLoading(false);
      return;
    }

    const items = cart.map((c) => ({
      productId: c.product._id,
      quantity: c.quantity,
    }));

    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/orders`,
        { items, shippingFee, paymentMethod: finalPaymentMethod },
        { headers: getAuthHeaders() }
      );

      const orderId = data.orderId;

      // COD Flow
      if (finalPaymentMethod === "COD") {
        toast.success("Order placed successfully!");
        clearCart();
        navigate(`/order-success/${orderId}`, { replace: true });
        return;
      }

      // Razorpay Flow
      const paymentSession = data.paymentSession;
      if (paymentSession?.type === "razorpay") {
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          toast.error("Failed to load payment gateway. Try again later.");
          setLoading(false);
          return;
        }

        const options = {
          key: paymentSession.key,
          amount: paymentSession.amount, // in paise
          currency: paymentSession.currency,
          name: "FashionHub",
          description: `Order #${orderId}`,
          order_id: paymentSession.order_id,
          prefill: {
            name: userData.name,
            email: userData.email,
            contact: userData.phone?.toString() || "",
          },
          handler: async function (response) {
            try {
              await axios.post(
                `${BACKEND_URL}/orders/verify`,
                {
                  orderId,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                },
                { headers: getAuthHeaders() }
              );
              toast.success("Payment successful!");
              clearCart();
              navigate(`/order-success/${orderId}`, { replace: true });
            } catch (err) {
              console.error("Payment confirm error", err);
              toast.error(
                err.response?.data?.message || "Payment verification failed"
              );
            }
          },
          modal: {
            ondismiss: function () {
              toast.info("Payment popup closed.");
            },
          },
          theme: {
            color: "#121212",
          },
        };

        const rzp = new window.Razorpay(options);

        rzp.on("payment.failed", function (response) {
          console.error("Payment failed:", response);
          toast.error("Payment failed. Try again.");
        });

        rzp.open();
      } else {
        toast.error("Payment integration not configured.");
      }
    } catch (err) {
      console.error("Place order error:", err);
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userData.phone || !userData.address.line || !userData.address.pincode) {
      toast.warn("Please fill in phone and full address.");
      return;
    }
    await placeOrder(paymentMethod);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Checkout</h2>

      {/* Cart Summary */}
      <div className="bg-white shadow rounded p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
        {cart.length === 0 && <p>Your cart is empty</p>}
        {cart.map((item) => (
          <div
            key={item.product._id}
            className="flex items-center justify-between border-b py-3"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.product.mainImage || item.product.images?.[0]}
                alt={item.product.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <p className="font-medium">{item.product.name}</p>
                <p className="text-sm text-gray-500">
                  ₹{item.product.price} × {item.quantity}
                </p>
              </div>
            </div>
            <div className="font-semibold">
              ₹{item.product.price * item.quantity}
            </div>
          </div>
        ))}
        <div className="flex justify-between mt-4 font-semibold">
          <span>Subtotal:</span>
          <span>₹{subtotal}</span>
        </div>
        <div className="flex justify-between mt-1 font-semibold">
          <span>Shipping:</span>
          <span>₹{shippingFee}</span>
        </div>
        <div className="flex justify-between mt-1 font-bold text-lg">
          <span>Total:</span>
          <span>₹{total}</span>
        </div>
      </div>

      {/* Checkout Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow rounded p-6 space-y-6">
        <h3 className="text-xl font-semibold mb-4">Shipping & Payment</h3>

        <div>
          <label className="block font-medium">Phone</label>
          <input
            type="text"
            value={userData.phone}
            onChange={(e) =>
              setUserData({ ...userData, phone: e.target.value })
            }
            className="w-full border p-2 rounded mt-1"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Address</label>
          <input
            type="text"
            placeholder="Street Address"
            value={userData.address.line}
            onChange={(e) =>
              setUserData({
                ...userData,
                address: { ...userData.address, line: e.target.value },
              })
            }
            className="w-full border p-2 rounded mt-1 mb-2"
            required
          />
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="City"
              value={userData.address.city}
              onChange={(e) =>
                setUserData({
                  ...userData,
                  address: { ...userData.address, city: e.target.value },
                })
              }
              className="w-1/2 border p-2 rounded"
            />
            <input
              type="text"
              placeholder="State"
              value={userData.address.state}
              onChange={(e) =>
                setUserData({
                  ...userData,
                  address: { ...userData.address, state: e.target.value },
                })
              }
              className="w-1/2 border p-2 rounded"
            />
          </div>
          <input
            type="text"
            placeholder="Pincode"
            value={userData.address.pincode}
            onChange={(e) =>
              setUserData({
                ...userData,
                address: { ...userData.address, pincode: e.target.value },
              })
            }
            className="w-full border p-2 rounded mt-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full border p-2 rounded mt-1"
          >
            <option value="COD">Cash on Delivery</option>
            <option value="CARD">Card</option>
            <option value="UPI">UPI</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white p-3 rounded disabled:opacity-50"
        >
          {loading ? "Processing..." : "Place Order"}
        </button>
      </form>
    </div>
  );
};

export default Checkout;
