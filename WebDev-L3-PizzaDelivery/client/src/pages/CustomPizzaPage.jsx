import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CustomPizzaPage.css";

const API_URL = "http://localhost:5000/api";

const CustomPizzaPage = () => {
  const navigate = useNavigate();

  const [bases, setBases] = useState([]);
  const [sauces, setSauces] = useState([]);
  const [cheeses, setCheeses] = useState([]);
  const [vegetables, setVegetables] = useState([]);

  const [selectedBase, setSelectedBase] = useState(null);
  const [selectedSauce, setSelectedSauce] = useState(null);
  const [selectedCheese, setSelectedCheese] = useState(null);
  const [selectedVegetables, setSelectedVegetables] = useState([]);

  const [pizzaName, setPizzaName] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  // Load ingredients
  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const [
          baseResponse,
          sauceResponse,
          cheeseResponse,
          vegetableResponse,
        ] = await Promise.all([
          fetch(`${API_URL}/pizzabases`),
          fetch(`${API_URL}/sauce`),
          fetch(`${API_URL}/cheese`),
          fetch(`${API_URL}/vegetables`),
        ]);

        if (
          !baseResponse.ok ||
          !sauceResponse.ok ||
          !cheeseResponse.ok ||
          !vegetableResponse.ok
        ) {
          throw new Error("Failed to load ingredients.");
        }

        const [
          baseData,
          sauceData,
          cheeseData,
          vegetableData,
        ] = await Promise.all([
          baseResponse.json(),
          sauceResponse.json(),
          cheeseResponse.json(),
          vegetableResponse.json(),
        ]);

        setBases(baseData);
        setSauces(sauceData);
        setCheeses(cheeseData);
        setVegetables(vegetableData);
      } catch (error) {
        console.error(
          "Error loading ingredients:",
          error
        );

        setError("Unable to load pizza ingredients.");
      } finally {
        setLoading(false);
      }
    };

    fetchIngredients();
  }, []);

  // Select / unselect vegetables
  const handleVegetableChange = (vegetable) => {
    const alreadySelected =
      selectedVegetables.some(
        (item) => item.id === vegetable.id
      );

    if (alreadySelected) {
      setSelectedVegetables(
        selectedVegetables.filter(
          (item) => item.id !== vegetable.id
        )
      );
    } else {
      setSelectedVegetables([
        ...selectedVegetables,
        vegetable,
      ]);
    }
  };

  // Calculate price
  const calculatePrice = () => {
    const basePrice = selectedBase
      ? Number(selectedBase.price)
      : 0;

    const saucePrice = selectedSauce
      ? Number(selectedSauce.price)
      : 0;

    const cheesePrice = selectedCheese
      ? Number(selectedCheese.price)
      : 0;

    const vegetablePrice =
      selectedVegetables.reduce(
        (total, vegetable) =>
          total + Number(vegetable.price),
        0
      );

    const preparationFee = 3;

    return (
      basePrice +
      saucePrice +
      cheesePrice +
      vegetablePrice +
      preparationFee
    );
  };

  // Create custom pizza
  const handleCreatePizza = async () => {
    setError("");

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    if (!pizzaName.trim()) {
      setError("Please enter a name for your pizza.");
      return;
    }

    if (!selectedBase) {
      setError("Please select a pizza base.");
      return;
    }

    if (!selectedSauce) {
      setError("Please select a sauce.");
      return;
    }

    if (!selectedCheese) {
      setError("Please select a cheese.");
      return;
    }

    if (selectedVegetables.length === 0) {
      setError(
        "Please select at least one vegetable."
      );
      return;
    }

    setCreating(true);

    try {
      const response = await fetch(
        `${API_URL}/custom-pizzas`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            name: pizzaName,

            baseId: selectedBase.id,

            sauceId: selectedSauce.id,

            cheeseId: selectedCheese.id,

            vegetableIds:
              selectedVegetables.map(
                (vegetable) => vegetable.id
              ),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to create custom pizza."
        );
      }

      console.log(
        "Custom pizza created:",
        data
      );

      /*
       * Add custom pizza to existing cart
       */

      const existingCart =
        JSON.parse(
          localStorage.getItem("cart")
        ) || [];

      const customCartItem = {
        id: `custom-${data.id}`,

        customPizzaId: data.id,

        name: data.name,

        description: data.description,

        price: Number(data.price),

        imageUrl: null,

        quantity: 1,

        isCustom: true,

        base: data.base,

        sauce: data.sauce,

        cheese: data.cheese,

        vegetables: data.vegetables,
      };

      const existingCustomPizza =
        existingCart.find(
          (item) =>
            item.customPizzaId === data.id
        );

      let updatedCart;

      if (existingCustomPizza) {
        updatedCart = existingCart.map(
          (item) =>
            item.customPizzaId === data.id
              ? {
                  ...item,
                  quantity:
                    item.quantity + 1,
                }
              : item
        );
      } else {
        updatedCart = [
          ...existingCart,
          customCartItem,
        ];
      }

      localStorage.setItem(
        "cart",
        JSON.stringify(updatedCart)
      );

      // Go to cart
      navigate("/cart");
    } catch (error) {
      console.error(
        "Create custom pizza error:",
        error
      );

      setError(error.message);
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="custom-loading">
        <h2>
          Preparing your pizza builder... 🍕
        </h2>
      </div>
    );
  }

  if (error && !bases.length) {
    return (
      <div className="custom-error">
        <h2>{error}</h2>
      </div>
    );
  }

  return (
    <div className="custom-pizza-page">
          <button
      className="back-home-btn"
      onClick={() => navigate("/")}
    >
      ← Back to Home
    </button>
      {/* Header */}

      <section className="custom-header">

        <span className="custom-badge">
          🍕 CREATE YOUR OWN
        </span>

        <h1>
          Build Your{" "}
          <span>Perfect Pizza</span>
        </h1>

        <p>
          Choose your favorite ingredients
          and create a pizza made just for you.
        </p>

      </section>

      <div className="custom-pizza-layout">

        {/* Builder */}

        <section className="pizza-builder">

          {/* Pizza name */}

          <div className="ingredient-section">

            <h2>1. Name Your Pizza</h2>

            <input
              type="text"
              value={pizzaName}
              onChange={(e) =>
                setPizzaName(e.target.value)
              }
              placeholder="Example: My Special Pizza"
              className="pizza-name-input"
            />

          </div>

          {/* Base */}

          <div className="ingredient-section">

            <h2>2. Choose Your Base</h2>

            <div className="ingredient-grid">

              {bases.map((base) => (

                <button
                  key={base.id}
                  className={`ingredient-card ${
                    selectedBase?.id === base.id
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedBase(base)
                  }
                  disabled={base.stock <= 0}
                >

                  <h3>{base.name}</h3>

                  <p>
                    ₹
                    {Number(
                      base.price
                    ).toFixed(2)}
                  </p>

                  {base.stock <= 0 && (
                    <span>
                      Out of stock
                    </span>
                  )}

                </button>

              ))}

            </div>

          </div>

          {/* Sauce */}

          <div className="ingredient-section">

            <h2>3. Choose Your Sauce</h2>

            <div className="ingredient-grid">

              {sauces.map((sauce) => (

                <button
                  key={sauce.id}
                  className={`ingredient-card ${
                    selectedSauce?.id === sauce.id
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedSauce(sauce)
                  }
                  disabled={sauce.stock <= 0}
                >

                  <h3>{sauce.name}</h3>

                  <p>
                    ₹
                    {Number(
                      sauce.price
                    ).toFixed(2)}
                  </p>

                </button>

              ))}

            </div>

          </div>

          {/* Cheese */}

          <div className="ingredient-section">

            <h2>4. Choose Your Cheese</h2>

            <div className="ingredient-grid">

              {cheeses.map((cheese) => (

                <button
                  key={cheese.id}
                  className={`ingredient-card ${
                    selectedCheese?.id === cheese.id
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedCheese(cheese)
                  }
                  disabled={cheese.stock <= 0}
                >

                  <h3>{cheese.name}</h3>

                  <p>
                    ₹
                    {Number(
                      cheese.price
                    ).toFixed(2)}
                  </p>

                </button>

              ))}

            </div>

          </div>

          {/* Vegetables */}

          <div className="ingredient-section">

            <h2>5. Choose Vegetables</h2>

            <p className="ingredient-help">
              Select one or more.
            </p>

            <div className="ingredient-grid">

              {vegetables.map(
                (vegetable) => {

                  const selected =
                    selectedVegetables.some(
                      (item) =>
                        item.id ===
                        vegetable.id
                    );

                  return (

                    <button
                      key={vegetable.id}
                      className={`ingredient-card ${
                        selected
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        handleVegetableChange(
                          vegetable
                        )
                      }
                      disabled={
                        vegetable.stock <= 0
                      }
                    >

                      <h3>
                        {vegetable.name}
                      </h3>

                      <p>
                        ₹
                        {Number(
                          vegetable.price
                        ).toFixed(2)}
                      </p>

                    </button>

                  );
                }
              )}

            </div>

          </div>

        </section>

        {/* Summary */}

        <aside className="pizza-summary">

          <div className="pizza-preview">

            <div className="pizza-icon">
              🍕
            </div>

            <h2>
              {pizzaName ||
                "Your Custom Pizza"}
            </h2>

            <p>
              {selectedBase?.name ||
                "Choose a base"}
              {" • "}
              {selectedSauce?.name ||
                "Choose a sauce"}
              {" • "}
              {selectedCheese?.name ||
                "Choose cheese"}
            </p>

          </div>

          <div className="selected-list">

            <h3>
              Your Ingredients
            </h3>

            {selectedBase && (
              <div>
                <span>Base</span>
                <strong>
                  {selectedBase.name}
                </strong>
              </div>
            )}

            {selectedSauce && (
              <div>
                <span>Sauce</span>
                <strong>
                  {selectedSauce.name}
                </strong>
              </div>
            )}

            {selectedCheese && (
              <div>
                <span>Cheese</span>
                <strong>
                  {selectedCheese.name}
                </strong>
              </div>
            )}

            {selectedVegetables.length >
              0 && (
              <div>
                <span>Vegetables</span>

                <strong>
                  {selectedVegetables
                    .map(
                      (vegetable) =>
                        vegetable.name
                    )
                    .join(", ")}
                </strong>
              </div>
            )}

          </div>

          <div className="pizza-price">

            <span>Total</span>

            <strong>
              ₹
              {calculatePrice().toFixed(2)}
            </strong>

          </div>

          {error && (
            <div className="custom-form-error">
              {error}
            </div>
          )}

          <button
            className="create-pizza-btn"
            onClick={handleCreatePizza}
            disabled={creating}
          >
            {creating
              ? "Creating Pizza..."
              : "🍕 Add Custom Pizza to Cart"}
          </button>

          <button
            className="cancel-pizza-btn"
            onClick={() => navigate("/menu")}
          >
            ← Back to Menu
          </button>

        </aside>

      </div>

    </div>
  );
};

export default CustomPizzaPage;