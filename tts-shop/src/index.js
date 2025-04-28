import reportWebVitals from './reportWebVitals';
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./customer/views/App";
import "bootstrap/dist/css/bootstrap.min.css";
import "./customer/styles/index.scss";  // Gọi app trang quản trị

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />  {/* Hiển thị giao diện trang quản trị */}
  </React.StrictMode>
);

// Performance tracking
reportWebVitals();
