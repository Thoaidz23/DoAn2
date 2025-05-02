import React, { useState } from "react";
import AccountBar from "./AccountBar";
import AccountOverview from "./AccountOverview";  // Thay "MyAccount" bằng "AccountOverview"
import ChangePassword from "./ChangePassword";

function AccountPage() {
  const [activeMenu, setActiveMenu] = useState("Tài khoản của bạn");

  const renderContent = () => {
    switch (activeMenu) {
      case "Tài khoản của bạn":
        return <AccountOverview />;  // Thay "MyAccount" thành "AccountOverview"
      case "Đổi mật khẩu":
        return <ChangePassword />;
      default:
        return <AccountOverview />;
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
