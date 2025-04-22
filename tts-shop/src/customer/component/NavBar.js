import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaShoppingCart, FaUser, FaHistory } from "react-icons/fa";
import logo from "../assets/img/logo.png";
import "bootstrap/dist/css/bootstrap.min.css";
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
          <div className="navbar-header">
            <Link to="/" className="navbar-brand">
              <img src={logo} alt="Shop Logo" width="150px" height="60px" />
            </Link>
          </div>

          {/* Thanh tìm kiếm */}
          <form className="search-form " onSubmit={handleSearch}>
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

          {/* Menu luôn hiển thị */}
          <ul className="navbar-nav ">
            <li className="nav-item">
              <Link to="/PurchaseHistory" className="nav-link-item nav-item-custom px-3">
                <FaHistory className="nav-icon" /> Lịch sử đơn hàng
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/CartPage" className="nav-link-item nav-item-custom px-3">
                <FaShoppingCart className="nav-icon" /> Giỏ hàng
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/login" className="nav-link-item btn btn-outline-dark nav-item-custom px-3">
                <FaUser className="nav-icon" /> Đăng nhập
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
