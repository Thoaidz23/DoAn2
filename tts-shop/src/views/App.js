import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import ProductDetail from "./ProductDetail";
import "bootstrap-icons/font/bootstrap-icons.css";
import Login from "./Login";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="home" element={<Home />} />
        <Route path="/productdetail" element={<ProductDetail />} />
        <Route path="Login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
