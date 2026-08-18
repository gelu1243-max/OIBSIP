import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/OrdersPage.css";

const OrdersPage = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
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

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load orders."
          );
        }

        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    // Check for status changes every 5 seconds
    const interval = setInterval(() => {
    fetchOrders();
  }, 5000);

  // Stop polling when leaving the page
  return () => {
    clearInterval(interval);
  };
  }, [navigate]);

  if (loading) {
    return (
      <div className="orders-loading">
        <h2>Loading your orders... 🍕</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-error">
        <h2>{error}</h2>

        <button onClick={() => navigate("/menu")}>
          Back to Menu
        </button>
      </div>
    );
  }

  return (
    <div className="orders-page">

      {/* Header */}
      <section className="orders-header">
         <button
    className="orders-back-home-btn"
    onClick={() => navigate("/")}
  >
    ← Back to Home
  </button>

        <span className="orders-badge">
          🧾 YOUR ORDERS
        </span>

        <h1>
          My <span>Orders</span>
        </h1>

        <p>
          Track your pizza orders and check their current status.
        </p>

      </section>

      {/* Orders */}
      <section className="orders-container">

        {orders.length === 0 ? (
          <div className="no-orders">

            <div className="no-orders-icon">
              🍕
            </div>

            <h2>No Orders Yet</h2>

            <p>
              You haven't placed any orders yet.
            </p>

            <button
              className="browse-menu-btn"
              onClick={() => navigate("/menu")}
            >
              Browse Pizza Menu
            </button>

          </div>
        ) : (
          orders.map((order) => (
            <div
              className="order-card"
              key={order.id}
            >

              {/* Order Header */}
              <div className="order-card-header">

                <div>
                  <span className="order-label">
                    ORDER
                  </span>

                  <h2>
                    #{order.id}
                  </h2>
                </div>

                <span
                  className={`order-status status-${order.status?.toLowerCase()}`}
                >
                  {order.status}
                </span>

              </div>

              {/* Order Items */}
              <div className="order-items">

                {order.items.map((item) => {

                  const pizza =
                    item.pizza || item.customPizza;

                  return (
                    <div
                      className="order-item"
                      key={item.id}
                    >

                      <div className="order-item-info">

                        <h3>
                          {pizza?.name || "Pizza"}
                        </h3>

                        <p>
                          Quantity: {item.quantity}
                        </p>

                      </div>

                      {item.pizza && (
                        <span className="order-item-type">
                          Regular Pizza
                        </span>
                      )}

                      {item.customPizza && (
                        <span className="order-item-type custom">
                          Custom Pizza
                        </span>
                      )}

                    </div>
                  );
                })}

              </div>

              {/* Order Footer */}
              <div className="order-card-footer">

                <span>
                  Total
                </span>

                <strong>
                  ₹{Number(order.totalAmount).toFixed(2)}
                </strong>

              </div>

            </div>
          ))
        )}

      </section>

    </div>
  );
};

export default OrdersPage;