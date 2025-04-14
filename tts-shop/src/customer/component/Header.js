import React from "react";
import "../styles/header.scss"; // Import SCSS
import logoImage from "../assets/img/logo.png"; // Import ảnh logo
import { BsSearch, BsCart, BsPerson, BsClockHistory } from "react-icons/bs"; // Import icon Bootstrap

function Header() {
  return (
    <div className="header container">
  <div className="row align-items-center g-1"> {/* Giảm khoảng cách giữa các cột */}
    <div className="col-2">
      <img src={logoImage} alt="Shop Logo" className="logo" />
    </div>
    <div className="col-4">
      <div className="input-group">
        <input type="text" className="form-control" placeholder="Tìm kiếm sản phẩm..." />
        <span className="input-group-text"><BsSearch /></span>
      </div>
    </div>
    <div className="col-2 text-center">
      <button className="btn btn-warning"><BsClockHistory className="icon" /> Lịch sử hóa đơn</button>
    </div>
    <div className="col-2 text-center">
      <button className="btn btn-primary"><BsCart className="icon" /> Giỏ hàng</button>
    </div>
    <div className="col-2 text-center">
      <button className="btn btn-success"><BsPerson className="icon" /> Đăng nhập</button>
    </div>
  </div>
</div>

  );
}

export default Header;
