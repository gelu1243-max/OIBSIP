import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      // Check login
      if (!token) {
        navigate("/");
        return;
      }

      // Check admin
      if (!user || !user.isAdmin) {
        navigate("/menu");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/admin/dashboard",
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
            data.message || "Failed to load dashboard."
          );
        }

        setDashboard(data);
      } catch (error) {
        console.error("Dashboard error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]);

  if (loading) {
    return (
      <div className="admin-loading">
        <h2>Loading Admin Dashboard... 📊</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-error">
        <h2>{error}</h2>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">

      {/* Header */}
      <header className="admin-header">
        <div>
          <span className="admin-badge">
            👑 ADMIN PANEL
          </span>

          <h1>
            Admin <span>Dashboard</span>
          </h1>

          <p>
            Manage your pizza delivery business from one place.
          </p>
        </div>

        <button
          className="admin-logout-btn"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/");
          }}
        >
          Logout
        </button>
      </header>

      {/* Statistics */}
      <section className="admin-stats">

        <div className="admin-stat-card">
          <div className="stat-icon">🛒</div>

          <div>
            <p>Total Orders</p>
            <h2>{dashboard.totalOrders}</h2>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon">👥</div>

          <div>
            <p>Total Customers</p>
            <h2>{dashboard.totalUsers}</h2>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon">🍕</div>

          <div>
            <p>Total Pizzas</p>
            <h2>{dashboard.totalPizzas}</h2>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon">💰</div>

          <div>
            <p>Total Sales</p>
            <h2>
              ₹{Number(dashboard.totalSales).toFixed(2)}
            </h2>
          </div>
        </div>

      </section>

      {/* Admin actions */}
      <section className="admin-actions">

        <h2>Management</h2>

        <div className="admin-action-grid">

          <button
            onClick={() => navigate("/admin/orders")}
            className="admin-action-card"
          >
            <span>🛒</span>
            <h3>Manage Orders</h3>
            <p>
              View orders and update their status.
            </p>
          </button>

          <button
            onClick={() => navigate("/admin/inventory")}
            className="admin-action-card"
          >
            <span>📦</span>
            <h3>Manage Inventory</h3>
            <p>
              View and update ingredient stock.
            </p>
          </button>

          <button
            onClick={() => navigate("/admin/pizzas")}
            className="admin-action-card"
          >
            <span>🍕</span>
            <h3>Manage Pizzas</h3>
            <p>
              Add, edit and remove pizzas.
            </p>
          </button>

        </div>

      </section>

    </div>
  );
};

export default AdminDashboard;