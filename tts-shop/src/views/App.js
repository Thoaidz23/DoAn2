import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import ProductDetail from "./ProductDetail";
import "bootstrap-icons/font/bootstrap-icons.css";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="home" element={<Home />} />
        <Route path="/productdetail" element={<ProductDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
