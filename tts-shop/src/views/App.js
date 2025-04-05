import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import "bootstrap-icons/font/bootstrap-icons.css";
import Login from "./Login";
<<<<<<< HEAD
=======
import Register from "./Register";
import NewPassword from "./NewPassword"
import ForgetPassword from "./ForgetPassword"
>>>>>>> ea016cc7e640f96546117fa8646a2713a3e16249

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
=======
        <Route path="home" element={<Home />} />
        <Route path="/productdetail" element={<ProductDetail />} />
        <Route path="Login" element={<Login />} />
        <Route path="Register" element={<Register />} />
        <Route path="NewPassword" element={<NewPassword />} />
        <Route path="ForgetPassword" element={<ForgetPassword />} />
>>>>>>> ea016cc7e640f96546117fa8646a2713a3e16249
      </Routes>
    </Router>
  );
}

export default App;
