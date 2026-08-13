import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminPizzaPage.css";

const AdminPizzaPage = () => {
  const navigate = useNavigate();

  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const [saving, setSaving] = useState(false);

  const [newPizza, setNewPizza] = useState({
    name: "",
    description: "",
    imageUrl: "",
    price: "",
    stock: "",
    threshold: "",
  });

  const [editingPizza, setEditingPizza] = useState(null);

  const [editPizza, setEditPizza] = useState({
    name: "",
    description: "",
    imageUrl: "",
    price: "",
    stock: "",
    threshold: "",
  });

  // Fetch pizzas
  useEffect(() => {
    const fetchPizzas = async () => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      if (!token) {
        navigate("/");
        return;
      }

      if (!user || !user.isAdmin) {
        navigate("/menu");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/pizzas",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load pizzas."
          );
        }

        setPizzas(data);
      } catch (error) {
        console.error("Pizza error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPizzas();
  }, [navigate]);

  // Add form changes
  const handleNewPizzaChange = (e) => {
    setNewPizza({
      ...newPizza,
      [e.target.name]: e.target.value,
    });
  };

  // Edit form changes
  const handleEditPizzaChange = (e) => {
    setEditPizza({
      ...editPizza,
      [e.target.name]: e.target.value,
    });
  };

  // Add pizza
  const handleAddPizza = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/pizzas",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: newPizza.name,
            description: newPizza.description,
            imageUrl: newPizza.imageUrl,
            price: Number(newPizza.price),
            stock: Number(newPizza.stock),
            threshold: Number(newPizza.threshold),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to add pizza."
        );
      }

      setPizzas((previous) => [
        ...previous,
        data,
      ]);

      setNewPizza({
        name: "",
        description: "",
        imageUrl: "",
        price: "",
        stock: "",
        threshold: "",
      });

      setShowAddForm(false);
    } catch (error) {
      console.error("Add pizza error:", error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  // Open edit form
  const openEditForm = (pizza) => {
    setEditingPizza(pizza);

    setEditPizza({
      name: pizza.name,
      description: pizza.description || "",
      imageUrl: pizza.imageUrl || "",
      price: pizza.price,
      stock: pizza.stock,
      threshold: pizza.threshold,
    });

    setShowEditForm(true);
  };

  // Update pizza
  const handleEditPizza = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/pizzas/${editingPizza.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: editPizza.name,
            description: editPizza.description,
            imageUrl: editPizza.imageUrl,
            price: Number(editPizza.price),
            stock: Number(editPizza.stock),
            threshold: Number(editPizza.threshold),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update pizza."
        );
      }

      setPizzas((previous) =>
        previous.map((pizza) =>
          pizza.id === editingPizza.id
            ? data
            : pizza
        )
      );

      setShowEditForm(false);
      setEditingPizza(null);
    } catch (error) {
      console.error("Edit pizza error:", error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  // Delete pizza
  const handleDeletePizza = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this pizza?"
    );

    if (!confirmed) {
      return;
    }

    const token = localStorage.getItem("token");

    setError("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/pizzas/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete pizza."
        );
      }

      setPizzas((previous) =>
        previous.filter((pizza) => pizza.id !== id)
      );
    } catch (error) {
      console.error("Delete pizza error:", error);
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <div className="admin-pizza-loading">
        <h2>Loading Pizzas... 🍕</h2>
      </div>
    );
  }

  if (error && pizzas.length === 0) {
    return (
      <div className="admin-pizza-error">
        <h2>{error}</h2>

        <button
          onClick={() => navigate("/admin/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="admin-pizza-page">

      {/* Header */}
      <header className="pizza-management-header">
        <div>
          <span className="pizza-management-badge">
            🍕 PIZZA MANAGEMENT
          </span>

          <h1>
            Manage <span>Pizzas</span>
          </h1>

          <p>
            Add, edit and remove pizzas from your menu.
          </p>
        </div>

        <div className="pizza-header-actions">

          <button
            className="add-pizza-btn"
            onClick={() => setShowAddForm(true)}
          >
            + Add Pizza
          </button>

          <button
            className="pizza-back-btn"
            onClick={() =>
              navigate("/admin/dashboard")
            }
          >
            ← Dashboard
          </button>

        </div>
      </header>

      {error && (
        <div className="pizza-error-message">
          {error}
        </div>
      )}

      {/* Pizza list */}
      <main className="admin-pizza-container">

        <div className="pizza-count">
          {pizzas.length} pizzas
        </div>

        <div className="admin-pizza-grid">

          {pizzas.length === 0 ? (
            <p className="no-pizzas">
              No pizzas available.
            </p>
          ) : (
            pizzas.map((pizza) => (
              <div
                className="admin-pizza-card"
                key={pizza.id}
              >

                {pizza.imageUrl && (
                  <img
                    src={pizza.imageUrl}
                    alt={pizza.name}
                    className="admin-pizza-image"
                  />
                )}

                <div className="admin-pizza-info">

                  <h2>{pizza.name}</h2>

                  <p className="pizza-description">
                    {pizza.description}
                  </p>

                  <p className="pizza-price">
                    ₹{Number(pizza.price).toFixed(2)}
                  </p>

                  <div className="pizza-stock-info">

                    <span>Stock</span>

                    <strong
                      className={
                        pizza.stock <
                        pizza.threshold
                          ? "low-stock"
                          : "normal-stock"
                      }
                    >
                      {pizza.stock}
                    </strong>

                  </div>

                  <p className="pizza-threshold">
                    Alert below: {pizza.threshold}
                  </p>

                  <div className="pizza-actions">

                    <button
                      className="edit-pizza-btn"
                      onClick={() =>
                        openEditForm(pizza)
                      }
                    >
                      Edit Pizza
                    </button>

                    <button
                      className="delete-pizza-btn"
                      onClick={() =>
                        handleDeletePizza(pizza.id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>

              </div>
            ))
          )}

        </div>

      </main>

      {/* Add Pizza Form */}
      {showAddForm && (
        <div className="pizza-form-overlay">

          <div className="pizza-form">

            <div className="pizza-form-header">

              <h2>Add Pizza</h2>

              <button
                type="button"
                className="close-pizza-form-btn"
                onClick={() =>
                  setShowAddForm(false)
                }
              >
                ×
              </button>

            </div>

            <form onSubmit={handleAddPizza}>

              <div className="form-group">
                <label>Name</label>

                <input
                  type="text"
                  name="name"
                  value={newPizza.name}
                  onChange={handleNewPizzaChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>

                <textarea
                  name="description"
                  value={newPizza.description}
                  onChange={handleNewPizzaChange}
                />
              </div>

              <div className="form-group">
                <label>Image URL</label>

                <input
                  type="text"
                  name="imageUrl"
                  value={newPizza.imageUrl}
                  onChange={handleNewPizzaChange}
                />
              </div>

              <div className="form-group">
                <label>Price</label>

                <input
                  type="number"
                  name="price"
                  value={newPizza.price}
                  onChange={handleNewPizzaChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label>Stock</label>

                <input
                  type="number"
                  name="stock"
                  value={newPizza.stock}
                  onChange={handleNewPizzaChange}
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label>Low Stock Threshold</label>

                <input
                  type="number"
                  name="threshold"
                  value={newPizza.threshold}
                  onChange={handleNewPizzaChange}
                  min="0"
                  required
                />
              </div>

              <button
                type="submit"
                className="save-pizza-btn"
                disabled={saving}
              >
                {saving
                  ? "Adding..."
                  : "Add Pizza"}
              </button>

            </form>

          </div>

        </div>
      )}

      {/* Edit Pizza Form */}
      {showEditForm && (
        <div className="pizza-form-overlay">

          <div className="pizza-form">

            <div className="pizza-form-header">

              <h2>Edit Pizza</h2>

              <button
                type="button"
                className="close-pizza-form-btn"
                onClick={() =>
                  setShowEditForm(false)
                }
              >
                ×
              </button>

            </div>

            <form onSubmit={handleEditPizza}>

              <div className="form-group">
                <label>Name</label>

                <input
                  type="text"
                  name="name"
                  value={editPizza.name}
                  onChange={handleEditPizzaChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>

                <textarea
                  name="description"
                  value={editPizza.description}
                  onChange={handleEditPizzaChange}
                />
              </div>

              <div className="form-group">
                <label>Image URL</label>

                <input
                  type="text"
                  name="imageUrl"
                  value={editPizza.imageUrl}
                  onChange={handleEditPizzaChange}
                />
              </div>

              <div className="form-group">
                <label>Price</label>

                <input
                  type="number"
                  name="price"
                  value={editPizza.price}
                  onChange={handleEditPizzaChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label>Stock</label>

                <input
                  type="number"
                  name="stock"
                  value={editPizza.stock}
                  onChange={handleEditPizzaChange}
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label>Low Stock Threshold</label>

                <input
                  type="number"
                  name="threshold"
                  value={editPizza.threshold}
                  onChange={handleEditPizzaChange}
                  min="0"
                  required
                />
              </div>

              <button
                type="submit"
                className="save-pizza-btn"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};

export default AdminPizzaPage;