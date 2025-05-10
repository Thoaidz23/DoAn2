import React, { useState } from "react";
import "../styles/MyAccount.scss";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap-icons/font/bootstrap-icons.css";
import AccountBar from "../component/AccountBar";
import img from "../assets/img/img1.png";

<<<<<<< HEAD
function AccountOverview() {
  const [activeMenu, setActiveMenu] = useState("Cập nhật tài khoản");
  const [editingField, setEditingField] = useState(null);
  const [isChanged, setIsChanged] = useState(false);
=======
const UploadAccount = () => {
  const [activeMenu, setActiveMenu] = useState("Cập nhật tài khoản");
  const [editingField, setEditingField] = useState(null);
  const [isChanged, setIsChanged] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [phoneError, setPhoneError] = useState(""); // Thêm biến lỗi số điện thoại
  const { user } = useContext(AuthContext); // lấy user.id
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("success"); // success | danger | warning
>>>>>>> d796181d0ce5157210794b691833585f6e52a437

  const [userInfo, setUserInfo] = useState({
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com", // không chỉnh sửa
    phone: "0123 456 789",
    address: "123 Đường ABC, Phường XYZ, Quận 1, TP.HCM",
  });

<<<<<<< HEAD
  const handleSave = () => {
    setEditingField(null);
    setIsChanged(false);
    // Ở đây bạn có thể gọi API hoặc localStorage nếu cần
    alert("Đã lưu thay đổi thành công!");
=======
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
>>>>>>> d796181d0ce5157210794b691833585f6e52a437
  };
  

  const renderField = (label, fieldKey, editable = true) => {
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
      <div className="mb-3 position-relative border-1">
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
    <div className="account-overview-container">
      <div className="container">
        <AccountBar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
        
        {/* Thông báo (Alert) hiển thị ngay trên trang */}
        {showAlert && (
          <div
          className="position-fixed top-10 end-0 z-3 "
          style={{
            minWidth: "300px",
            maxWidth: "90%",
            zIndex: 1050,
            marginRight : "290px"
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

        <div className="account-content p-4 bg-white shadow rounded-4">
           <img src={img} alt="Avatar" className="avatar" />
          {renderField("Họ và tên", "name")}
          {renderField("Email", "email", false)} {/* Email: không chỉnh sửa */}
          {renderField("Số điện thoại", "phone")}
          {renderField("Địa chỉ", "address")}

          {/* Nút lưu thay đổi */}
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
        </div>
      </div>
    </div>
  );
}

<<<<<<< HEAD
export default AccountOverview;
=======
export default UploadAccount;
>>>>>>> d796181d0ce5157210794b691833585f6e52a437
