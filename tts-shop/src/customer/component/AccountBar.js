import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../styles/AccountBar.scss";

function AccountBar({ activeMenu, setActiveMenu }) {
  const menuItems = [
    { icon: "bi-person", label: "Tài khoản của bạn" },
    { icon: "bi-receipt", label: "Lịch sử mua hàng" },
    { icon: "bi-search", label: "Đổi mật khẩu" },
    { icon: "bi-pencil-fill", label: "Cập nhật tài khoản" },
    { icon: "bi-box-arrow-right", label: "Thoát tài khoản" },
  ];

  return (
    <div className="sidebar">
      <ul>
        {menuItems.map((item) => (
          <li
            key={item.label}
            className={activeMenu === item.label ? "active" : ""}
            onClick={() => setActiveMenu(item.label)}
          >
            <i className={`bi ${item.icon}`}></i> {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AccountBar;
