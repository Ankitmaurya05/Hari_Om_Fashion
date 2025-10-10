import React from "react";
import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Cart = () => {
  const { cart, loading, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();

  const total = cart.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  if (loading)
    return <p className="text-center mt-10">Loading cart...</p>;

  if (!cart.length)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-yellow-50">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          Your Cart is Empty!
        </h2>
        <p className="text-gray-600 mb-6">
          Start shopping now to place your first order.
        </p>
        <button
          onClick={() => navigate("/shop")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
        >
          Shop Now
        </button>
      </div>
    );

  const handleClearCart = async () => {
    if (!window.confirm("Are you sure you want to clear your cart?")) return;
    try {
      await clearCart();
      toast.dismiss();
      toast.success("Cart cleared!", { toastId: "clear-cart" });
    } catch (err) {
      console.error(err);
      toast.dismiss();
      toast.error("Failed to clear cart", { toastId: "clear-cart-error" });
    }
  };

  const handleRemoveItem = async (productId, size) => {
    try {
      await removeFromCart(productId, size);
      toast.dismiss();
      toast.success("Item removed from cart", { toastId: `remove-${productId}-${size}` });
    } catch (err) {
      console.error(err);
      toast.dismiss();
      toast.error("Failed to remove item", { toastId: `remove-error-${productId}-${size}` });
    }
  };

  const handleUpdateQuantity = async (productId, size, quantity) => {
    if (quantity < 1) return;
    try {
      await updateQuantity(productId, size, quantity);
      // Optional: toast for quantity change if desired
    } catch (err) {
      console.error(err);
      toast.dismiss();
      toast.error("Failed to update quantity", { toastId: `update-error-${productId}-${size}` });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 p-6">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">

        {/* Left Section – Cart Items */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">🛍️ Shopping Bag</h1>
          <p className="text-gray-500 mb-6">{cart.length} item(s) in your bag</p>

          <div className="space-y-6">
            {cart.map((item) => {
              const product = item.product;
              if (!product) return null;

              return (
                <div
                  key={product._id + item.selectedSize}
                  className="flex flex-col md:flex-row justify-between items-center border-b pb-4 last:border-b-0"
                >
                  {/* Product Info */}
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <img
                      src={product.mainImage || "/placeholder.png"}
                      alt={product.name || "Product"}
                      className="w-24 h-24 object-cover rounded-xl border"
                    />
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
                      <p className="text-gray-500">
                        Price: ₹{product.price?.toLocaleString("en-IN") || 0}
                      </p>
                      {item.selectedSize && (
                        <p className="text-sm text-gray-600 mt-1">
                          Size: <span className="font-medium">{item.selectedSize}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col md:flex-row items-center gap-4 mt-4 md:mt-0">
                    <div className="flex items-center bg-gray-100 rounded-lg px-2">
                      <button
                        onClick={() => handleUpdateQuantity(product._id, item.selectedSize, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="px-2 py-1 text-gray-700 hover:text-black disabled:opacity-50"
                      >
                        −
                      </button>
                      <span className="px-3">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(product._id, item.selectedSize, item.quantity + 1)}
                        className="px-2 py-1 text-gray-700 hover:text-black"
                      >
                        +
                      </button>
                    </div>
                    <p className="font-semibold text-gray-800 w-20 text-right">
                      ₹{(product.price * item.quantity).toLocaleString("en-IN")}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-4 md:mt-0">
                    <button
                      onClick={() => handleRemoveItem(product._id, item.selectedSize)}
                      className="text-red-500 hover:text-red-700 font-medium text-sm"
                    >
                      Remove
                    </button>
                    <button
                      onClick={() => navigate(`/product/${product._id}`)}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      View Product
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Section – Summary */}
        <div className="lg:w-1/3 bg-white rounded-2xl shadow-lg p-6 h-fit space-y-4">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Order Summary</h2>

          <div className="space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>₹{total.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>₹49</span>
            </div>
            <div className="flex justify-between text-gray-800 font-semibold border-t pt-3">
              <span>Total</span>
              <span>₹{(total + 49).toLocaleString("en-IN")}</span>
            </div>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="w-full bg-[#1565c0] hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow transition"
          >
            Proceed to Checkout
          </button>

          <button
            onClick={handleClearCart}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl shadow transition"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
