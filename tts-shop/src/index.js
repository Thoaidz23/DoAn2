import reportWebVitals from './reportWebVitals';
import React from "react";
import ReactDOM from "react-dom/client";
// 🔽 Sửa chỗ này để chạy admin
import AdminApp from "./admin/App";  
import "bootstrap/dist/css/bootstrap.min.css";
import "./admin/index.css"; // nếu có file CSS riêng cho admin

// import App from "./views/App";


const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AdminApp />  {/* Gọi App admin để hiển thị trang quản trị */}
  </React.StrictMode>
);

// Performance tracking (giữ nguyên)
reportWebVitals();
