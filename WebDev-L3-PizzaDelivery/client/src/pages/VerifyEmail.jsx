import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");

  // Prevent duplicate verification requests
  const verificationStarted = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing.");
      return;
    }

    // Prevent React StrictMode from making the request twice
    if (verificationStarted.current) {
      return;
    }

    verificationStarted.current = true;

    const verifyEmail = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/users/verify/${token}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Email verification failed."
          );
        }

        setStatus("success");
        setMessage(data.message);

      } catch (error) {
        console.error("Verification error:", error);

        setStatus("error");
        setMessage(error.message);
      }
    };

    verifyEmail();

  }, [token]);

  return (
    <div className="verify-email-page">

      <div className="verify-email-card">

        {status === "verifying" && (
          <>
            <div className="verify-email-icon">
              ⏳
            </div>

            <h1>Verifying your email...</h1>

            <p>
              Please wait while we verify your
              PizzaDelivery account.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="verify-email-icon">
              ✅
            </div>

            <h1>Email Verified!</h1>

            <p>
              {message}
            </p>

            <button
              className="auth-button"
              onClick={() => navigate("/")}
            >
              Continue to PizzaDelivery
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <div className="verify-email-icon">
              ❌
            </div>

            <h1>Verification Failed</h1>

            <p>
              {message}
            </p>

            <button
              className="auth-button"
              onClick={() => navigate("/")}
            >
              Back to Home
            </button>
          </>
        )}

      </div>

    </div>
  );
};

export default VerifyEmail;