import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "../styles/MyAccount.scss";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap-icons/font/bootstrap-icons.css";
import AccountBar from "../component/AccountBar";
import { useNavigate } from "react-router-dom"; 

const UploadAccount = () => {
  const [activeMenu, setActiveMenu] = useState("Cập nhật tài khoản");
  const [editingField, setEditingField] = useState(null);
  const [isChanged, setIsChanged] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [phoneError, setPhoneError] = useState(""); // Thêm biến lỗi số điện thoại
  const { user,logout } = useContext(AuthContext); // lấy user.id
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("success"); // success | danger | warning
  const [isLocking, setIsLocking] = useState(false);
  const [showConfirmPanel, setShowConfirmPanel] = useState(false);

 const navigate = useNavigate();

  useEffect(() => {
    if (user && user.id) {
      axios
        .get(`http://localhost:5000/api/upload-account/${user.id}`)
        .then((res) => setUserInfo(res.data))
        .catch((err) => console.error("Lỗi lấy thông tin:", err));
    }
  }, [user]);
    const confirmLockAccount = async () => {
  setIsLocking(true);

  try {
    await axios.put(`http://localhost:5000/api/upload-account/lock-account/${user.id}`);
    setAlertMessage("Tài khoản đã bị khóa.");
    setAlertVariant("warning");
    setShowAlert(true);
    setShowConfirmPanel(false);

    setTimeout(() => {
      logout();
      navigate(`/Login`);
    }, 2000);
  } catch (error) {
    console.error("Lỗi khi khóa tài khoản:", error);
    setAlertMessage("Khóa tài khoản thất bại.");
    setAlertVariant("danger");
    setShowAlert(true);
  } finally {
    setIsLocking(false);
  }
};

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
  
  const handleLockAccount = async () => {
  const confirmLock = window.confirm("Bạn có chắc muốn khóa tài khoản này? Sau khi khóa, bạn sẽ không thể đăng nhập nữa.");

  if (!confirmLock) return;

  setIsLocking(true); // Bắt đầu loading

  try {
    await axios.put(`http://localhost:5000/api/upload-account/lock-account/${user.id}`);
    setAlertMessage("Tài khoản đã bị khóa.");
    setAlertVariant("warning");
    setShowAlert(true);

    // Có thể đăng xuất hoặc chuyển hướng sau 2 giây:
    setTimeout(() => { 
      logout();
      navigate(`/Login`)
    }, 2000);
  
  } catch (error) {
    console.error("Lỗi khi khóa tài khoản:", error);
    setAlertMessage("Khóa tài khoản thất bại.");
    setAlertVariant("danger");
    setShowAlert(true);
  } finally {
    setIsLocking(false); // Kết thúc loading (nếu muốn giữ nút "Chờ khóa..." thì không cần dòng này)
  }
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
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYsg3Tin2fFUDV0y54btyW_XrZpqXENGJUWw&s" alt="Avatar" className="avatar" />
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
        <div className="mt-3 text-end">
        <button
          className="btn btn-danger"
          onClick={() => setShowConfirmPanel(true)}

          disabled={isLocking}
        >
          {isLocking ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Chờ khóa...
            </>
          ) : (
            <>
              <i className="bi bi-lock-fill me-1"></i> Khóa tài khoản
            </>
          )}
        </button>
      </div>
        
        </div>
      </div>
    {showConfirmPanel && (
  <div
    className="confirm-panel-backdrop"
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1060
    }}
  >
    <div
      className="confirm-panel"
      style={{
        backgroundColor: "white",
        borderRadius: "8px",
        padding: "24px",
        maxWidth: "400px",
        width: "100%",
        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)"
      }}
    >
      <h5 className="mb-3">Xác nhận khóa tài khoản</h5>
      <p>
        Bạn có chắc muốn khóa tài khoản này? Sau khi khóa, bạn sẽ không thể đăng nhập nữa.
      </p>
      <div className="d-flex justify-content-end gap-2">
        <button className="btn btn-secondary" onClick={() => setShowConfirmPanel(false)}>
          Hủy
        </button>
        <button className="btn btn-danger" onClick={confirmLockAccount}>
          Đồng ý
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default UploadAccount;