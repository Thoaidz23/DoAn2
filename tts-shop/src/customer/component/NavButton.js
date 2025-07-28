import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaList, FaShoppingCart, FaHistory, FaNewspaper } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import "../styles/navbutton.scss";

function NavButton() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleProtectedNavigate = (path) => {
    if (user) {
      navigate(path);
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="nav-button-mobile">
      <Link to="/" className="nav-btn-item">
        <FaHome />
        <span>Trang chủ</span>
      </Link>

      <Link to="/categories" className="nav-btn-item">
        <FaList />
        <span>Danh mục</span>
      </Link>

      <div className="nav-btn-item" onClick={() => handleProtectedNavigate(`/cartpage/${user?.id}`)}>
        <FaShoppingCart />
        <span>Giỏ hàng</span>
      </div>

      <div className="nav-btn-item" onClick={() => handleProtectedNavigate(`/PurchaseHistory`)}>
        <FaHistory />
        <span>Lịch sử</span>
      </div>

      <div className="nav-btn-item" onClick={() => navigate(`/Catalognews`)}>
        <FaNewspaper />
        <span>Bài báo công nghệ</span>
      </div>
    </div>
  );
}

export default NavButton;
