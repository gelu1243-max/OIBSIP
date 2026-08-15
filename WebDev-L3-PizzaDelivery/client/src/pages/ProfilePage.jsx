import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthModal from "../components/AuthModal";
import "../styles/ProfilePage.css";

const ProfilePage = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  sessionStorage.removeItem("redirectAfterLogin");

  setUser(null);

  navigate("/");
};

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      // No token
      if (!token) {
        setLoading(false);
        setShowLogin(true);
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/users/profile",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        // Token invalid / expired
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          setShowLogin(true);
          setLoading(false);

          return;
        }

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load profile."
          );
        }

        setUser(data.user);
      } catch (error) {
        console.error(
          "Profile error:",
          error
        );

        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // =========================
  // Loading
  // =========================

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="profile-loading-icon">
          🍕
        </div>

        <h2>
          Loading your profile...
        </h2>
      </div>
    );
  }

  // =========================
  // Error
  // =========================

  if (error) {
    return (
      <div className="profile-error">

        <h2>
          Something went wrong
        </h2>

        <p>{error}</p>

        <button
          onClick={() => navigate("/menu")}
        >
          Back to Menu
        </button>

      </div>
    );
  }

  return (
    <div className="profile-page">

      {/* Header */}
      <section className="profile-header">

        <button
          className="profile-back-btn"
          onClick={() => navigate("/menu")}
        >
          ← Back to Menu
        </button>

        <span className="profile-badge">
          👤 MY ACCOUNT
        </span>

        <h1>
          My <span>Profile</span>
        </h1>

        <p>
          Manage your account information and
          view your pizza ordering activity.
        </p>

      </section>

      {/* Profile Card */}
      <section className="profile-card">

        {/* Avatar */}
        <div className="profile-avatar">
          {user?.name?.charAt(0).toUpperCase()}
        </div>

        <h2>
          {user?.name}
        </h2>

        <p className="profile-email">
          {user?.email}
        </p>

        {/* Information */}
        <div className="profile-info">

          <div className="profile-info-row">
            <span>👤 Name</span>

            <strong>
              {user?.name}
            </strong>
          </div>

          <div className="profile-info-row">
            <span>📧 Email</span>

            <strong>
              {user?.email}
            </strong>
          </div>

          <div className="profile-info-row">
            <span>🆔 Account ID</span>

            <strong>
              #{user?.id}
            </strong>
          </div>

        </div>

        {/* Actions */}
        <div className="profile-actions">

          <button
            className="profile-orders-btn"
            onClick={() => navigate("/orders")}
          >
            🧾 My Orders
          </button>

          <button
            className="profile-track-btn"
            onClick={() => navigate("/track-order")}
          >
            📦 Track Order
          </button>
          <button
            className="profile-logout-btn"
            onClick={handleLogout}
          >
            🚪 Logout
          </button>

        </div>

      </section>

      {/* Login Modal */}
      {showLogin && (
        <AuthModal
          mode="login"
          onClose={() => {
            setShowLogin(false);
            navigate("/");
          }}
          onSwitch={(mode) => {
            if (mode === "register") {
              // You can allow registration here too
            }
          }}
          redirectTo="/profile"
        />
      )}

    </div>
  );
};

export default ProfilePage;