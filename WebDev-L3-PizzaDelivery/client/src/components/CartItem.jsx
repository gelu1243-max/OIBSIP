import customPizzaImage from "../assets/customPizzaImage.webp";
const CartItem = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  return (
    <div className="cart-item">

      {/* Pizza image */}
      <div className="cart-item-image">
        <img
  src={
    item.isCustom
      ? customPizzaImage
      : item.imageUrl
  }
  alt={item.name}
/>
      </div>

      {/* Pizza information */}
      <div className="cart-item-info">
        <h3>{item.name}</h3>

        <p>
          {item.description ||
            "Delicious freshly prepared pizza."}
        </p>

        <strong>
          ₹{Number(item.price).toFixed(2)}
        </strong>
      </div>

      {/* Quantity and remove */}
      <div className="cart-item-actions">

        <div className="quantity-control">

          <button
            onClick={() =>
              onUpdateQuantity(item.id, -1)
            }
          >
            −
          </button>

          <span>{item.quantity}</span>

          <button
            onClick={() =>
              onUpdateQuantity(item.id, 1)
            }
          >
            +
          </button>

        </div>

        <button
          className="remove-btn"
          onClick={() => onRemove(item.id)}
        >
          Remove
        </button>

      </div>

    </div>
  );
};

export default CartItem;