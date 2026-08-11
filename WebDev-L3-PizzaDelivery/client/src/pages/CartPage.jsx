import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CartItem from "../components/CartItem";
import "../styles/CartPage.css";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  // Load cart from localStorage
  useEffect(() => {
    const savedCart =
      JSON.parse(localStorage.getItem("cart")) || [];

    setCart(savedCart);
  }, []);

  // Update quantity
  const updateQuantity = (id, change) => {
    const updatedCart = cart
      .map((item) => {
        if (item.id === id) {
          return {
            ...item,
            quantity: item.quantity + change,
          };
        }

        return item;
      })
      .filter((item) => item.quantity > 0);

    setCart(updatedCart);

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );
  };

  // Remove item
  const removeItem = (id) => {
    const updatedCart = cart.filter(
      (item) => item.id !== id
    );

    setCart(updatedCart);

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );
  };

  // Calculate subtotal
  const getSubtotal = () => {
    return cart.reduce(
      (total, item) =>
        total + Number(item.price) * item.quantity,
      0
    );
  };

  // Calculate total number of items
  const getItemCount = () => {
    return cart.reduce(
      (total, item) => total + item.quantity,
      0
    );
  };

  // Empty cart
  if (cart.length === 0) {
    return (
      <div className="cart-page empty-cart">
        <div className="empty-cart-content">
          <div className="empty-cart-icon">🛒</div>

          <h1>Your Cart is Empty</h1>

          <p>
            You haven't added any pizzas yet.
          </p>

          <button
            className="browse-menu-btn"
            onClick={() => navigate("/menu")}
          >
            Browse Pizza Menu
          </button>
        </div>
      </div>
    );
  }

  const subtotal = getSubtotal();

  return (
    <div className="cart-page">

      {/* Header */}
      <div className="cart-header">

        <div>
          <span className="cart-badge">
            🛒 YOUR ORDER
          </span>

          <h1>
            Your <span>Cart</span>
          </h1>

          <p>
            Review your pizzas before continuing
            to checkout.
          </p>
        </div>

        <button
          className="back-menu-btn"
          onClick={() => navigate("/menu")}
        >
          ← Continue Shopping
        </button>

      </div>

      {/* Main content */}
      <div className="cart-content">

        {/* Cart items */}
        <section className="cart-items">

          <div className="cart-items-header">
            <h2>
              Your Items
            </h2>

            <span>
              {getItemCount()}{" "}
              {getItemCount() === 1
                ? "item"
                : "items"}
            </span>
          </div>

          {cart.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeItem}
            />
          ))}

        </section>

        {/* Order summary */}
        <aside className="cart-summary">

          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Items</span>

            <span>
              {getItemCount()}
            </span>
          </div>

          <div className="summary-row">
            <span>Subtotal</span>

            <span>
              ₹{subtotal.toFixed(2)}
            </span>
          </div>

          <div className="summary-row">
            <span>Delivery</span>

            <span className="free-delivery">
              Free
            </span>
          </div>

          <hr />

          <div className="summary-total">
            <span>Total</span>

            <strong>
              ₹{subtotal.toFixed(2)}
            </strong>
          </div>

          <button
            className="checkout-btn"
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
          </button>

          <p className="secure-message">
            🔒 Secure checkout
          </p>

        </aside>

      </div>
    </div>
  );
};

export default CartPage;