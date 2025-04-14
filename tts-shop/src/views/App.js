import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
<<<<<<< HEAD
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import NewPassword from "./NewPassword";
import ForgetPassword from "./ForgetPassword";
import ProductDetail from "./ProductDetail";  // Import missing component

import "bootstrap-icons/font/bootstrap-icons.css";
=======

// Tự động import toàn bộ component trong views (trừ App.js)
const pages = require.context("./", true, /^\.\/(?!App\.js$).*\.js$/);

const routes = pages.keys().map((key) => {
  const name = key.replace("./", "").replace(".js", "").toLowerCase();
  const Component = pages(key).default;

  return (
    <Route
      key={name}
      path={name === "home" ? "/" : `/${name}`}
      element={<Component />}
    />
  );
});
>>>>>>> 390c6d14e971b0264401378996f159c39fc0715a

function App() {
  return (
    <Router>
<<<<<<< HEAD
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
=======
      <Suspense fallback={<div>Đang tải trang...</div>}>
        <Routes>{routes}</Routes>
      </Suspense>
>>>>>>> 390c6d14e971b0264401378996f159c39fc0715a
    </Router>
  );
}

export default App;
