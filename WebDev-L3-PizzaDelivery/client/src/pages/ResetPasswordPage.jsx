import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/ResetPasswordPage.css";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    // Check password match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Basic password validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/users/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to reset password."
        );
      }

      setMessage(
        "Password reset successfully! You can now login."
      );

      setPassword("");
      setConfirmPassword("");

      // Redirect to login after a short delay
      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (error) {
      console.error("Reset password error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-page">

      <div className="reset-password-card">

        <div className="reset-icon">
          🔐
        </div>

        <h1>Reset Password</h1>

        <p>
          Enter your new password below.
        </p>

        {message && (
          <div className="reset-success">
            {message}
          </div>
        )}

        {error && (
          <div className="reset-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label>New Password</label>

            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

          </div>

          <div className="form-group">

            <label>Confirm Password</label>

            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              required
            />

          </div>

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Resetting..."
              : "Reset Password"}
          </button>

        </form>

        <button
          className="back-login-btn"
          onClick={() => navigate("/")}
        >
          ← Back to Login
        </button>

      </div>

    </div>
  );
};

export default ResetPasswordPage;