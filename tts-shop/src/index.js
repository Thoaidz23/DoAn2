import reportWebVitals from './reportWebVitals';
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./views/App";  // Đường dẫn đúng đến App.js
import "bootstrap/dist/css/bootstrap.min.css";
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />  {/* Gọi App.js để hiển thị trang web */}
  </React.StrictMode>
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
