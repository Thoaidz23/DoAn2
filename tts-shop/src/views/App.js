import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "../component/NavBar"
import Footer from "../component/Footer"
// Tự động import toàn bộ trang trong views (trừ App.js)
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
      <Suspense fallback={<div>Đang tải trang...</div>}>
        <NavBar></NavBar>
        <Routes>{routes}</Routes>
        <Footer></Footer>
      </Suspense>

    </Router>
  );
}

export default App;
