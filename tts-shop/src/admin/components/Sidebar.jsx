import { useLocation, useNavigate } from "react-router-dom";
import React, { useContext, useEffect } from "react";

import avatar from '../assets/avatar.jpg';
import { AuthContext } from "../../customer/context/AuthContext";

import {
  Box,
  List,
  FileText,
  Newspaper,
  Tags,
  UserCog,
  Users,
  BarChart2,
  Image,
  Layout,
  Receipt,
} from "lucide-react";

const Sidebar = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const getFullName = (name) => {
    const nameParts = name.split(" ");
    return nameParts.length >= 2 ? `${nameParts[nameParts.length - 2]} ${nameParts[nameParts.length - 1]}` : name;
  };

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user) return null;

const handleLogout = () => {
  logout(); // Đảm bảo trạng thái user trong context được cập nhật
  navigate("/"); // Điều hướng người dùng về trang đăng nhập hoặc trang chủ
   window.location.reload();
};


  let menuItems = [];

  if (user.role === 1) {
    menuItems = [
      { label: "Thống kê", icon: <BarChart2 size={18} />, path: "/admin/dashboard" },
      { label: "Đơn hàng", icon: <Receipt size={18} />, path: "/admin/order" },
      { label: "Banner", icon: <Image size={18} />, path: "/admin/banner" },
      { label: "Sản phẩm", icon: <Box size={18} />, path: "/admin/product" },
      { label: "Danh mục sản phẩm", icon: <List size={18} />, path: "/admin/productcategory" },
      { label: "Danh mục thương hiệu", icon: <Tags size={18} />, path: "/admin/brandcategory" },
      { label: "Bài viết", icon: <FileText size={18} />, path: "/admin/post" },
      { label: "Danh mục bài viết", icon: <Newspaper size={18} />, path: "/admin/postcategory" },
      { label: "Tài khoản nhân viên", icon: <UserCog size={18} />, path: "/admin/staffaccount" },
      { label: "Tài khoản khách hàng", icon: <Users size={18} />, path: "/admin/customeraccount" },
      { label: "Footer", icon: <Layout size={18} />, path: "/admin/footer" },
    ]
  } else {
    menuItems = [
      { label: "Thống kê", icon: <BarChart2 size={18} />, path: "/admin/dashboard" },
      { label: "Đơn hàng", icon: <Receipt size={18} />, path: "/admin/order" },
      { label: "Banner", icon: <Image size={18} />, path: "/admin/banner" },
      { label: "Sản phẩm", icon: <Box size={18} />, path: "/admin/product" },
      { label: "Bài viết", icon: <FileText size={18} />, path: "/admin/post" },
      { label: "Tài khoản khách hàng", icon: <Users size={18} />, path: "/admin/customeraccount" },

    ];
  }

  return (
    <div className="bg-dark text-white vh-100 col-2 d-flex flex-column p-0 border-end border-secondary position-fixed">
      <div className="text-center py-3 border-bottom border-secondary">
        {user.role === 1 ? (
          <h5 className="m-0">TTS-SHOP ADMIN</h5>
        ) : (
          <h5 className="m-0">TTS-SHOP EMPLOYEE</h5>
        )}
      </div>

      <div className="d-flex align-items-center justify-content-center py-4 border-bottom border-secondary gap-3">
        {user.role === 1 ? (
          <>
          <img
            src={avatar}
            alt="Admin"
            className="rounded-circle"
            width={50}
            height={50}
          />
           <div className="fw-medium text-white">{getFullName(user.name) || "Employee"}</div>
          </>
        ) : (
          <>
            <img
              src="data:image/png;base64,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"
              alt="Employee"
              className="rounded-circle"
              width={50}
              height={50}
            />
            <div className="fw-medium text-white">{getFullName(user.name) || "Employee"}</div>
          </>
        )}
      </div>

      <ul className="nav flex-column mt-3 flex-grow-1">
  {menuItems.map((item, index) => {
    const isActive = location.pathname === item.path;
    return (
      <li className="nav-item" key={index}>
        {item.action ? (
          <button
            type="button"
            className="nav-link px-4 py-2 d-flex align-items-center gap-2 bg-transparent border-0 w-100 text-start sidebar-button text-white"
            onClick={item.action}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ) : (
          <button
            type="button"
            className={`nav-link px-4 py-2 d-flex align-items-center gap-2 bg-transparent border-0 w-100 text-start sidebar-button ${isActive ? "active-sidebar" : "text-white"}`}
            onClick={() => !isActive && navigate(item.path)}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        )}
      </li>
    );
  })}
</ul>

        {/* Nút Đăng Xuất */}
        <div className="logout-button">
          <button
            className="btn btn-outline-light w-100 d-flex align-items-center gap-2"
            onClick={handleLogout}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="currentColor"
              className="bi bi-box-arrow-right"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M10 12.5a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0 0 1h2.5v8H10.5a.5.5 0 0 0-.5.5z"
              />
              <path
                fillRule="evenodd"
                d="M4.854 11.354a.5.5 0 0 0 0-.708L2.707 8.5H10a.5.5 0 0 0 0-1H2.707l2.147-2.146a.5.5 0 1 0-.708-.708l-3 3a.5.5 0 0 0 0 .708l3 3a.5.5 0 0 0 .708 0z"
              />
            </svg>
            <span>Đăng xuất</span>
          </button>
        </div>

    </div>
  );
};

export default Sidebar;
