import React from "react";
import Navbar from "../component/NavBar";
import MenuBar from "../component/MenuBar";
import "../styles/home.scss";
import "../styles/ProductDetail.scss";
import '../styles/index.scss';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
function Home() {
  return (
    <div>
      {/* Navbar */}
      <Navbar />
      {/* MenuBar */}
      <div className="menu-wrapper">
        <MenuBar />
      </div>
      {/* Nội dung chính */}
      <div className="container">
      <main className="container-content">
         {/* Banner quảng cáo */}
      <div className="banner">
        <img src="/path/to/banner.jpg" alt="Banner Quảng Cáo" />
      </div>
      </main>
      </div>
    </div>
  );
}

export default Home;
