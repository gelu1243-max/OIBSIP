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

    try {
      setOrder(JSON.parse(savedOrder));
    } catch (error) {
      console.error("Error reading saved order:", error);
      navigate("/menu");
    }
  }, [navigate]);

  if (!order) {
    return null;
  }

  const paymentStatus =
    order.paymentStatus ||
    order.payment?.status ||
    "PENDING";

  const orderStatus =
    order.status || "PENDING";

  return (
    <div className="order-success-page">

      <div className="order-success-card">

        {/* Success Icon */}
        <div className="success-icon">
          ✓
        </div>

        {/* Heading */}
        <h1>
          Order Placed Successfully!
        </h1>

        <p className="success-message">
          Thank you for your order. Your payment was
          successful and your pizza is now being prepared. 🍕
        </p>


        {/* Order Information */}
        <div className="order-info">

          {/* Order ID */}
          <div className="order-info-row">
            <span>
              Order ID
            </span>

            <strong>
              #{order.id}
            </strong>
          </div>


          {/* Payment Status */}
          <div className="order-info-row">
            <span>
              Payment
            </span>

            <strong
              className={`payment-status payment-${paymentStatus.toLowerCase()}`}
            >
              {paymentStatus}
            </strong>
          </div>


          {/* Order Status */}
          <div className="order-info-row">
            <span>
              Order Status
            </span>

            <strong
              className={`order-status status-${orderStatus.toLowerCase()}`}
            >
              {orderStatus}
            </strong>
          </div>


          {/* Total */}
          <div className="order-info-row">
            <span>
              Total
            </span>

            <strong>
              ₹{Number(order.totalAmount).toFixed(2)}
            </strong>
          </div>

        </div>


        {/* Information message */}
        <div className="order-tracking-message">
          <p>
            🍕 Your order has been received.
          </p>

          <p>
            You can track your order status from
            the My Orders page.
          </p>
        </div>


        {/* Buttons */}
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