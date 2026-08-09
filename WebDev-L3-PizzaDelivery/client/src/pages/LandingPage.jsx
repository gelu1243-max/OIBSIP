import Navbar from "../components/NavBar";
import Hero from "../components/Hero";
import Features from "../components/Features";

const LandingPage = () => {
  return (
    <div className="landing-page">

      <Navbar />

      <main>
        <Hero />

        <Features />
      </main>

    </div>
  );
};

export default LandingPage;