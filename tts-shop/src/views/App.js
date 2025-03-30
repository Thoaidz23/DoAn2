import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import ProductDetail from "./ProductDetail";
import "bootstrap-icons/font/bootstrap-icons.css";
import Login from "./Login";
import Register from "./Register";
import NewPassword from "./NewPassword"
import ForgetPassword from "./ForgetPassword"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="home" element={<Home />} />
        <Route path="/productdetail" element={<ProductDetail />} />
        <Route path="Login" element={<Login />} />
        <Route path="Register" element={<Register />} />
        <Route path="NewPassword" element={<NewPassword />} />
        <Route path="ForgetPassword" element={<ForgetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
