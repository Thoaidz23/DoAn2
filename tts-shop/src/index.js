import reportWebVitals from './reportWebVitals';
import React from "react";
import ReactDOM from "react-dom/client";
import AdminApp from "./admin/App";
import "bootstrap/dist/css/bootstrap.min.css";
import "./admin/index.css";  // Gọi app trang quản trị

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AdminApp />  {/* Hiển thị giao diện trang quản trị */}
  </React.StrictMode>
);

// Performance tracking
reportWebVitals();
