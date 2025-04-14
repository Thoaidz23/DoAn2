import { useLocation, useNavigate } from "react-router-dom";

import avatar from '../assets/avatar.jpg';

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
    const menuItems = [
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
      ];

      const location = useLocation();
      const navigate = useNavigate();
  
    return (
        <div className="bg-dark text-white vh-100 col-2 d-flex flex-column p-0 border-end border-secondary position-fixed">
        {/* Banner */}
        <div className="text-center py-3 border-bottom border-secondary">
          <h5 className="m-0">TTS-SHOP ADMIN</h5>
        </div>
  
        {/* Avatar admin */}
        <div className="d-flex align-items-center justify-content-center py-4 border-bottom border-secondary gap-3">
          <img
            src={avatar}
            alt="Admin"
            className="rounded-circle"
            width={50}
            height={50}
          />
          <div className="fw-medium text-white">Thành Thưởng</div>
        </div>

  
        {/* Menu */}
        <ul className="nav flex-column mt-3 flex-grow-1">
  {menuItems.map((item, index) => {
    const isActive = location.pathname === item.path;

    return (
      <li className="nav-item" key={index}>
        <button
            type="button"
            className={`nav-link px-4 py-2 d-flex align-items-center gap-2 bg-transparent border-0 w-100 text-start sidebar-button ${
                isActive ? "active-sidebar" : "text-white"
            }`}
            onClick={() => {
                if (!isActive) navigate(item.path);
            }}
        >

          {item.icon}
          <span>{item.label}</span>
        </button>
      </li>
    );
  })}
</ul>

{/* Đăng xuất */}
<div className="border-top border-secondary px-4 py-3">
      <button
        className="btn btn-outline-light w-100 d-flex align-items-center gap-2"
        onClick={() => {
          // Xử lý logout tại đây
          console.log("Đăng xuất");
          navigate("/login"); // ví dụ
        }}
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
  