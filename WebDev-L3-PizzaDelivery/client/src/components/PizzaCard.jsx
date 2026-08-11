const PizzaCard = ({ pizza, onAddToCart }) => {
  return (
    <div className="pizza-card">
      <div className="pizza-image-container">
        <img
          src={pizza.imageUrl}
          alt={pizza.name}
          className="pizza-card-image"
        />
      </div>

      <div className="pizza-card-content">
        <h3>{pizza.name}</h3>

        <p className="pizza-description">
          {pizza.description || "Delicious freshly prepared pizza."}
        </p>

        <div className="pizza-card-bottom">
          <span className="pizza-price">
            ₹{pizza.price}
          </span>

          <button
            className="add-cart-btn"
            onClick={() => onAddToCart(pizza)}
            disabled={pizza.stock <= 0}
          >
            {pizza.stock <= 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PizzaCard;