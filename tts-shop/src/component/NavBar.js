import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaShoppingCart, FaUser, FaHistory } from "react-icons/fa"; // Import icons
import "../styles/header.scss";
import logo from "../assets/img/logo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "../styles/navbar.scss";
import "../styles/index.scss";

function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (event) => {
    event.preventDefault();
    console.log("Tìm kiếm:", searchQuery);
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg fixed-top navbar-light bg-white">
        <div className="container">
          {/* Logo */}
          <Link to="/" className="navbar-brand">
            <img src={logo} alt="Shop Logo" width="150px" height="60px" />
          </Link>

          {/* Thanh tìm kiếm với biểu tượng kính lúp */}
          <form className="search-form mx-auto" onSubmit={handleSearch}>
            <div className="search-container">
              <input
                className="form-control search-input"
                type="search"
                placeholder="Tìm kiếm sản phẩm..."
                aria-label="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="search-btn" type="submit">
                <FaSearch />
              </button>
            </div>
          </form>

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
                <Link to="/PurchaseHistory" className="nav-link nav-item-custom px-3">
                  <FaHistory className="nav-icon" /> Lịch sử đơn hàng
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/cart" className="nav-link nav-item-custom px-3">
                  <FaShoppingCart className="nav-icon" /> Giỏ hàng
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/login" className="nav-link btn btn-outline-dark nav-item-custom px-3">
                  <FaUser className="nav-icon" /> Đăng nhập
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      
    </header>
    
  );
}

export default Navbar;
