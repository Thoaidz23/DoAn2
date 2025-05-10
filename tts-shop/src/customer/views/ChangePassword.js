import React, { useState } from "react";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../styles/MyAccount.scss";
import AccountBar from "../component/AccountBar";
import { Eye, EyeSlash } from "react-bootstrap-icons";

function ChangePassword() {
  const [activeMenu, setActiveMenu] = useState("Đổi mật khẩu");
<<<<<<< HEAD
=======
  const { user, token } = useContext(AuthContext);

>>>>>>> d796181d0ce5157210794b691833585f6e52a437
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
<<<<<<< HEAD
=======
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
>>>>>>> d796181d0ce5157210794b691833585f6e52a437

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

<<<<<<< HEAD
    if (currentPassword !== "123456") {
      setError("Mật khẩu hiện tại không đúng.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự.");
=======
    const newFieldErrors = {
      currentPassword: currentPassword ? "" : "Vui lòng nhập mật khẩu hiện tại.",
      newPassword: newPassword ? "" : "Vui lòng nhập mật khẩu mới.",
      confirmPassword: confirmPassword ? "" : "Vui lòng xác nhận mật khẩu mới.",
    };

    setFieldErrors(newFieldErrors);
    if (Object.values(newFieldErrors).some((msg) => msg !== "")) return;

    if (newPassword.length < 8) {
      setError("Mật khẩu mới phải có ít nhất 8 ký tự.");
      clearMessages();
>>>>>>> d796181d0ce5157210794b691833585f6e52a437
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu mới không khớp.");
<<<<<<< HEAD
      return;
    }

    setSuccess("Đổi mật khẩu thành công!");
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
=======
      clearMessages();
      return;
    }

    setLoading(true);
    try {
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
      const msg = err?.response?.data?.message || "Đã xảy ra lỗi khi đổi mật khẩu.";
      setError(msg);
      clearMessages();
    } finally {
      setLoading(false);
    }
>>>>>>> d796181d0ce5157210794b691833585f6e52a437
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
