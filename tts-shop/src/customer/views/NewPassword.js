import React, { useState, useEffect } from "react";
import { Form, FloatingLabel, Container, Button } from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const NewPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      alert("Không xác định được email. Vui lòng thực hiện lại từ bước quên mật khẩu.");
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Mật khẩu và xác nhận mật khẩu không khớp.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/password/reset", {
        email,
        password,
      });

      if (response.status === 200) {
        alert("Mật khẩu đã được cập nhật thành công!");
        navigate("/login"); // chuyển sang trang đăng nhập
      }
    } catch (error) {
      setErrorMessage("Có lỗi xảy ra khi cập nhật mật khẩu.");
      console.error(error);
    }
  };

  return (
    <Container className="d-flex justify-content-center vh-100">
      <Form className="w-50" onSubmit={handleSubmit}>
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
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
            />
          ) : (
            <Eye
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
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
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
            />
          ) : (
            <Eye
              className="eye-icon"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
            />
          )}
        </div>

        {/* Error Message */}
        {errorMessage && <p className="text-danger">{errorMessage}</p>}

        {/* Button */}
        <Button variant="primary" className="mt-4 w-100" type="submit">
          Xác Nhận
        </Button>
      </Form>
    </Container>
  );
};

export default NewPassword;
