import reportWebVitals from './reportWebVitals';
import React from "react";
import ReactDOM from "react-dom/client";
import AdminApp from "./customer/views/App";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AdminApp />  {/* Hiển thị giao diện trang quản trị */}
  </React.StrictMode>
);

// Performance tracking
reportWebVitals();
