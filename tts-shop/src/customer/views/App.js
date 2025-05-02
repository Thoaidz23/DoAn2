import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import NavBar from "../component/NavBar";
import Footer from "../component/Footer";
import ProductDetail from "../views/ProductDetail";
import CartPage from "../views/CartPage"
import { AuthProvider } from "../context/AuthContext"; // ✅ Thêm dòng này
import ScrollToTop from "../component/ScrollToTop"; // 👈 thêm dòng này
import CustomerSupport from "../component/CustomerSP";

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

// 👇 Component bọc App để dùng useLocation
function AppContent() {
  const location = useLocation();
  const hideLayout = location.pathname === "/Payment-momo" || location.pathname === "/Payment-Bank"; // 👈 kiểm tra đường dẫn

  return (
    <>
      <ScrollToTop />
      {!hideLayout && <NavBar />}
      <Suspense fallback={<div className="text-center mt-5">Đang tải trang...</div>}>
        <Routes>
          {routes}
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cartpage/:userId" element={<CartPage />} />
        </Routes>
      </Suspense>
      <Footer />
      <CustomerSupport />

    </>
  );
}

function App() {
  return (
    <AuthProvider> {/* ✅ Bao bọc AppContent bởi AuthProvider */}
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
