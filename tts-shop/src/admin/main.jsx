import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // nếu bạn có style riêng cho admin

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
