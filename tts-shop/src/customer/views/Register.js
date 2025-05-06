import React, { useState } from "react";
import { Form, FloatingLabel, Container, Button, Alert } from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import axios from "axios";
// import OtpModal from "../component/OtpModal";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    const { name, email, phone, address, password, confirmPassword } = formData;
  
    // Regex kiểm tra email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{9,11}$/;
  
    if (!name || !email || !phone || !address || !password || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      setSuccess("");
      return;
    }
  
    if (!emailRegex.test(email)) {
      setError("Email không hợp lệ!");
      setSuccess("");
      return;
    }
  
    if (!phoneRegex.test(phone)) {
      setError("Số điện thoại không hợp lệ! Chỉ gồm 9–11 chữ số.");
      setSuccess("");
      return;
    }
  
    if (password.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự!");
      setSuccess("");
      return;
    }
    if (password.length > 30) {
      setError("Mật khẩu phải nhỏ hơn 30 ký tự!");
      setSuccess("");
      return;
    }
    if (password !== confirmPassword) {
      setError("Mật khẩu và xác nhận mật khẩu không khớp!");
      setSuccess("");
      return;
    }
    
    try {
      const { confirmPassword, ...submitData } = formData;
      const response = await axios.post("http://localhost:5000/api/users/register", submitData);
      setSuccess(response.data.message);
      setError("");
      window.location.href = "/Login";
      setShowOtpModal(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        password: "",
        confirmPassword: ""
      });
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi không xác định");
      setSuccess("");
    }
  };
  

  return (
    <Container className="d-flex justify-content-center vh-100 mt-5">
      <Form className="w-50">
        <h2 className="text-center mb-5">Đăng Ký</h2>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <FloatingLabel label="Họ tên" className="mb-3">
          <Form.Control name="name" value={formData.name} onChange={handleChange} />
        </FloatingLabel>

        <FloatingLabel label="Email" className="mb-3">
          <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} />
        </FloatingLabel>

        <FloatingLabel label="Số điện thoại" className="mb-3">
          <Form.Control name="phone" value={formData.phone} onChange={handleChange} />
        </FloatingLabel>

        <FloatingLabel label="Địa chỉ" className="mb-3">
          <Form.Control name="address" value={formData.address} onChange={handleChange} />
        </FloatingLabel>

        {/* Mật khẩu */}
        <div className="position-relative mb-3">
          <FloatingLabel label="Mật khẩu">
            <Form.Control
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </FloatingLabel>
          {showPassword ? (
            <EyeSlash
              onClick={() => setShowPassword(false)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer"
              }}
            />
          ) : (
            <Eye
              onClick={() => setShowPassword(true)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer"
              }}
            />
          )}
        </div>

        {/* Xác nhận mật khẩu */}
        <div className="position-relative mb-3">
          <FloatingLabel label="Xác nhận mật khẩu">
            <Form.Control
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </FloatingLabel>
          {showConfirmPassword ? (
            <EyeSlash
              onClick={() => setShowConfirmPassword(false)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer"
              }}
            />
          ) : (
            <Eye
              onClick={() => setShowConfirmPassword(true)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer"
              }}
            />
          )}
        </div>

        <Button className="w-100 mt-3" onClick={handleRegister}>
          Đăng ký
        </Button>
        <p className="mt-2">Đã có tài khoản? <a href="/Login">Đăng nhập</a></p>
      </Form>
      {/* <OtpModal
          show={showOtpModal}
          onHide={() => setShowOtpModal(false)}
          email={formData.email}
          otp={otp}
          setOtp={setOtp}
        /> */}
            
    </Container>
  );
};

export default Register;
