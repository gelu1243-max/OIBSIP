import LandingPage from "./pages/LandingPage.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx"
import MenuPage from "./pages/MenuPage.jsx"
import CartPage from "./pages/CartPage.jsx"
import "./App.css";
import { BrowserRouter,Routes,Route } from "react-router-dom";

function App() {
  return(
    <BrowserRouter> 
    <Routes>
      <Route path='/' element={<LandingPage/>}/>
      <Route path="/verify-email/:token" element={<VerifyEmail/>}/>
      <Route path="/menu" element={<MenuPage />} />
      <Route path="/cart" element={<CartPage />}
  />
    </Routes>
    </BrowserRouter>
  )
}

export default App;