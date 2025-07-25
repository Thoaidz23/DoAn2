import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import NavBar from "../component/NavBar";
import Footer from "../component/Footer";
import ProductDetail from "../views/ProductDetail";
import BillDetail from "./BillDetail";
import CartPage from "../views/CartPage"
import { AuthProvider,AuthContext } from "../context/AuthContext"; // ✅ Thêm dòng này
import ScrollToTop from "../component/ScrollToTop"; // 👈 thêm dòng này
import CustomerSupport from "../component/CustomerSP";
import CatalogProduct from "./CatalogProduct";
import PostDetail from "./PostDetail"
import ComparePage from "./ComparePage"; // ✅ đường dẫn tới file ComparePage.js


import "../styles/App.scss"
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
      <div style={{marginTop:"10%",background:"white"}}></div>
        <Routes>
          {routes}
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cartpage/:userId" element={<CartPage />} />
          <Route path="/catalogproduct/:id_category" element={<CatalogProduct />} />
          <Route path="/postdetail/:id_post" element={<PostDetail />} />
          <Route path="/bill-detail/:code_order" element={<BillDetail />} />
          <Route path="/compare" element={<ComparePage />} />

        </Routes>
      </Suspense>
      <Footer />
      
      {/* {user && <CustomerSupport /> } */}

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