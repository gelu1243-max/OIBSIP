const Navbar = ({onLogin, onRegister}) => {
  return (
    <nav className="navbar">

      <div className="navbar-logo">
        <span className="pizza-icon">🍕</span>
        <span>
          Pizza<span>Delivery</span>
        </span>
      </div>

      <div className="nav-links">
        <a href="/">Home</a>
        <a href="/menu">Menu</a>
        <a href="/custom-pizza">Custom Pizza</a>
        <a href="/track-order">Track Order</a>
      </div>

      <div className="nav-actions">
        <button className="login-btn"
        onClick={onLogin}>
          Login
        </button>

        <button className="register-btn"
        onClick={onRegister}>
          Register
        </button>
      </div>

    </nav>
  );
};

export default Navbar;