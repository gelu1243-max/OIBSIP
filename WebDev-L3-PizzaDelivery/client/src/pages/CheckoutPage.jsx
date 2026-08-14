import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CheckoutPage.css";

const CheckoutPage = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ----------------------------------------
  // Load Razorpay script
  // ----------------------------------------

  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        if (window.Razorpay) {
          resolve(true);
          return;
        }

        const script = document.createElement("script");

        script.src =
          "https://checkout.razorpay.com/v1/checkout.js";

        script.onload = () => {
          resolve(true);
        };

        script.onerror = () => {
          resolve(false);
        };

        document.body.appendChild(script);
      });
    };

    loadRazorpayScript();
  }, []);


  // ----------------------------------------
  // Load cart
  // ----------------------------------------

  useEffect(() => {
    const savedCart =
      JSON.parse(localStorage.getItem("cart")) || [];

    setCart(savedCart);

    if (savedCart.length === 0) {
      navigate("/cart");
    }
  }, [navigate]);


  // ----------------------------------------
  // Calculate totals
  // ----------------------------------------

  const subtotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.price) * item.quantity,
    0
  );

  const delivery = 0;

  const total = subtotal + delivery;


  // ----------------------------------------
  // PLACE ORDER + PAYMENT
  // ----------------------------------------

  const handlePlaceOrder = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError(
        "Please login before placing your order."
      );
      return;
    }

    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (!window.Razorpay) {
      setError(
        "Payment system is not loaded. Please try again."
      );
      return;
    }

    setLoading(true);
    setError("");

    try {

      // ==================================================
      // STEP 1: Convert cart to backend order format
      // ==================================================

      const items = cart.map((item) => ({
        ...(item.customPizzaId
          ? {
              customPizzaId: item.customPizzaId,
            }
          : {
              pizzaId: item.id,
            }),

        quantity: item.quantity,
      }));


      // ==================================================
      // STEP 2: CREATE ORDER
      // ==================================================

      const orderResponse = await fetch(
        "http://localhost:5000/api/orders",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            items,
          }),
        }
      );


      const orderData =
        await orderResponse.json();


      if (!orderResponse.ok) {
        throw new Error(
          orderData.message ||
          "Failed to create order."
        );
      }


      console.log(
        "Order created:",
        orderData
      );


      const orderId = orderData.id;


      // ==================================================
      // STEP 3: CREATE RAZORPAY PAYMENT
      // ==================================================

      const paymentResponse = await fetch(
        "http://localhost:5000/api/payment/create",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            orderId,
          }),
        }
      );


      const paymentData =
        await paymentResponse.json();


      if (!paymentResponse.ok) {
        throw new Error(
          paymentData.message ||
          "Failed to create payment."
        );
      }


      console.log(
        "Payment created:",
        paymentData
      );


      // ==================================================
      // STEP 4: OPEN RAZORPAY CHECKOUT
      // ==================================================

      const options = {

        key: paymentData.keyId,

        amount:
          paymentData.razorpayOrder.amount,

        currency:
          paymentData.razorpayOrder.currency,

        name: "PizzaDelivery",

        description:
          `Payment for Order #${orderId}`,

        order_id:
          paymentData.razorpayOrder.id,


        // ----------------------------------------------
        // Customer information
        // ----------------------------------------------

        prefill: {
          name:
            localStorage.getItem("userName") || "",

          email:
            localStorage.getItem("userEmail") || "",
        },


        // ----------------------------------------------
        // Payment success
        // ----------------------------------------------

        handler: async function (response) {

          console.log(
            "Razorpay payment successful:",
            response
          );

          try {

            // ==========================================
            // STEP 5: VERIFY PAYMENT
            // ==========================================

            const verifyResponse =
              await fetch(
                "http://localhost:5000/api/payment/verify",
                {
                  method: "POST",

                  headers: {
                    "Content-Type":
                      "application/json",

                    Authorization:
                      `Bearer ${token}`,
                  },

                  body: JSON.stringify({

                    orderId,

                    razorpay_order_id:
                      response.razorpay_order_id,

                    razorpay_payment_id:
                      response.razorpay_payment_id,

                    razorpay_signature:
                      response.razorpay_signature,
                  }),
                }
              );


            const verifyData =
              await verifyResponse.json();


            if (!verifyResponse.ok) {
              throw new Error(
                verifyData.message ||
                "Payment verification failed."
              );
            }


            console.log(
              "Payment verified:",
              verifyData
            );


            // ==========================================
            // STEP 6: PAYMENT SUCCESS
            // ==========================================

            localStorage.removeItem("cart");


            // Save order information
            localStorage.setItem(
              "lastOrder",
              JSON.stringify({
                ...orderData,

                payment:
                  verifyData.payment,

                paymentStatus:
                  "SUCCESS",
              })
            );


            // Go to success page
            navigate("/order-success");

          } catch (error) {

            console.error(
              "Payment verification error:",
              error
            );

            setError(
              error.message ||
              "Payment verification failed."
            );

            setLoading(false);
          }
        },


        // ----------------------------------------------
        // Payment modal dismissed
        // ----------------------------------------------

        modal: {

          ondismiss: function () {

            console.log(
              "Payment popup closed."
            );

            setError(
              "Payment was cancelled. Your order has not been paid."
            );

            setLoading(false);
          },
        },


        // ----------------------------------------------
        // Theme
        // ----------------------------------------------

        theme: {
          color: "#ff6b35",
        },
      };


      // Open Razorpay
      const razorpay =
        new window.Razorpay(options);


      // ----------------------------------------------
      // Payment failed
      // ----------------------------------------------

      razorpay.on(
        "payment.failed",
        function (response) {

          console.error(
            "Payment failed:",
            response.error
          );

          setError(
            response.error?.description ||
            "Payment failed. Please try again."
          );

          setLoading(false);
        }
      );


      razorpay.open();

    } catch (error) {

      console.error(
        "Checkout error:",
        error
      );

      setError(
        error.message ||
        "Something went wrong during checkout."
      );

      setLoading(false);
    }
  };


  // ----------------------------------------
  // Render
  // ----------------------------------------

  return (
    <div className="checkout-page">

      {/* Header */}

      <div className="checkout-header">

        <span className="checkout-badge">
          🧾 CHECKOUT
        </span>

        <h1>
          Complete Your <span>Order</span>
        </h1>

        <p>
          Review your order before placing it.
        </p>

      </div>


      <div className="checkout-container">


        {/* ====================================
            ORDER ITEMS
        ==================================== */}

        <section className="checkout-items">

          <h2>Your Order</h2>


          {cart.map((item) => (

            <div
              className="checkout-item"
              key={item.id}
            >

              <img
                src={item.imageUrl}
                alt={item.name}
              />


              <div className="checkout-item-info">

                <h3>
                  {item.name}
                </h3>

                <p>
                  ₹
                  {Number(item.price).toFixed(2)}
                </p>

                <span>
                  Quantity: {item.quantity}
                </span>

              </div>


              <strong>

                ₹
                {(
                  Number(item.price) *
                  item.quantity
                ).toFixed(2)}

              </strong>

            </div>

          ))}

        </section>


        {/* ====================================
            ORDER SUMMARY
        ==================================== */}

        <section className="checkout-summary">

          <h2>
            Order Summary
          </h2>


          <div className="summary-row">

            <span>
              Items
            </span>

            <strong>
              {cart.reduce(
                (total, item) =>
                  total + item.quantity,
                0
              )}
            </strong>

          </div>


          <div className="summary-row">

            <span>
              Subtotal
            </span>

            <strong>
              ₹{subtotal.toFixed(2)}
            </strong>

          </div>


          <div className="summary-row">

            <span>
              Delivery
            </span>

            <strong className="free">
              Free
            </strong>

          </div>


          <hr />


          <div className="summary-total">

            <span>
              Total
            </span>

            <strong>
              ₹{total.toFixed(2)}
            </strong>

          </div>


          {/* Error */}

          {error && (

            <div className="checkout-error">
              {error}
            </div>

          )}


          {/* Pay button */}

          <button
            className="place-order-btn"
            onClick={handlePlaceOrder}
            disabled={loading}
          >

            {loading
              ? "Processing Payment..."
              : `Pay ₹${total.toFixed(2)}`}

          </button>


          <button
            className="back-cart-btn"
            onClick={() => navigate("/cart")}
            disabled={loading}
          >
            ← Back to Cart
          </button>


          <p className="secure-message">
            🔒 Secure payment powered by Razorpay
          </p>

        </section>

      </div>

    </div>
  );
};

export default CheckoutPage;