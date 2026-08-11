import { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";
import AuthModal from "../components/AuthModal"
import PizzaCard from "../components/PizzaCard";
import "../styles/MenuPage.css";

const MenuPage = () => {
  const navigate= useNavigate();
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [authMode, setAuthMode] = useState(null);
  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/pizzas"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load pizzas."
          );
        }

        setPizzas(data);
      } catch (error) {
        console.error("Error fetching pizzas:", error);
        setError("Unable to load pizzas.");
      } finally {
        setLoading(false);
      }
    };

    fetchPizzas();
  }, []);
//add to cart feature
  const handleAddToCart = (pizza) => {
  const token = localStorage.getItem("token");

  // Customer is not logged in
  if (!token) {
    setAuthMode("login");
    return;
  }

  // Get existing cart
  const existingCart =
    JSON.parse(localStorage.getItem("cart")) || [];

  // Check if pizza is already in cart
  const existingItem = existingCart.find(
    (item) => item.id === pizza.id
  );

  let updatedCart;

  if (existingItem) {
    // Increase quantity
    updatedCart = existingCart.map((item) =>
      item.id === pizza.id
        ? {
            ...item,
            quantity: item.quantity + 1,
          }
        : item
    );
  } else {
    // Add new pizza
    updatedCart = [
      ...existingCart,
      {
        ...pizza,
        quantity: 1,
      },
    ];
  }

  // Save cart
  localStorage.setItem(
    "cart",
    JSON.stringify(updatedCart)
  );
  navigate("/cart")

  console.log("Cart updated:", updatedCart);
};

  if (loading) {
    return (
      <div className="menu-loading">
        <h2>Loading delicious pizzas... 🍕</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="menu-error">
        <h2>{error}</h2>
      </div>
    );
  }

  return (
    <div className="menu-page">
      {/* Header */}
      <section className="menu-header">
        <span className="menu-badge">
          🍕 FRESH & DELICIOUS
        </span>

        <h1>
          Our <span>Pizza Menu</span>
        </h1>

        <p>
          Choose your favorite pizza and enjoy it
          freshly prepared and delivered to your door.
        </p>
      </section>

      {/* Pizza grid */}
      <section className="pizza-grid">
        {pizzas.length === 0 ? (
          <p className="no-pizzas">
            No pizzas available right now.
          </p>
        ) : (
          pizzas.map((pizza) => (
            <PizzaCard
              key={pizza.id}
              pizza={pizza}
              onAddToCart={handleAddToCart}
            />
          ))
        )}
      </section>
       {/* Authentication Modal */}
    {authMode && (
      <AuthModal
        mode={authMode}
        onClose={() => setAuthMode(null)}
        onSwitch={(mode) => setAuthMode(mode)}
      />
    )}
    </div>
  );
};

export default MenuPage;