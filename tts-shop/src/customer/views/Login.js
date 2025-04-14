import React, { useState } from "react";
import { Form, FloatingLabel, Container, Button } from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  return (
    <Container className="d-flex justify-content-center vh-100 mt-5 ">

      <Form className="w-50">
        {/* Email */}
        <h2 className="text-center mb-5 custom-container">Đăng Nhập</h2>
        <FloatingLabel controlId="floatingEmail" label="Email" className="mb-3">
          <Form.Control
            type="email"
            placeholder=" " 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

        {/* Button */}
        <Button variant="primary" className="mt-4 w-100">
          Đăng nhập
        </Button>
        <div className="d-flex justify-content-between mt-3 text-dark">
                            <a href="./ForgetPassword">Quên mật khẩu?</a>
                            <p>Bạn chưa có tài khoản <a href="./Register">Đăng ký ngay</a></p>
                        </div>
      </Form>
    </Container>
  );
};

export default Login;
