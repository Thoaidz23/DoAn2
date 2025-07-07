import React, { useState, useContext } from "react";
import axios from "axios";
import AccountBar from "../component/AccountBar";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import "../styles/MyAccount.scss";
import { AuthContext } from "../context/AuthContext";

function ChangePassword() {
  const [activeMenu, setActiveMenu] = useState("Đổi mật khẩu");
  const { user, token } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const togglePassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearMessages = () => {
    setTimeout(() => {
      setError("");
      setSuccess("");
    }, 5000);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  const { currentPassword, newPassword, confirmPassword } = formData;

  const newFieldErrors = {
    currentPassword: currentPassword ? "" : "Vui lòng nhập mật khẩu hiện tại.",
    newPassword: newPassword ? "" : "Vui lòng nhập mật khẩu mới.",
    confirmPassword: confirmPassword ? "" : "Vui lòng xác nhận mật khẩu mới.",
  };


  setFieldErrors(newFieldErrors);
  if (Object.values(newFieldErrors).some((msg) => msg !== "")) return;

  // ✅ Điều kiện kiểm tra mật khẩu mới
  if (newPassword === currentPassword) {
    setError("Mật khẩu mới phải khác mật khẩu hiện tại.");
    clearMessages();
    return;
  }

  if (newPassword.length < 8) {
    setError("Mật khẩu mới phải có ít nhất 8 ký tự.");
    clearMessages();
    return;
  }

  if (newPassword.length > 30) {
    setError("Mật khẩu mới không được vượt quá 30 ký tự.");
    clearMessages();
    return;
  }

  if (!/[A-Z]/.test(newPassword)) {
    setError("Mật khẩu mới phải chứa ít nhất 1 chữ cái in hoa.");
    clearMessages();
    return;
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
    setError("Mật khẩu mới phải chứa ít nhất 1 ký tự đặc biệt.");
    clearMessages();
    return;
  }

  if (newPassword !== confirmPassword) {
    setError("Mật khẩu mới không khớp.");
    clearMessages();
    return;
  }

  setLoading(true);

  try {
    console.log("Đang gửi dữ liệu đổi mật khẩu:", { currentPassword, newPassword });
    console.log("User ID:", user?.id);
    console.log("Token:", token);

    const res = await axios.post(
      `http://localhost:5000/api/change-password/${user.id}`,
      { currentPassword, newPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setSuccess(res.data.message || "Đổi mật khẩu thành công!");
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setFieldErrors({ currentPassword: "", newPassword: "", confirmPassword: "" });
    clearMessages();
  } catch (err) {
    console.error("Lỗi trả về từ server:", err?.response);
    const msg = err?.response?.data?.message || "Đã xảy ra lỗi khi đổi mật khẩu.";
    setError(msg);
    clearMessages();
  } finally {
    setLoading(false);
  }
};


  const renderInput = (label, name, show, toggle) => {
    const handleBlur = () => {
      if (!formData[name]) {
        setFieldErrors((prev) => ({
          ...prev,
          [name]: `Vui lòng nhập ${label.toLowerCase()}.`,
        }));
      } else {
        setFieldErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    };

    const handleFocus = () => {
      if (!formData[name]) {
        setFieldErrors((prev) => ({
          ...prev,
          [name]: `Vui lòng nhập ${label.toLowerCase()}.`,
        }));
      }
    };

    return (
      <div className="mb-4">
        <label className="form-label">{label}</label>
        <div className="position-relative input-wrapper">
          <input
            type={show ? "text" : "password"}
            name={name}
            className={`form-control border-0 border-bottom rounded-0 ps-0 pe-5 ${fieldErrors[name] ? "is-invalid" : ""}`}
            value={formData[name]}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            required
          />
          <span
            className="position-absolute"
            style={{ right: "10px", top: "50%", transform: "translateY(-50%)", cursor: "pointer" }}
            onClick={toggle}
          >
            {show ? <EyeSlash /> : <Eye />}
          </span>
        </div>
        {fieldErrors[name] && (
          <div className="text-danger mt-2 ms-1" style={{ fontSize: "0.875rem" }}>
            {fieldErrors[name]}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="account-overview-container">
      <div className="container">
        <AccountBar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
        <div className="account-content p-4 bg-white shadow rounded-4">
          <h4 className="mb-4 text-center" >Đổi mật khẩu</h4>
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            {renderInput("Mật khẩu hiện tại", "currentPassword", showPassword.current, () => togglePassword("current"))}
            {renderInput("Mật khẩu mới", "newPassword", showPassword.new, () => togglePassword("new"))}
            {renderInput("Nhập lại mật khẩu mới", "confirmPassword", showPassword.confirm, () => togglePassword("confirm"))}

            <div className="text-end mt-4" >
              <button type="submit" className="btn btn-primary" disabled={loading} style={{backgroundColor: "#076247"}}>
                {loading ? "Đang xử lý..." : "Đổi mật khẩu" }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;