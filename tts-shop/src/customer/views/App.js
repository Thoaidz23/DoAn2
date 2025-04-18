import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "../component/NavBar";
import Footer from "../component/Footer";
import CustomerSupport from "../component/CustomerSP";
import ProductDetail from "./ProductDetail"; // 👈 import trực tiếp

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

function App() {
  return (
    <Router>
      <NavBar />
      <Suspense fallback={<div className="text-center mt-5">Đang tải trang...</div>}>
        <Routes>
          {routes}
          <Route path="/product/:id" element={<ProductDetail />} /> {/* 👈 Thêm dòng này */}
        </Routes>
      </Suspense>
      <Footer />
      <CustomerSupport />
    </Router>
  );
}

export default App;
