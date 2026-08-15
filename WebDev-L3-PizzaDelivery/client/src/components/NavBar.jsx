import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ onLogin, onRegister }) => {
  const navigate = useNavigate();

  const [user] = useState(() => {
    const savedUser = localStorage.getItem("user");

    return savedUser
      ? JSON.parse(savedUser)
      : null;
  });

  const token = localStorage.getItem("token");

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <nav className="navbar">

      {/* Logo */}
      <div
        className="navbar-logo"
        onClick={() => navigate("/")}
      >
        <span className="pizza-icon">
          🍕
        </span>

        <span>
          Pizza<span>Delivery</span>
        </span>
      </div>

      {/* Links */}
      <div className="nav-links">

        <a href="/">
          Home
        </a>

        <a href="/menu">
          Menu
        </a>

        <a href="/custom-pizza">
          Custom Pizza
        </a>

        <a href="/track-order">
          Track Order
        </a>

      </div>

      {/* Actions */}
      <div className="nav-actions">

        {token && user ? (

          <button
            className="navbar-profile"
            onClick={handleProfileClick}
            title={user.name}
          >
            {user.name
              ?.charAt(0)
              .toUpperCase()}
          </button>

        ) : (

          <>
            <button
              className="login-btn"
              onClick={onLogin}
            >
              Login
            </button>

            <button
              className="register-btn"
              onClick={onRegister}
            >
              Register
            </button>
          </>

        )}

      </div>

    </nav>
  );
};

export default Navbar;