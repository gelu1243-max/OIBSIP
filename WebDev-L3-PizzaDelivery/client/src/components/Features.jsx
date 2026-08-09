import FeatureCard from "./FeatureCard";

const Features = () => {

  const features = [
    {
      icon: "🛵",
      title: "Fast Delivery",
      description: "30–40 mins",
    },
    {
      icon: "🌿",
      title: "Fresh Ingredients",
      description: "100% Quality",
    },
    {
      icon: "🛡️",
      title: "Secure Payment",
      description: "Safe & Reliable",
    },
    {
      icon: "🏷️",
      title: "Best Prices",
      description: "Affordable for all",
    },
  ];

  return (
    <section className="features">

      {features.map((feature) => (
        <FeatureCard
          key={feature.title}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
        />
      ))}

    </section>
  );
};

export default Features;