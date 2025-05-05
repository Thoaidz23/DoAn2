import React,{useContext} from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../styles/AccountBar.scss";

function AccountBar({ activeMenu, setActiveMenu }) {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const menuItems = [
    { icon: "bi-person", label: "Tài khoản của bạn", path: "/MyAccount" },
    { icon: "bi-receipt", label: "Lịch sử mua hàng", path: "/purchaseHistory" },
    { icon: "bi-search", label: "Đổi mật khẩu", path: "/ChangePassword" },
    { icon: "bi-pencil-fill", label: "Cập nhật tài khoản", path: "/UploadAccount" },
    { icon: "bi-box-arrow-right", label: "Thoát tài khoản", path: "/logout" },
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
            if (item.label === "Thoát tài khoản") {
              navigate("/");
              logout();
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
    </div>
  );
}

export default AccountBar;
