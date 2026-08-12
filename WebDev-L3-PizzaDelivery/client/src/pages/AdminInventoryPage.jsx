import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminInventoryPage.css";

const AdminInventoryPage = () => {
  const navigate = useNavigate();

  const [inventory, setInventory] = useState({
    pizzabases: [],
    sauces: [],
    cheeses: [],
    vegetables: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

    const [newItem, setNewItem] = useState({
    type: "pizzabase",
    name: "",
    stock: "",
    threshold: "",
    price: "",
    });

    const [saving, setSaving] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);

const [editingItem, setEditingItem] = useState(null);

const [editItem, setEditItem] = useState({
  name: "",
  stock: "",
  threshold: "",
  price: "",
});

  useEffect(() => {
    const fetchInventory = async () => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      // Check login
      if (!token) {
        navigate("/");
        return;
      }

      // Check admin
      if (!user || !user.isAdmin) {
        navigate("/menu");
        return;
      }

      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [
          pizzaBaseResponse,
          sauceResponse,
          cheeseResponse,
          vegetableResponse,
        ] = await Promise.all([
          fetch("http://localhost:5000/api/pizzabases", {
            headers,
          }),

          fetch("http://localhost:5000/api/sauce", {
            headers,
          }),

          fetch("http://localhost:5000/api/cheese", {
            headers,
          }),

          fetch("http://localhost:5000/api/vegetables", {
            headers,
          }),
        ]);

        const pizzaBases = await pizzaBaseResponse.json();
        const sauces = await sauceResponse.json();
        const cheeses = await cheeseResponse.json();
        const vegetables = await vegetableResponse.json();

        if (
          !pizzaBaseResponse.ok ||
          !sauceResponse.ok ||
          !cheeseResponse.ok ||
          !vegetableResponse.ok
        ) {
          throw new Error("Failed to load inventory.");
        }

        setInventory({
          pizzabases: pizzaBases,
          sauces,
          cheeses,
          vegetables,
        });
      } catch (error) {
        console.error("Inventory error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, [navigate]);
  const handleNewItemChange = (e) => {
  setNewItem({
    ...newItem,
    [e.target.name]: e.target.value,
  });
};
const handleAddInventory = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");

  setSaving(true);
  setError("");

  try {
    let endpoint = "";

    if (newItem.type === "pizzabase") {
      endpoint = "pizzabases";
    } else if (newItem.type === "sauce") {
      endpoint = "sauce";
    } else if (newItem.type === "cheese") {
      endpoint = "cheese";
    } else if (newItem.type === "vegetable") {
      endpoint = "vegetables";
    }

    const response = await fetch(
      `http://localhost:5000/api/${endpoint}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newItem.name,
          stock: Number(newItem.stock),
          threshold: Number(newItem.threshold),
          price: Number(newItem.price),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to add inventory."
      );
    }

    // Add the new item to the correct frontend list
    setInventory((previous) => ({
      ...previous,
      pizzabases:
        newItem.type === "pizzabase"
          ? [...previous.pizzabases, data]
          : previous.pizzabases,

      sauces:
        newItem.type === "sauce"
          ? [...previous.sauces, data]
          : previous.sauces,

      cheeses:
        newItem.type === "cheese"
          ? [...previous.cheeses, data]
          : previous.cheeses,

      vegetables:
        newItem.type === "vegetable"
          ? [...previous.vegetables, data]
          : previous.vegetables,
    }));

    // Reset form
    setNewItem({
      type: "pizzabase",
      name: "",
      stock: "",
      threshold: "",
      price: "",
    });

    setShowAddForm(false);

  } catch (error) {
    console.error("Add inventory error:", error);
    setError(error.message);
  } finally {
    setSaving(false);
  }
};
const handleEditChange = (e) => {
  setEditItem({
    ...editItem,
    [e.target.name]: e.target.value,
  });
};
const openEditForm = (item, type) => {
  setEditingItem({
    ...item,
    type,
  });
  setEditItem({
    name: item.name,
    stock: item.stock,
    threshold: item.threshold,
    price: item.price,
  });

  setShowEditForm(true);
};
const handleEditInventory = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");

  setSaving(true);
  setError("");

  try {
    let endpoint = "";

    if (editingItem.type === "pizzabase") {
      endpoint = "pizzabases";
    } else if (editingItem.type === "sauce") {
      endpoint = "sauce";
    } else if (editingItem.type === "cheese") {
      endpoint = "cheese";
    } else if (editingItem.type === "vegetable") {
      endpoint = "vegetables";
    }

    const response = await fetch(
      `http://localhost:5000/api/${endpoint}/${editingItem.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editItem.name,
          stock: Number(editItem.stock),
          threshold: Number(editItem.threshold),
          price: Number(editItem.price),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to update inventory."
      );
    }

    // Update the correct inventory list
    setInventory((previous) => ({
      ...previous,

      pizzabases:
        editingItem.type === "pizzabase"
          ? previous.pizzabases.map((item) =>
              item.id === editingItem.id ? data : item
            )
          : previous.pizzabases,

      sauces:
        editingItem.type === "sauce"
          ? previous.sauces.map((item) =>
              item.id === editingItem.id ? data : item
            )
          : previous.sauces,

      cheeses:
        editingItem.type === "cheese"
          ? previous.cheeses.map((item) =>
              item.id === editingItem.id ? data : item
            )
          : previous.cheeses,

      vegetables:
        editingItem.type === "vegetable"
          ? previous.vegetables.map((item) =>
              item.id === editingItem.id ? data : item
            )
          : previous.vegetables,
    }));

    setShowEditForm(false);
    setEditingItem(null);

  } catch (error) {
    console.error("Edit inventory error:", error);
    setError(error.message);
  } finally {
    setSaving(false);
  }
};
const handleDeleteInventory = async (id, type) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this inventory item?"
  );

  if (!confirmed) {
    return;
  }

  const token = localStorage.getItem("token");

  setError("");

  try {
    let endpoint = "";

    if (type === "pizzabase") {
      endpoint = "pizzabases";
    } else if (type === "sauce") {
      endpoint = "sauce";
    } else if (type === "cheese") {
      endpoint = "cheese";
    } else if (type === "vegetable") {
      endpoint = "vegetables";
    }

    const response = await fetch(
      `http://localhost:5000/api/${endpoint}/${id}`,
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
        data.message || "Failed to delete inventory."
      );
    }

    // Remove deleted item from the correct frontend list
    setInventory((previous) => ({
      ...previous,

      pizzabases:
        type === "pizzabase"
          ? previous.pizzabases.filter(
              (item) => item.id !== id
            )
          : previous.pizzabases,

      sauces:
        type === "sauce"
          ? previous.sauces.filter(
              (item) => item.id !== id
            )
          : previous.sauces,

      cheeses:
        type === "cheese"
          ? previous.cheeses.filter(
              (item) => item.id !== id
            )
          : previous.cheeses,

      vegetables:
        type === "vegetable"
          ? previous.vegetables.filter(
              (item) => item.id !== id
            )
          : previous.vegetables,
    }));

  } catch (error) {
    console.error("Delete inventory error:", error);
    setError(error.message);
  }
};

  

  if (loading) {
    return (
      <div className="inventory-loading">
        <h2>Loading Inventory... 📦</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="inventory-error">
        <h2>{error}</h2>

        <button onClick={() => navigate("/admin/dashboard")}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="admin-inventory-page">

      {/* Header */}
      <header className="inventory-header">

        <div>
          <span className="inventory-badge">
            📦 INVENTORY MANAGEMENT
          </span>

          <h1>
            Manage <span>Inventory</span>
          </h1>

          <p>
            Monitor and update your pizza ingredients and stock.
          </p>
        </div>
        <div>
            <button
                className="add-inventory-btn"
                onClick={() => setShowAddForm(true)}
            >
                + Add Inventory
            </button>
            <button
          className="inventory-back-btn"
          onClick={() => navigate("/admin/dashboard")}
        >
          ← Dashboard
        </button>

        </div>
        

      </header>
      {showAddForm && (
  <div className="inventory-form-overlay">

    <div className="inventory-form">

      <div className="inventory-form-header">
        <h2>Add Inventory</h2>

        <button
          type="button"
          onClick={() => setShowAddForm(false)}
          className="close-form-btn"
        >
          ×
        </button>
      </div>

      <form onSubmit={handleAddInventory}>

        <div className="form-group">
          <label>Inventory Type</label>

          <select
            name="type"
            value={newItem.type}
            onChange={handleNewItemChange}
          >
            <option value="pizzabase">
              Pizza Base
            </option>

            <option value="sauce">
              Sauce
            </option>

            <option value="cheese">
              Cheese
            </option>

            <option value="vegetable">
              Vegetable
            </option>
          </select>
        </div>


        <div className="form-group">
          <label>Name</label>

          <input
            type="text"
            name="name"
            value={newItem.name}
            onChange={handleNewItemChange}
            placeholder="Enter item name"
            required
          />
        </div>


        <div className="form-group">
          <label>Price</label>

          <input
            type="number"
            name="price"
            value={newItem.price}
            onChange={handleNewItemChange}
            placeholder="Enter price"
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
            value={newItem.stock}
            onChange={handleNewItemChange}
            placeholder="Enter stock"
            min="0"
            required
          />
        </div>


        <div className="form-group">
          <label>Low Stock Threshold</label>

          <input
            type="number"
            name="threshold"
            value={newItem.threshold}
            onChange={handleNewItemChange}
            placeholder="Example: 20"
            min="0"
            required
          />
        </div>


        <button
          type="submit"
          className="save-inventory-btn"
          disabled={saving}
        >
          {saving ? "Adding..." : "Add Inventory"}
        </button>

      </form>

    </div>

  </div>
)}
{showEditForm && (
  <div className="inventory-form-overlay">

    <div className="inventory-form">

      <div className="inventory-form-header">

        <h2>Edit Inventory</h2>

        <button
          type="button"
          className="close-form-btn"
          onClick={() => setShowEditForm(false)}
        >
          ×
        </button>

      </div>

      <form onSubmit={handleEditInventory}>

        <div className="form-group">
          <label>Name</label>

          <input
            type="text"
            name="name"
            value={editItem.name}
            onChange={handleEditChange}
            required
          />
        </div>


        <div className="form-group">
          <label>Price</label>

          <input
            type="number"
            name="price"
            value={editItem.price}
            onChange={handleEditChange}
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
            value={editItem.stock}
            onChange={handleEditChange}
            min="0"
            required
          />
        </div>


        <div className="form-group">
          <label>Low Stock Threshold</label>

          <input
            type="number"
            name="threshold"
            value={editItem.threshold}
            onChange={handleEditChange}
            min="0"
            required
          />
        </div>


        <button
          type="submit"
          className="save-inventory-btn"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

      </form>

    </div>

  </div>
)}

      {/* Inventory sections */}
      <main className="inventory-container">

        {/* Pizza Bases */}
        <section className="inventory-section">

          <div className="inventory-section-header">
            <h2>🍕 Pizza Bases</h2>

            <span>
              {inventory.pizzabases.length} items
            </span>
          </div>

          <div className="inventory-grid">

            {inventory.pizzabases.map((item) => (
              <div
                className="inventory-card"
                key={item.id}
              >
                <h3>{item.name}</h3>

                <p>
                  Price: ₹{Number(item.price).toFixed(2)}
                </p>

                <div className="stock-info">
                  <span>Stock</span>

                  <strong
                    className={
                      item.stock < item.threshold
                        ? "low-stock"
                        : "normal-stock"
                    }
                  >
                    {item.stock}
                  </strong>
                </div>

                <p className="threshold">
                  Alert below: {item.threshold}
                </p>

                <div className="inventory-actions">

                <button
                    className="edit-inventory-btn"
                    onClick={() => openEditForm(item, "pizzabase")}
                >
                    Edit Stock
                </button>

                <button
                    className="delete-inventory-btn"
                    onClick={() =>
                    handleDeleteInventory(item.id, "pizzabase")
                    }
                >
                    Delete
                </button>

                </div>
              </div>
            ))}

          </div>
        </section>


        {/* Sauces */}
        <section className="inventory-section">

          <div className="inventory-section-header">
            <h2>🥫 Sauces</h2>

            <span>
              {inventory.sauces.length} items
            </span>
          </div>

          <div className="inventory-grid">

            {inventory.sauces.map((item) => (
              <div
                className="inventory-card"
                key={item.id}
              >
                <h3>{item.name}</h3>

                <p>
                  Price: ₹{Number(item.price).toFixed(2)}
                </p>

                <div className="stock-info">
                  <span>Stock</span>

                  <strong
                    className={
                      item.stock < item.threshold
                        ? "low-stock"
                        : "normal-stock"
                    }
                  >
                    {item.stock}
                  </strong>
                </div>

                <p className="threshold">
                  Alert below: {item.threshold}
                </p>

                <div className="inventory-actions">

                <button
                    className="edit-inventory-btn"
                    onClick={() => openEditForm(item, "sauce")}
                >
                    Edit Stock
                </button>

                <button
                    className="delete-inventory-btn"
                    onClick={() =>
                    handleDeleteInventory(item.id, "sauce")
                    }
                >
                    Delete
                </button>

                </div>
              </div>
            ))}

          </div>
        </section>


        {/* Cheese */}
        <section className="inventory-section">

          <div className="inventory-section-header">
            <h2>🧀 Cheese</h2>

            <span>
              {inventory.cheeses.length} items
            </span>
          </div>

          <div className="inventory-grid">

            {inventory.cheeses.map((item) => (
              <div
                className="inventory-card"
                key={item.id}
              >
                <h3>{item.name}</h3>

                <p>
                  Price: ₹{Number(item.price).toFixed(2)}
                </p>

                <div className="stock-info">
                  <span>Stock</span>

                  <strong
                    className={
                      item.stock < item.threshold
                        ? "low-stock"
                        : "normal-stock"
                    }
                  >
                    {item.stock}
                  </strong>
                </div>

                <p className="threshold">
                  Alert below: {item.threshold}
                </p>

                <div className="inventory-actions">

                <button
                    className="edit-inventory-btn"
                    onClick={() => openEditForm(item, "cheese")}
                >
                    Edit Stock
                </button>

                <button
                    className="delete-inventory-btn"
                    onClick={() =>
                    handleDeleteInventory(item.id, "cheese")
                    }
                >
                    Delete
                </button>

                </div>
              </div>
            ))}

          </div>
        </section>


        {/* Vegetables */}
        <section className="inventory-section">

          <div className="inventory-section-header">
            <h2>🥬 Vegetables</h2>

            <span>
              {inventory.vegetables.length} items
            </span>
          </div>

          <div className="inventory-grid">

            {inventory.vegetables.map((item) => (
              <div
                className="inventory-card"
                key={item.id}
              >
                <h3>{item.name}</h3>

                <p>
                  Price: ₹{Number(item.price).toFixed(2)}
                </p>

                <div className="stock-info">
                  <span>Stock</span>

                  <strong
                    className={
                      item.stock < item.threshold
                        ? "low-stock"
                        : "normal-stock"
                    }
                  >
                    {item.stock}
                  </strong>
                </div>

                <p className="threshold">
                  Alert below: {item.threshold}
                </p>

                <div className="inventory-actions">

                <button
                    className="edit-inventory-btn"
                    onClick={() => openEditForm(item, "vegetable")}
                >
                    Edit Stock
                </button>

                <button
                    className="delete-inventory-btn"
                    onClick={() =>
                    handleDeleteInventory(item.id, "vegetable")
                    }
                >
                    Delete
                </button>

                </div>
              </div>
            ))}

          </div>
        </section>

      </main>
    </div>
  );
};

export default AdminInventoryPage;