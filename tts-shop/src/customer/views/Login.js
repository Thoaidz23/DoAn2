import React, { useState } from "react";
import { Form, FloatingLabel, Container, Button, Alert } from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); 
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password
      });

      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Chuyển hướng theo role
      if (user.role === 1) {
        window.location.href = "/admin";
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message || "Đăng nhập thất bại");
      } else {
        setErrorMessage("Có lỗi xảy ra. Vui lòng thử lại sau.");
      }
    }
    setLoading(false);
  };

  return (
    <Container className="d-flex justify-content-center vh-100 mt-5">
      <Form className="w-50">
        <h2 className="text-center mb-5">Đăng Nhập</h2>

        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

        <FloatingLabel controlId="floatingEmail" label="Email" className="mb-3">
          <Form.Control
            type="email"
            placeholder=" "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FloatingLabel>

        <div className="position-relative mb-3">
          <FloatingLabel controlId="floatingPassword" label="Mật khẩu">
            <Form.Control
              type={showPassword ? "text" : "password"}
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FloatingLabel>
          {showPassword ? (
            <EyeSlash
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", cursor: "pointer" }}
            />
          ) : (
            <Eye
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", cursor: "pointer" }}
            />
          )}
        </div>

        <Button className="w-100 mt-3" onClick={handleLogin} disabled={loading}>
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>

        <div className="d-flex justify-content-between mt-3">
          <a href="/ForgetPassword">Quên mật khẩu?</a>
          <p>Chưa có tài khoản? <a href="/Register">Đăng ký</a></p>
        </div>
      </Form>
    </Container>
  );
};

export default Login;
