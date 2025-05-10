import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaShoppingCart, FaUser, FaSignOutAlt, FaHistory } from "react-icons/fa";
import logo from "../assets/img/logo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/navbar.scss";

function Navbar() {
  const { user, logout } = useContext(AuthContext); // Lấy user từ context
  const [searchQuery, setSearchQuery] = useState("");
  // Xử lý sự kiện tìm kiếm
  const handleSearch = (event) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search/${searchQuery}`); // Điều hướng đến trang kết quả tìm kiếm
    }
  };
  
  const navigate = useNavigate();

  const handleToCart = () => {
    if (user) {
      navigate(`/cartpage/${user.id}`);
    } else {
      alert("Vui lòng đăng nhập để tiếp tục."); // Thông báo trước khi redirect
      navigate("/login");
    }
  };
<<<<<<< HEAD
=======
  const handleToHistory  = () => {
    if (user) {
      navigate(`/PurchaseHistory`);
    } else {
      setShowError(true); // Nếu chưa đăng nhập, hiển thị thông báo lỗi
      // Tắt thông báo sau 3 giây
      setTimeout(() => {
        setShowError(false); // Ẩn thông báo sau 3 giây
      }, 3000);
      navigate("/login");
    }
  };

>>>>>>> d796181d0ce5157210794b691833585f6e52a437
  
  
  return (
    <header>
      <nav className="navbar navbar-expand-lg fixed-top navbar-light bg-white">
        <div className="container">
<<<<<<< HEAD
=======
          {showError && (
              <div className="error-message">
                <p>Vui lòng đăng nhập</p>
              </div>
            )}
             
>>>>>>> d796181d0ce5157210794b691833585f6e52a437
          {/* Logo */}
          <Link to="/" className="navbar-brand">
            <img src={logo} alt="Shop Logo" width="150px" height="60px" />
          </Link>

          {/* Thanh tìm kiếm */}
          <form className="search-form" onSubmit={handleSearch}>
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

          {/* Menu */}
          <ul className="navbar-nav ms-auto">
            <li onClick={handleToHistory} className="nav-item" style={{cursor:"pointer"}}>
              <div className="nav-link-item px-3">
                <FaHistory /> Lịch sử đơn hàng
              </div>
            </li>
            <li className="nav-item">
              <div onClick={handleToCart} className="nav-link-item px-3" style={{cursor:"pointer"}}>
                <FaShoppingCart /> Giỏ hàng
              </div>
            </li>
            <li className="nav-item">
              {user ? (
                <>
                  <Link to="/MyAccount" className="nav-link-item px-3 fw-bold">
                    <FaUser /> {user.name}
                  </Link>
                  <button className="btn btn-outline-dark ms-2" onClick={logout}>
                    <FaSignOutAlt /> Đăng xuất
                  </button>
                </>
              ) : (
                <Link to="/login" className="nav-link-item btn btn-outline-dark nav-item-custom px-3">
                  <FaUser /> Đăng nhập
                </Link>
              )}
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
