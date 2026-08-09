import heroImage from "../assets/hero.png";

const Hero = () => {
  return (
    <section className="hero">

      <div className="hero-content">

        <div className="hero-badge">
          🔥 HOT & DELICIOUS
        </div>

        <h1>
          Delicious Pizza,
          <br />
          <span>Delivered</span> to You
        </h1>

        <p>
          Order your favorite pizza or create your own
          custom pizza with your favorite ingredients.
        </p>

        <div className="hero-buttons">

          <button className="order-btn">
            🍕 Order Now
          </button>

          <button className="menu-btn">
            ▶ View Menu
          </button>

        </div>

        <div className="rating">

          <div className="rating-stars">
            ⭐⭐⭐⭐⭐
          </div>

          <strong>4.8</strong>

          <span>
            (2.5k+ reviews)
          </span>

        </div>

      </div>

      <div className="hero-image">
        <img
          src={heroImage}
          alt="Delicious pizza"
        />
      </div>

    </section>
  );
};

export default Hero;