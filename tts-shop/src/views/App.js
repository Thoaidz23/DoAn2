import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import NewPassword from "./NewPassword";
import ForgetPassword from "./ForgetPassword";
import ProductDetail from "./ProductDetail";
import CartPage from "./CartPage";
import "bootstrap-icons/font/bootstrap-icons.css";
import Product from "./Product";
import Catalognews from "./Catalognews";
import PurchaseHistory  from "./PurchaseHistory";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/PurchaseHistory" element={<PurchaseHistory />} />
        <Route path="/catalognews" element={<Catalognews />} /> 
        <Route path="/product" element={<Product />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/newpassword" element={<NewPassword />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />
        <Route path="/productdetail" element={<ProductDetail />} />
        <Route path="/cartpage" element={<CartPage />} />
      </Routes>
    </Router>
  );
}

export default App;
