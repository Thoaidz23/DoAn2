import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "../styles/MyAccount.scss";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap-icons/font/bootstrap-icons.css";
import AccountBar from "../component/AccountBar";
import img from "../assets/img/img1.png";

// ... các import khác
const AccountOverview = () => {
  const [activeMenu, setActiveMenu] = useState("Cập nhật tài khoản");
  const [editingField, setEditingField] = useState(null);
  const [isChanged, setIsChanged] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const { user } = useContext(AuthContext); // lấy user.id

  useEffect(() => {
    if (user && user.id) {
      axios
        .get(`http://localhost:5000/api/upload-account/${user.id}`)
        .then((res) => setUserInfo(res.data))
        .catch((err) => console.error("Lỗi lấy thông tin:", err));
    }
  }, [user]);

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/api/upload-account/${user.id}`, userInfo);
      alert("Đã lưu thay đổi thành công!");
      setEditingField(null);
      setIsChanged(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      alert("Cập nhật thất bại!");
    }
  };

  const renderField = (label, fieldKey, editable = true) => {
    if (!userInfo) return null;
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
          {renderField("Email", "email", false)}
          {renderField("Số điện thoại", "phone")}
          {renderField("Địa chỉ", "address")}
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
};

export default AccountOverview;


