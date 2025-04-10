import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import NewPassword from "./NewPassword";
import ForgetPassword from "./ForgetPassword";
<<<<<<< HEAD
import ProductDetail from "./ProductDetail";
=======
import ProductDetail from "./ProductDetail"; // Đừng quên import nếu bạn có file này
import "bootstrap-icons/font/bootstrap-icons.css";
import CartPage from "./CartPage";

>>>>>>> c1ec2df6332a27488bc636ce4d7859853803b3eb
function App() {
  return (
    <Router>
      <Routes>
<<<<<<< HEAD
        {/* Trang mặc định */}
        <Route path="/" element={<Home />} />
        
        {/* Nếu vẫn muốn có cả /home */}
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/ProductDetail" element={<ProductDetail />} />
        <Route path="/register" element={<Register />} />
        <Route path="/newpassword" element={<NewPassword />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />
=======
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/CartPage" element={<CartPage />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/newpassword" element={<NewPassword />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />
        <Route path="/productdetail" element={<ProductDetail />} />
>>>>>>> c1ec2df6332a27488bc636ce4d7859853803b3eb
      </Routes>
    </Router>
  );
}

export default App;
