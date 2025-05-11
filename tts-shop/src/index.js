import reportWebVitals from './reportWebVitals';
import React from "react";
import ReactDOM from "react-dom/client";
import AppAdmin from "./admin/App";  
// import App from "./customer/views/App";
import "bootstrap/dist/css/bootstrap.min.css";
// import "./customer/styles/index.scss";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    {/* <App />  */}
    <AppAdmin></AppAdmin>
  </React.StrictMode>
);

// Performance tracking
reportWebVitals();
