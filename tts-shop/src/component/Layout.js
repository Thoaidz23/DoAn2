import React from 'react'; // Nếu bạn dùng React Router để quản lý các trang
import '../styles/Layout.scss';

const Layout = ({ children }) => {
  return (
    <div className="layout-container">
       <main className="layout-body">{children}</main>  {/* Hiển thị nội dung */}
    </div>
  );
};

export default Layout;
