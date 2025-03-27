import React from "react";
import { Link } from "react-router-dom";
import "../styles/header.scss"; // Import SCSS
import logo from "../assets/img/logo.png"; // Import logo image
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min"; // Import Bootstrap JS
import "../styles/navbar.scss"; 

function Navbar() {
  return (
    <header>
      <nav className="navbar navbar-expand-lg fixed-top navbar-dark bg-dark">
        <div className="container">
          {/* Logo */}
          <Link to={"/"} className="navbar-brand">
            <img src={logo} alt="Shop Logo" width="150px" height="50px" />
          </Link>

          {/* Nút Toggle */}
          <button
            className="navbar-toggler bg-dark"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Menu */}
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link to={"/"} className="nav-link fw-semibold">Trang chủ</Link>
              </li>
              <li className="nav-item">
                <Link to={"/shop"} className="nav-link fw-semibold">Cửa hàng</Link>
              </li>
              <li className="nav-item">
                <Link to={"/blog"} className="nav-link fw-semibold">Bài viết</Link>
              </li>
              <li className="nav-item">
                <Link to={"/about"} className="nav-link fw-semibold">Về chúng tôi</Link>
              </li>
              <li className="nav-item">
                <Link to={"/signup"} className="nav-link btn btn-outline-light fw-semibold px-2 mx-1">Tài khoản</Link>
              </li>
              <li className="nav-item">
                <Link to={"/login"} className="nav-link btn btn-outline-light fw-semibold px-2 mx-1">Đăng nhập</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
