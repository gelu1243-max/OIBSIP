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
import AdminInventoryPage from "./pages/AdminInventoryPage.jsx";
import AdminPizzaPage from "./pages/AdminPizzaPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import TrackOrderPage from "./pages/TrackOrderPage";
import ProfilePage from "./pages/ProfilePage";
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
      <Route path="/admin/inventory" element={<AdminInventoryPage />}/>
      <Route path="/admin/pizzas" element={<AdminPizzaPage />}/>
      <Route path="/forgot-password" element={<ForgotPasswordPage />}/>
      <Route path="/reset-password/:token" element={<ResetPasswordPage />}/>
      <Route path="/track-order" element={<TrackOrderPage />}/>
      <Route path="/profile" element={<ProfilePage />}/>
      
    </Routes>
    </BrowserRouter>
  )
}

export default App;