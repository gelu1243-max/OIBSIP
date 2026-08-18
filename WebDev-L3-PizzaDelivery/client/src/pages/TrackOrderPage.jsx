import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/TrackOrderPage.css";

const TrackOrderPage = () => {
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLatestOrder = async () => {
    const token = localStorage.getItem("token");

    // No token
   if (!token) {
  sessionStorage.setItem(
    "redirectAfterLogin",
    "/track-order"
  );

  navigate("/menu");
  return;
}

    try {
      const response = await fetch(
        "http://localhost:5000/api/my-orders",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      // --------------------------------
      // INVALID / EXPIRED TOKEN
      // --------------------------------
      if (response.status === 401) {
  localStorage.removeItem("token");

  sessionStorage.setItem(
    "redirectAfterLogin",
    "/track-order"
  );

  navigate("/menu");

  return;
}

      // Other backend errors
      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load order."
        );
      }

      // --------------------------------
      // NO ORDERS
      // --------------------------------
      if (!data || data.length === 0) {
        setOrder(null);
        setError("");
        return;
      }

      // --------------------------------
      // FIND LATEST ORDER
      // --------------------------------
      const latestOrder = [...data].sort(
        (a, b) => b.id - a.id
      )[0];

      setOrder(latestOrder);
      setError("");

    } catch (error) {
      console.error("Error fetching order:", error);

      setError(
        error.message || "Failed to load your order."
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------
  // FETCH + POLLING
  // --------------------------------
  useEffect(() => {
    fetchLatestOrder();

    const interval = setInterval(() => {
      fetchLatestOrder();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // --------------------------------
  // LOADING
  // --------------------------------
  if (loading) {
    return (
      <div className="track-loading">

        <div className="track-loading-icon">
          🍕
        </div>

        <h2>
          Loading your order...
        </h2>

        <p>
          We're checking the latest order status.
        </p>

      </div>
    );
  }

  // --------------------------------
  // ERROR
  // --------------------------------
  if (error) {
    return (
      <div className="track-error">

        <div className="track-error-icon">
          ⚠️
        </div>

        <h2>
          {error.includes("session")
            ? "Please Login Again"
            : "Something went wrong"}
        </h2>

        <p>
          {error}
        </p>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/menu");
          }}
        >
          Login / Back to Menu
        </button>

      </div>
    );
  }

  // --------------------------------
  // NO ORDERS
  // --------------------------------
  if (!order) {
    return (
      <div className="track-empty">

        <div className="track-empty-icon">
          🍕
        </div>

        <h1>
          No Orders Yet
        </h1>

        <p>
          You haven't placed an order yet.
        </p>

        <button
          onClick={() => navigate("/menu")}
        >
          Browse Pizza Menu
        </button>

      </div>
    );
  }

  // --------------------------------
  // CURRENT STATUS
  // --------------------------------

  const status =
    order.status?.toUpperCase() || "PENDING";

  const statusSteps = [
    {
      key: "PENDING",
      title: "Order Received",
      description:
        "Your order has been received.",
      icon: "📋",
    },
    {
      key: "IN_KITCHEN",
      title: "In Kitchen",
      description:
        "Your pizza is being prepared.",
      icon: "👨‍🍳",
    },
    {
      key: "SENT_TO_DELIVERY",
      title: "Sent to Delivery",
      description:
        "Your pizza is on the way!",
      icon: "🚗",
    },
    {
      key: "DELIVERED",
      title: "Delivered",
      description:
        "Your pizza has been delivered.",
      icon: "🎉",
    },
  ];

  const statusIndex = statusSteps.findIndex(
    (step) => step.key === status
  );

  const currentIndex =
    statusIndex === -1 ? 0 : statusIndex;

  // --------------------------------
  // STATUS MESSAGES
  // --------------------------------

  const statusMessages = {
    PENDING:
      "Your order has been received and is waiting to be prepared.",

    IN_KITCHEN:
      "Your pizza is being freshly prepared. 🍕",

    SENT_TO_DELIVERY:
      "Your pizza is on the way! 🚗",

    DELIVERED:
      "Your pizza has been delivered. Enjoy! 🎉",
  };

  return (
    <div className="track-order-page">

      {/* HEADER */}
      <section className="track-header">

        <span className="track-badge">
          📦 ORDER TRACKING
        </span>

        <h1>
          Track Your <span>Pizza</span>
        </h1>

        <p>
          Follow your order from our kitchen
          to your door.
        </p>

      </section>


      {/* ORDER SUMMARY */}
      <section className="track-order-summary">

        <div>
          <span className="track-order-label">
            ORDER
          </span>

          <h2>
            #{order.id}
          </h2>
        </div>

        <div className="track-summary-right">

          <div>
            <span>
              Total
            </span>

            <strong>
              ₹{Number(order.totalAmount).toFixed(2)}
            </strong>
          </div>

          <div>
            <span>
              Payment
            </span>

            <strong className="payment-success">
              {order.payment?.status || "SUCCESS"}
            </strong>
          </div>

        </div>

      </section>


      {/* TRACKING TIMELINE */}
      <section className="tracking-card">

        <h2>
          Order Progress
        </h2>

        <div className="tracking-timeline">

          {statusSteps.map((step, index) => {

            const isCompleted =
              index < currentIndex;

            const isCurrent =
              index === currentIndex;

            return (
              <div
                className={`tracking-step ${
                  isCompleted
                    ? "completed"
                    : ""
                } ${
                  isCurrent
                    ? "current"
                    : ""
                }`}
                key={step.key}
              >

                <div className="tracking-step-indicator">

                  <span>
                    {isCompleted
                      ? "✓"
                      : step.icon}
                  </span>

                </div>

                <div className="tracking-step-content">

                  <h3>
                    {step.title}

                    {isCurrent && (
                      <span className="current-label">
                        CURRENT
                      </span>
                    )}
                  </h3>

                  <p>
                    {step.description}
                  </p>

                </div>

              </div>
            );
          })}

        </div>

      </section>


      {/* CURRENT STATUS */}
      <section className="current-status-card">

        <div className="current-status-icon">

          {status === "PENDING" && "📋"}

          {status === "IN_KITCHEN" && "👨‍🍳"}

          {status === "SENT_TO_DELIVERY" && "🚗"}

          {status === "DELIVERED" && "🎉"}

        </div>

        <div>

          <span>
            CURRENT STATUS
          </span>

          <h2>
            {statusSteps[currentIndex]?.title}
          </h2>

          <p>
            {statusMessages[status]}
          </p>

        </div>

      </section>


      {/* ORDER ITEMS */}
      <section className="tracked-items">

        <h2>
          Your Order
        </h2>

        {order.items?.map((item) => {

          const pizza =
            item.pizza || item.customPizza;

          return (
            <div
              className="tracked-item"
              key={item.id}
            >

              <div>

                <h3>
                  {pizza?.name || "Pizza"}
                </h3>

                <p>
                  Quantity: {item.quantity}
                </p>

              </div>

              {item.pizza && (
                <span>
                  Regular Pizza
                </span>
              )}

              {item.customPizza && (
                <span className="custom-item">
                  Custom Pizza
                </span>
              )}

            </div>
          );
        })}

      </section>


      {/* ACTIONS */}
      <div className="track-actions">

        <button
          className="view-orders-btn"
          onClick={() => navigate("/orders")}
        >
          View All Orders
        </button>

        <button
          className="continue-shopping-btn"
          onClick={() => navigate("/menu")}
        >
          Continue Shopping
        </button>

      </div>

    </div>
  );
};

export default TrackOrderPage;