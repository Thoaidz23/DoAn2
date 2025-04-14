import React, { useState } from "react";
import { Form, FloatingLabel, Container, Button } from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons"; 

const Login = () => {
  const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  return (
    <Container className="d-flex justify-content-center vh-100 ">
      <Form className="w-50">
      <h2 className="text-center mb-5 mt-5 custom-container">Tạo mật khẩu mới</h2>
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
        <Button variant="primary" className="mt-4 w-100">
          Xác Nhận
        </Button>
      </Form>
    </Container>
  );
};

export default Login;
