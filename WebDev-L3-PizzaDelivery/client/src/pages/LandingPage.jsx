import { useState } from "react";

import Navbar from "../components/NavBar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import AuthModal from "../components/AuthModal.jsx";

const LandingPage = () => {
  const [authMode, setAuthMode] = useState(null);

  return (
    <div className="landing-page">

      <Navbar
        onLogin={() => setAuthMode("login")}
        onRegister={() => setAuthMode("register")}
      />

      <main>
        <Hero />

        <Features />
      </main>

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

export default LandingPage;