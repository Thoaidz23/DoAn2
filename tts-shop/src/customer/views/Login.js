import React, { useState, useContext } from "react";
import { Form, FloatingLabel, Container, Button, Alert } from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import axios from "axios";
import { AuthContext } from "../context/AuthContext"; // ✅ Import AuthContext

const Login = () => {
  const { login } = useContext(AuthContext); // ✅ Dùng context
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // ✅ Thêm state cho showPassword
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false); // ✅ Thêm state cho loading

  const handleLogin = async () => {
  setLoading(true);
  setErrorMessage("");

  try {
    const res = await axios.post("http://localhost:5000/api/users/login", {
      email,
      password,
    });

    const { token, user } = res.data;
    login(user, token); // ✅ Gọi login từ context
    window.location.href = user.role === 1 ? "/admin/dashboard" : "/";
  } catch (error) {
    // Xử lý các lỗi riêng biệt
    if (error.response) {
      if (error.response.status === 403) {
        setErrorMessage("Tài khoản của bạn đã bị khóa, vui lòng chọn Quên mật khẩu để cấp lại");
      } else if (error.response.status === 400) {
        setErrorMessage("Sai email hoặc mật khẩu");
      } else {
        setErrorMessage("Đã có lỗi xảy ra, vui lòng thử lại sau");
      }
    } else {
      setErrorMessage("Lỗi kết nối tới server");
    }
  }

  setLoading(false);
};


  return (
    <Container className="d-flex justify-content-center vh-100 mt-5">
      <Form className="w-50">
        <h2 className="text-center mb-4">Đăng Nhập</h2>

        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

        <FloatingLabel controlId="floatingEmail" label="Email" className="mb-3">
          <Form.Control
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FloatingLabel>

        <div className="position-relative mb-3">
          <FloatingLabel controlId="floatingPassword" label="Mật khẩu">
            <Form.Control
              type={showPassword ? "text" : "password"}
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FloatingLabel>

          {showPassword ? (
            <EyeSlash onClick={() => setShowPassword(false)} style={eyeIconStyle} size={20} />
          ) : (
            <Eye onClick={() => setShowPassword(true)} style={eyeIconStyle} size={20} />
          )}
        </div>

        <Button className="w-100 mt-2" 
        style={{ backgroundColor: "#076247", borderColor: "#076247", fontWeight: "bold" }} 
        onClick={handleLogin} disabled={loading}>
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>

        <div className="d-flex justify-content-between mt-3">
          <a href="/ForgetPassword"
          style={{color : "#149f59" , fontWeight: "500"}}
          >Quên mật khẩu?</a>
          <span>
            Chưa có tài khoản? <a href="/Register "
            style={{color : "#149f59" , fontWeight: "500"}}
            >Đăng ký</a>
          </span>
        </div>
      </Form>
    </Container>
  );
};

const eyeIconStyle = {
  position: "absolute",
  right: 10,
  top: "50%",
  transform: "translateY(-50%)",
  cursor: "pointer",
};

export default Login;
