import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CheckoutPage.css";

const CheckoutPage = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedCart =
      JSON.parse(localStorage.getItem("cart")) || [];

    setCart(savedCart);

    // If cart is empty, go back to cart
    if (savedCart.length === 0) {
      navigate("/cart");
    }
  }, [navigate]);

  const subtotal = cart.reduce(
    (total, item) =>
      total + Number(item.price) * item.quantity,
    0
  );

  const delivery = 0;

  const total = subtotal + delivery;

  const handlePlaceOrder = async () => {
    const token = localStorage.getItem("token");

    // Make sure user is logged in
    if (!token) {
      setError("Please login before placing your order.");
      return;
    }

    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Convert cart items into the format
      // expected by your backend
      const items = cart.map((item) => ({
        pizzaId: item.id,
        quantity: item.quantity,
      }));

      const response = await fetch(
        "http://localhost:5000/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            items,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to place order."
        );
      }

      console.log("Order created:", data);

      // Clear cart after successful order
      localStorage.removeItem("cart");

      // Save order for confirmation page
      localStorage.setItem(
        "lastOrder",
        JSON.stringify(data)
      );

      // Go to order confirmation
      navigate("/order-success");
    } catch (error) {
      console.error("Order error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">

      {/* Header */}
      <div className="checkout-header">
        <span className="checkout-badge">
          🧾 CHECKOUT
        </span>

        <h1>
          Complete Your <span>Order</span>
        </h1>

        <p>
          Review your order before placing it.
        </p>
      </div>

      <div className="checkout-container">

        {/* Order Items */}
        <section className="checkout-items">

          <h2>Your Order</h2>

          {cart.map((item) => (
            <div
              className="checkout-item"
              key={item.id}
            >

              <img
                src={item.imageUrl}
                alt={item.name}
              />

              <div className="checkout-item-info">
                <h3>{item.name}</h3>

                <p>
                  ₹{Number(item.price).toFixed(2)}
                </p>

                <span>
                  Quantity: {item.quantity}
                </span>
              </div>

              <strong>
                ₹
                {(
                  Number(item.price) *
                  item.quantity
                ).toFixed(2)}
              </strong>

            </div>
          ))}

        </section>

        {/* Summary */}
        <section className="checkout-summary">

          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Items</span>
            <strong>
              {cart.reduce(
                (total, item) =>
                  total + item.quantity,
                0
              )}
            </strong>
          </div>

          <div className="summary-row">
            <span>Subtotal</span>

            <strong>
              ₹{subtotal.toFixed(2)}
            </strong>
          </div>

          <div className="summary-row">
            <span>Delivery</span>

            <strong className="free">
              Free
            </strong>
          </div>

          <hr />

          <div className="summary-total">
            <span>Total</span>

            <strong>
              ₹{total.toFixed(2)}
            </strong>
          </div>

          {error && (
            <div className="checkout-error">
              {error}
            </div>
          )}

          <button
            className="place-order-btn"
            onClick={handlePlaceOrder}
            disabled={loading}
          >
            {loading
              ? "Placing Order..."
              : "Place Order"}
          </button>

          <button
            className="back-cart-btn"
            onClick={() => navigate("/cart")}
          >
            ← Back to Cart
          </button>

        </section>

      </div>
    </div>
  );
};

export default CheckoutPage;