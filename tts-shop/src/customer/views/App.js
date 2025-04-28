import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import NavBar from "../component/NavBar";
import Footer from "../component/Footer";
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

  // Kiểm tra xem NavBar và CustomerSupport có cần hiển thị không
  const hideLayout = ["/Payment-momo", "/Payment-Bank"].includes(location.pathname);
  const showCustomerSupport = ["/contact", "/help"].includes(location.pathname);

  return (
    <>
      <ScrollToTop />
      {!hideLayout && <NavBar />}
      <Suspense fallback={<div className="text-center mt-5">Đang tải trang...</div>}>
        <Routes>
          {routes}
        </Routes>
      </Suspense>
      <Footer />
      {showCustomerSupport && <CustomerSupport />} {/* Hiển thị CustomerSupport nếu cần */}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
