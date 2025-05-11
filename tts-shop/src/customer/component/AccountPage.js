// AccountPage.jsx
import React, { useState } from "react";
import AccountBar from "./AccountBar";
import MyAccount from "../views/MyAccount";
import OrderHistory from "../views/OrderHistory";
import ChangePassword from "../views/ChangePassword";
import UpdateAccount from "../views/UpdateAccount";

function AccountPage() {
  const [activeMenu, setActiveMenu] = useState("Tài khoản của bạn");

  const renderContent = () => {
    switch (activeMenu) {
      case "Tài khoản của bạn":
        return <MyAccount />;
      case "Lịch sử mua hàng":
        return <OrderHistory />;
      case "Đổi mật khẩu":
        return <ChangePassword />;
      case "Cập nhật tài khoản":
        return <UpdateAccount />;
      default:
        return <MyAccount />;
    }
  };

  return (
    <div className="account-container">
      <AccountBar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      <div className="account-content">{renderContent()}</div>
    </div>
  );
}

export default AccountPage;
