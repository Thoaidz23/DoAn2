import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import NavBar from "../component/NavBar";
import Footer from "../component/Footer";

const pages = require.context("./", true, /^\.\/(?!App\.js$).*\.js$/);

const routes = pages.keys().map((key) => {
  const name = key.replace("./", "").replace(".js", "").toLowerCase();
  const Component = pages(key).default;

  return (
    <Route
      key={name}
      path={name === "home" ? "/" : `/${name}`}
      element={<Component />}
      index={name === "home"}
    />
  );
});

function AppContent() {
  const location = useLocation();
  const hideLayout = location.pathname === "/Payment-momo" || location.pathname === "/Payment-Bank";

  return (
    <>
      {!hideLayout && <NavBar />}
      <Suspense fallback={<div className="text-center mt-5">Đang tải trang...</div>}>
        <Routes key={location.pathname}>
          {routes}
        </Routes>
      </Suspense>
      {!hideLayout && <Footer />}
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
