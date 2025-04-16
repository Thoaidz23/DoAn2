import React, { useState } from "react";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../styles/MyAccount.scss";
import AccountBar from "../component/AccountBar";
import { Eye, EyeSlash } from "react-bootstrap-icons";

function ChangePassword() {
  const [activeMenu, setActiveMenu] = useState("Đổi mật khẩu");
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { currentPassword, newPassword, confirmPassword } = formData;

    if (currentPassword !== "123456") {
      setError("Mật khẩu hiện tại không đúng.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu mới không khớp.");
      return;
    }

    setSuccess("Đổi mật khẩu thành công!");
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const renderInput = (label, name, show, toggle) => (
    <div className="mb-3 position-relative">
      <label className="form-label">{label}</label>
      <div className="position-relative">
        <input
          type={show ? "text" : "password"}
          name={name}
          className="form-control border-0 rounded-0 ps-0 pe-5"
          value={formData[name]}
          onChange={handleChange}
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
    </div>
  );

  return (
    <div className="account-overview-container">
      <div className="container">
        <AccountBar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
        <div className="account-content p-4 bg-white shadow rounded-4">
          <h4 className="mb-4">Đổi mật khẩu</h4>
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            {renderInput("Mật khẩu hiện tại", "currentPassword", showPassword.current, () => togglePassword("current"))}
            {renderInput("Mật khẩu mới", "newPassword", showPassword.new, () => togglePassword("new"))}
            {renderInput("Nhập lại mật khẩu mới", "confirmPassword", showPassword.confirm, () => togglePassword("confirm"))}

            <div className="text-end mt-4">
              <button type="submit" className="btn btn-primary">
                Đổi mật khẩu
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
