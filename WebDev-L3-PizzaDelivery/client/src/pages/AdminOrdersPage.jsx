import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminOrdersPage.css";

const AdminOrdersPage = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "http://localhost:5000/api/orders",
        {
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if (!token) {
      navigate("/");
      return;
    }

    if (!user || !user.isAdmin) {
      navigate("/menu");
      return;
    }

    fetchOrders();
  }, [navigate]);

  const updateOrderStatus = async (orderId, status) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update order."
        );
      }

      // Update the order in the page
      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order.id === orderId
            ? { ...order, status: data.status }
            : order
        )
      );
    } catch (error) {
      console.error("Error updating order:", error);
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <div className="admin-orders-loading">
        <h2>Loading Orders... 🛒</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-orders-error">
        <h2>{error}</h2>

        <button onClick={() => navigate("/admin/dashboard")}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="admin-orders-page">

      {/* Header */}
      <header className="admin-orders-header">

        <div>
          <span className="admin-orders-badge">
            🛒 ORDER MANAGEMENT
          </span>

          <h1>
            Manage <span>Orders</span>
          </h1>

          <p>
            View customer orders and update their status.
          </p>
        </div>

        <button
          className="back-dashboard-btn"
          onClick={() =>
            navigate("/admin/dashboard")
          }
        >
          ← Dashboard
        </button>

      </header>

      {/* Orders */}
      <section className="orders-section">

        <div className="orders-section-header">
          <h2>Customer Orders</h2>

          <span>
            {orders.length}{" "}
            {orders.length === 1
              ? "order"
              : "orders"}
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="no-orders">
            <div className="no-orders-icon">
              🛒
            </div>

            <h2>No Orders Yet</h2>

            <p>
              Customer orders will appear here.
            </p>
          </div>
        ) : (
          <div className="orders-list">

            {orders.map((order) => (

              <div
                className="admin-order-card"
                key={order.id}
              >

                {/* Order Header */}
                <div className="order-card-header">

                  <div>
                    <h3>
                      Order #{order.id}
                    </h3>

                    <p>
                      Customer:{" "}
                      {order.user?.name ||
                        "Unknown Customer"}
                    </p>

                    <p>
                      {order.user?.email || ""}
                    </p>
                  </div>

                  <div className="order-status-section">

                    <label>Status</label>

                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(
                          order.id,
                          e.target.value
                        )
                      }
                      className={`status-select ${order.status?.toLowerCase()}`}
                    >

                      <option value="RECEIVED">
                        Received
                      </option>

                      <option value="IN_KITCHEN">
                        In Kitchen
                      </option>

                      <option value="SENT_TO_DELIVERY">
                        Sent to Delivery
                      </option>

                      <option value="DELIVERED">
                        Delivered
                      </option>

                      <option value="CANCELLED">
                        Cancelled
                      </option>
                    </select>

                  </div>

                </div>

                {/* Order Items */}
                <div className="order-items">

                  <h4>Order Items</h4>

                  {order.items?.map((item) => (

                    <div
                      className="admin-order-item"
                      key={item.id}
                    >

                      <div>
                        <strong>
                          {item.pizza?.name ||
                            item.customPizza?.name ||
                            "Pizza"}
                        </strong>

                        <span>
                          Quantity: {item.quantity}
                        </span>
                      </div>

                    </div>

                  ))}

                </div>

                {/* Order Footer */}
                <div className="order-card-footer">

                  <span>
                    Total Amount
                  </span>

                  <strong>
                    ₹
                    {Number(
                      order.totalAmount
                    ).toFixed(2)}
                  </strong>

                </div>

              </div>

            ))}

          </div>
        )}

      </section>

    </div>
  );
};

export default AdminOrdersPage;