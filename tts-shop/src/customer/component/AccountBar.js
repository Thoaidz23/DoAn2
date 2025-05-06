import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../styles/AccountBar.scss";

function AccountBar({ activeMenu, setActiveMenu }) {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { icon: "bi-person", label: "Tài khoản của bạn", path: "/MyAccount" },
    { icon: "bi-receipt", label: "Lịch sử mua hàng", path: "/purchaseHistory" },
    { icon: "bi-search", label: "Đổi mật khẩu", path: "/ChangePassword" },
    { icon: "bi-pencil-fill", label: "Cập nhật tài khoản", path: "/UploadAccount" },
    { icon: "bi-box-arrow-right", label: "Đăng xuất", path: null },
  ];

  return (
    <div className="sidebar">
      <ul>
        {menuItems.map((item) => (
          <li
            key={item.label}
            className={activeMenu === item.label ? "active" : ""}
            onClick={() => {
              setActiveMenu(item.label);
              if (item.label === "Đăng xuất") {
                setShowLogoutConfirm(true);
              } else {
                navigate(item.path);
              }
            }}
          >
            <i className={`bi ${item.icon}`}></i>
            <span>{item.label}</span>
          </li>
        ))}
      </ul>

      {/* Modal xác nhận đăng xuất */}
      {showLogoutConfirm && (
        <div className="logout-modal">
          <div className="modal-content">
            <p>Bạn muốn thoát tài khoản?</p>
            <div className="modal-buttons">
              <button className="cancel" onClick={() => setShowLogoutConfirm(false)}>
                Không
              </button>
              <button className="confirm" onClick={handleLogout}>
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccountBar;
