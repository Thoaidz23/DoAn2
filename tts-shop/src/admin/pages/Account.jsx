import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../customer/context/AuthContext";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate } from "react-router-dom"; 

const UploadAccount = () => {
  const [editingField, setEditingField] = useState(null);
  const [isChanged, setIsChanged] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [phoneError, setPhoneError] = useState(""); // Thêm biến lỗi số điện thoại
  const { user, logout } = useContext(AuthContext); // lấy user.id
  
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("success"); // success | danger | warning
  const [isLocking, setIsLocking] = useState(false);
  const navigate = useNavigate();

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
      setAlertMessage("Đã lưu thay đổi thành công!");
      setAlertVariant("success");
      setShowAlert(true);
      setEditingField(null);
      setIsChanged(false);

      // Tắt thông báo sau 1 giây
      setTimeout(() => {
        setShowAlert(false);
      }, 1000); // 1 giây

    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      setAlertMessage("Cập nhật thất bại!");
      setAlertVariant("danger");
      setShowAlert(true);

      // Tắt thông báo sau 1 giây
      setTimeout(() => {
        setShowAlert(false);
      }, 1000); // 1 giây
    }
  };

  const handleChangePassword = () => {
    // Điều hướng đến trang đổi mật khẩu
    navigate("/admin/AddminChangePW");
  };

  const renderField = (label, fieldKey, editable = true) => {
    if (!userInfo) return null;
    const isEditing = editingField === fieldKey;

    const handleChange = (e) => {
      const value = e.target.value;

      if (fieldKey === "phone") {
        if (/[^\d]/.test(value)) {
          setPhoneError("Số điện thoại không được chứa chữ!");
        } else if (value.length < 9 || value.length > 11) {
          setPhoneError("Số điện thoại chỉ được phép từ 9-11 số!");
        } else {
          setPhoneError("");
        }
      }

      setUserInfo((prev) => ({
        ...prev,
        [fieldKey]: value,
      }));

      setIsChanged(true);
    };

    return (
      <div className="mb-3 position-relative border-1 text-white">
        <strong>{label}:</strong>{" "}
        {isEditing ? (
          <>
            <input
              type="text"
              className="form-control mt-2"
              value={userInfo[fieldKey]}
              onChange={handleChange}
              onBlur={() => setEditingField(null)}
              autoFocus
            />
            {fieldKey === "phone" && phoneError && (
              <div className="text-danger mt-1">{phoneError}</div>
            )}
          </>
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
    <div className="account-overview-container" style={{ color: "white", backgroundColor: "#333" }}>
      <div className="container">
        
        {/* Thông báo (Alert) hiển thị ngay trên trang */}
        {showAlert && (
          <div
            className="position-fixed top-10 end-0 z-3 "
            style={{
              minWidth: "300px",
              maxWidth: "90%",
              zIndex: 1050,
              marginRight: "290px",
            }}
          >
            <div className={`alert alert-${alertVariant} alert-dismissible fade show text-center`} role="alert">
              {alertMessage}
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowAlert(false)}
              ></button>
            </div>
          </div>
        )}

        <div className="account-content p-4 bg-dark text-light shadow rounded-4" style={{ margin: "5% 0 0 12.7%" }}>
          <img src="data:image/png;base64,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" alt="Avatar" className="avatar" />
          {renderField("Họ và tên", "name")}
          {renderField("Email", "email", false)}
          {renderField("Số điện thoại", "phone")}
          {renderField("Địa chỉ", "address")}
          {isChanged && (
            <div className="mt-4 text-end">
              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={!!phoneError}
                style={{
                  opacity: phoneError ? 0.3 : 1,
                  pointerEvents: phoneError ? "none" : "auto",
                }}
              >
                Lưu thay đổi
              </button>
            </div>
          )}
          
          {/* Nút đổi mật khẩu */}
          <div className="mt-4 text-end">
            <button className="btn btn-warning" onClick={handleChangePassword}>
              Đổi mật khẩu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadAccount;
