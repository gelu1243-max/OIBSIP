import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AuthModal({ mode, onClose, onSwitch }) {
  const navigate = useNavigate();
  const isLogin = mode === "login";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // -------------------------
  // Handle input changes
  // -------------------------
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // -------------------------
  // Handle login / register
  // -------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      // =========================
      // REGISTER
      // =========================
      if (!isLogin) {
        const response = await fetch(
          "http://localhost:5000/api/users/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: formData.name,
              email: formData.email,
              password: formData.password,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Registration failed."
          );
        }

        setMessage(
          "Registration successful! Please check your email."
        );

        setFormData({
          name: "",
          email: "",
          password: "",
        });

        return;
      }

      // =========================
      // LOGIN
      // =========================
      const response = await fetch(
        "http://localhost:5000/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Login failed."
        );
      }

      // -------------------------
      // Save JWT
      // -------------------------
      localStorage.setItem("token", data.token);

      // -------------------------
      // Save user information
      // -------------------------
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      setMessage("Login successful!");

      // -------------------------
      // Redirect after login
      // -------------------------
      setTimeout(() => {
        onClose();

        // =========================
        // ADMIN
        // =========================
        if (data.user.isAdmin) {
          sessionStorage.removeItem(
            "redirectAfterLogin"
          );

          navigate("/admin/dashboard");
          return;
        }

        // =========================
        // CUSTOMER
        // =========================

        // Check if customer was trying
        // to access a protected page
        const redirectAfterLogin =
          sessionStorage.getItem(
            "redirectAfterLogin"
          );

        if (redirectAfterLogin) {
          // Remove it after using it
          sessionStorage.removeItem(
            "redirectAfterLogin"
          );

          navigate(redirectAfterLogin);
          return;
        }

        // Normal customer login
        navigate("/menu");
      }, 500);
    } catch (error) {
      console.error(
        "Authentication error:",
        error
      );

      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay">

      {/* Background */}
      <div
        className="auth-overlay-background"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="auth-modal">

        {/* Close */}
        <button
          className="auth-close"
          onClick={onClose}
        >
          ×
        </button>

        {/* Logo */}
        <div className="auth-logo">
          🍕{" "}
          <span>
            Pizza<span>Delivery</span>
          </span>
        </div>

        {/* Heading */}
        <h2>
          {isLogin
            ? "Welcome Back!"
            : "Create Your Account"}
        </h2>

        <p className="auth-subtitle">
          {isLogin
            ? "Login to continue ordering your favorite pizza."
            : "Create an account and start ordering delicious pizza."}
        </p>

        {/* Success message */}
        {message && (
          <div className="auth-success">
            {message}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Name */}
          {!isLogin && (
            <div className="form-group">
              <label>Name</label>

              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {/* Email */}
          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Forgot password */}
          {isLogin && (
            <div className="forgot-password">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate("/forgot-password");
                }}
              >
                Forgot password?
              </button>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isLogin
              ? "Login"
              : "Create Account"}
          </button>

        </form>

        {/* Switch login/register */}
        <div className="auth-switch">

          {isLogin ? (
            <>
              Don't have an account?{" "}

              <button
                type="button"
                onClick={() => {
                  setError("");
                  setMessage("");
                  onSwitch("register");
                }}
              >
                Create account
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}

              <button
                type="button"
                onClick={() => {
                  setError("");
                  setMessage("");
                  onSwitch("login");
                }}
              >
                Login
              </button>
            </>
          )}

        </div>

      </div>
    </div>
  );
}

export default AuthModal;