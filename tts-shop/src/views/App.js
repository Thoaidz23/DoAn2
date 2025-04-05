import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import "bootstrap-icons/font/bootstrap-icons.css";
import Login from "./Login";

function App() {
  return (
    <Router>
      <Routes>
        {/* Trang mặc định */}
        <Route path="/" element={<Home />} />

        {/* Nếu vẫn muốn có cả /home */}
        <Route path="/home" element={<Home />} />
        
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
