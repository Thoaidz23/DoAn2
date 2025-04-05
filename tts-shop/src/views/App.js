import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import NewPassword from "./NewPassword";
import ForgetPassword from "./ForgetPassword";
import ProductDetail from "./ProductDetail";  // Import missing component

import "bootstrap-icons/font/bootstrap-icons.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Trang mặc định */}
        <Route path="/" element={<Home />} />

        {/* Trang Home */}
        <Route path="/home" element={<Home />} />
        
        {/* Các route cho trang login, register, password */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/newpassword" element={<NewPassword />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />

        {/* Chi tiết sản phẩm */}
        <Route path="/productdetail" element={<ProductDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
