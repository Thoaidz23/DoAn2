// src/components/Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';  // Nếu bạn dùng React Router để quản lý các trang
import '../styles/Layout.scss';

const Layout = () => {
  return (
    <div className="layout-container">
      <header className="layout-header">
        {/* Header chung cho tất cả các trang */}
        <h1>Logo và Tiêu đề</h1>
      </header>
      
      <main className="layout-body">
        {/* Phần thân chính của trang sẽ được render ở đây */}
        <Outlet />
      </main>

      <footer className="layout-footer">
        {/* Footer chung cho tất cả các trang */}
        <p>&copy; 2025 Công ty của tôi. Tất cả quyền lợi được bảo lưu.</p>
      </footer>
    </div>
  );
};

export default Layout;
