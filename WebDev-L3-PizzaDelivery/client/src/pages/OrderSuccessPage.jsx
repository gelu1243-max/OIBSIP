import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/OrderSuccessPage.css";

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const savedOrder = localStorage.getItem("lastOrder");

    if (!savedOrder) {
      navigate("/menu");
      return;
    }

    setOrder(JSON.parse(savedOrder));
  }, [navigate]);

  if (!order) {
    return null;
  }

  return (
    <div className="order-success-page">
      <div className="order-success-card">

        <div className="success-icon">
          ✓
        </div>

        <h1>Order Placed Successfully!</h1>

        <p className="success-message">
          Thank you for your order. Your pizza is being
          prepared and will be delivered soon. 🍕
        </p>

        <div className="order-info">

          <div className="order-info-row">
            <span>Order ID</span>
            <strong>#{order.id}</strong>
          </div>

          <div className="order-info-row">
            <span>Status</span>
            <strong className="order-status">
              {order.status || "PENDING"}
            </strong>
          </div>

          <div className="order-info-row">
            <span>Total</span>
            <strong>
              ₹{Number(order.totalAmount).toFixed(2)}
            </strong>
          </div>

        </div>

        <div className="success-actions">

          <button
            className="view-orders-btn"
            onClick={() => navigate("/orders")}
          >
            View My Orders
          </button>

          <button
            className="continue-shopping-btn"
            onClick={() => navigate("/menu")}
          >
            Continue Shopping
          </button>

        </div>

      </div>
    </div>
  );
};

export default OrderSuccessPage;