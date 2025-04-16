import React, { useState } from "react";
import "../styles/MyAccount.scss";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap-icons/font/bootstrap-icons.css";
import AccountBar from "../component/AccountBar";
import img from "../assets/img/img1.png"
function AccountOverview() {
  const [activeMenu, setActiveMenu] = useState("Tài khoản của bạn");

  // Dữ liệu người dùng mẫu
  const userInfo = {
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0123 456 789",
    address: "123 Đường ABC, Phường XYZ, Quận 1, TP.HCM",
  };

  return (
    <div className="account-overview-container">
      <div className="container">
        <AccountBar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
        <div className="account-content p-4 bg-white shadow rounded-4">
          <img src={img} alt="Avatar" className="avatar" />
          <div className="mb-3">
            <strong>Họ và tên:</strong> {userInfo.name}
          </div>
          <div className="mb-3">
            <strong>Email:</strong> {userInfo.email}
          </div>
          <div className="mb-3">
            <strong>Số điện thoại:</strong> {userInfo.phone}
          </div>
          <div className="mb-3">
            <strong>Địa chỉ:</strong> {userInfo.address}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountOverview;
