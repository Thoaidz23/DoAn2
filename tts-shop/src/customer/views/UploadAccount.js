import React, { useState } from "react";
import "../styles/MyAccount.scss";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap-icons/font/bootstrap-icons.css";
import AccountBar from "../component/AccountBar";
import img from "../assets/img/img1.png";

function AccountOverview() {
  const [activeMenu, setActiveMenu] = useState("Cập nhật tài khoản");
  const [editingField, setEditingField] = useState(null);
  const [isChanged, setIsChanged] = useState(false);

  const [userInfo, setUserInfo] = useState({
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com", // không chỉnh sửa
    phone: "0123 456 789",
    address: "123 Đường ABC, Phường XYZ, Quận 1, TP.HCM",
  });

  const handleSave = () => {
    setEditingField(null);
    setIsChanged(false);
    // Ở đây bạn có thể gọi API hoặc localStorage nếu cần
    alert("Đã lưu thay đổi thành công!");
  };

  const renderField = (label, fieldKey, editable = true) => {
    const isEditing = editingField === fieldKey;

    const handleChange = (e) => {
      setUserInfo((prev) => ({
        ...prev,
        [fieldKey]: e.target.value,
      }));
      setIsChanged(true);
    };

    return (
      <div className="mb-3 position-relative">
        <strong>{label}:</strong>{" "}
        {isEditing ? (
          <input
            type="text"
            className="form-control mt-2"
            value={userInfo[fieldKey]}
            onChange={handleChange}
            onBlur={() => setEditingField(null)}
            autoFocus
          />
        ) : (
          <>
            {userInfo[fieldKey]}
            {editable && (
              <i
                className="bi bi-pencil-square position-absolute" 
                style={{ right: "2rem", top: "0", cursor: "pointer" }}
                onClick={() => setEditingField(fieldKey)}
              ></i>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="account-overview-container">
      <div className="container">
        <AccountBar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
        <div className="account-content p-4 bg-white shadow rounded-4">
           <img src={img} alt="Avatar" className="avatar" />
          {renderField("Họ và tên", "name")}
          {renderField("Email", "email", false)} {/* Email: không chỉnh sửa */}
          {renderField("Số điện thoại", "phone")}
          {renderField("Địa chỉ", "address")}

          {/* Nút lưu thay đổi */}
          {isChanged && (
            <div className="mt-4 text-end">
              <button className="btn btn-primary" onClick={handleSave}>
                Lưu thay đổi
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AccountOverview;
