import LandingPage from "./pages/LandingPage.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx"
import "./App.css";
import { BrowserRouter,Routes,Route } from "react-router-dom";

function App() {
  return(
    <BrowserRouter> 
    <Routes>
      <Route path='/' element={<LandingPage/>}/>
      <Route path="/verify-email/:token" element={<VerifyEmail/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App;