import React, { useState } from "react";
import { Form, FloatingLabel, Container, Button } from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons"; 
import Navbar from "../component/NavBar";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <Container className="d-flex justify-content-center vh-100">
      <Navbar />
      <Form className="w-50">
        <h2 className="text-center mb-5 mt-5 custom-container">Đăng Ký</h2>

        {/* Name */}
        <FloatingLabel controlId="floatingName" label="Họ và tên" className="mb-3">
          <Form.Control
            type="text"
            placeholder=" "
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="custom-input"
          />
        </FloatingLabel>

        {/* Email */}
        <FloatingLabel controlId="floatingEmail" label="Email" className="mb-3">
          <Form.Control
            type="email"
            placeholder=" "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="custom-input"
          />
        </FloatingLabel>

        {/* Phone */}
        <FloatingLabel controlId="floatingPhone" label="Số điện thoại" className="mb-3">
          <Form.Control
            type="text"
            placeholder=" "
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="custom-input"
          />
        </FloatingLabel>

        {/* Address */}
        <FloatingLabel controlId="floatingAddress" label="Địa chỉ" className="mb-3">
          <Form.Control
            type="text"
            placeholder=" "
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="custom-input"
          />
        </FloatingLabel>

        {/* Password */}
        <div className="position-relative mb-3">
          <FloatingLabel controlId="floatingPassword" label="Mật khẩu">
            <Form.Control
              type={showPassword ? "text" : "password"}
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="custom-input"
            />
          </FloatingLabel>
          {showPassword ? (
            <EyeSlash
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", cursor: "pointer" }}
            />
          ) : (
            <Eye
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", cursor: "pointer" }}
            />
          )}
        </div>

        {/* Confirm Password */}
        <div className="position-relative mb-3">
          <FloatingLabel controlId="floatingConfirmPassword" label="Xác nhận mật khẩu">
            <Form.Control
              type={showConfirmPassword ? "text" : "password"}
              placeholder=" "
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="custom-input"
            />
          </FloatingLabel>
          {showConfirmPassword ? (
            <EyeSlash
              className="eye-icon"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", cursor: "pointer" }}
            />
          ) : (
            <Eye
              className="eye-icon"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", cursor: "pointer" }}
            />
          )}
        </div>

        {/* Button */}
        <Button variant="success" className="mt-4 w-100">
          Đăng ký
        </Button>
        <div className="d-flex justify-content-between mt-3 text-dark">
          <p>Đã có tài khoản?<a href="./Login"> Đăng nhập</a></p>
        </div>
      </Form>
    </Container>
  );
};

export default Register;