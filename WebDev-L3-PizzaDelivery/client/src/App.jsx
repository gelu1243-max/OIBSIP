import LandingPage from "./pages/LandingPage.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx"
import MenuPage from "./pages/MenuPage.jsx"
import CartPage from "./pages/CartPage.jsx"
import CheckoutPage from "./pages/CheckoutPage.jsx"
import CustomPizzaPage from "./pages/CustomPizzaPage";
import OrderSuccessPage from "./pages/OrderSuccessPage.jsx"
import OrdersPage from "./pages/OrdersPage.jsx"
import AdminDashboard from "./pages/AdminDashboard.jsx"
import AdminOrdersPage from "./pages/AdminOrdersPage.jsx";
import "./App.css";
import { BrowserRouter,Routes,Route } from "react-router-dom";

function App() {
  return(
    <BrowserRouter> 
    <Routes>
      <Route path='/' element={<LandingPage/>}/>
      <Route path="/verify-email/:token" element={<VerifyEmail/>}/>
      <Route path="/menu" element={<MenuPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />}/>
      <Route path="/custom-pizza" element={<CustomPizzaPage />}/>
      <Route path="/order-success" element={<OrderSuccessPage/>}/>
      <Route path="/orders" element={<OrdersPage/>}/>
      <Route path="/admin/dashboard" element={<AdminDashboard/>}/>
      <Route path="/admin/orders" element={<AdminOrdersPage />}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App;