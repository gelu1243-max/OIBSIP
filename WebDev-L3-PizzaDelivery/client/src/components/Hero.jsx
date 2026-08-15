import { useState } from "react";
import heroImage from "../assets/hero.png";
import { useNavigate } from "react-router-dom";
import AuthModal from "../components/AuthModal";

const Hero = () => {
  const navigate = useNavigate();

  const [authMode, setAuthMode] = useState(null);

  const handleOrderNow = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      // Remember where the user wanted to go
      sessionStorage.setItem(
        "redirectAfterLogin",
        "/menu"
      );

      setAuthMode("login");
      return;
    }

    navigate("/menu");
  };

  return (
    <section className="hero">

      <div className="hero-content">

        <div className="hero-badge">
          🔥 HOT & DELICIOUS
        </div>

        <h1>
          Delicious Pizza,
          <br />
          <span>Delivered</span> to You
        </h1>

        <p>
          Order your favorite pizza or create your own
          custom pizza with your favorite ingredients.
        </p>

        <div className="hero-buttons">

          {/* ORDER NOW */}
          <button
            className="order-btn"
            onClick={handleOrderNow}
          >
            🍕 Order Now
          </button>

          {/* VIEW MENU */}
          <button
            className="menu-btn"
            onClick={() => navigate("/menu")}
          >
            ▶ View Menu
          </button>

        </div>

        <div className="rating">

          <div className="rating-stars">
            ⭐⭐⭐⭐⭐
          </div>

          <strong>4.8</strong>

          <span>
            (2.5k+ reviews)
          </span>

        </div>

      </div>

      <div className="hero-image">

        <img
          src={heroImage}
          alt="Delicious pizza"
        />

      </div>

      {/* Authentication Modal */}
      {authMode && (
        <AuthModal
          mode={authMode}
          onClose={() => setAuthMode(null)}
          onSwitch={(mode) => setAuthMode(mode)}
        />
      )}

    </section>
  );
};

export default Hero;