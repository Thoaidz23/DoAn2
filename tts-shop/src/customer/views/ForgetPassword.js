import React, { useState } from "react";
import { Form, FloatingLabel, Container, Button } from "react-bootstrap";
import OtpModal from "../component/OtpModal";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleContinue = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/otp/send-otp", { 
        email:email,
        mode:"forgot-password"
       });
      setMessage(response.data.message);
      setError("");
      setShowModal(true); // Hiển thị modal OTP
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi gửi OTP");
      setMessage("");
    }
  };

  return (
    <Container className="d-flex justify-content-center vh-100">
      <Form className="w-50">
        <h2 className="text-center mb-5 mt-5 custom-container">Quên mật khẩu</h2>

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

        {/* Button */}
        <Button variant="primary" className="mt-4 w-100" onClick={handleContinue}>
          Tiếp tục
        </Button>

        {error && <p className="text-danger mt-3">{error}</p>}
        {message && <p className="text-success mt-3">{message}</p>}

        <div className="d-flex justify-content-between mt-3 text-dark">
          <a href=""></a>
          <p>Bạn chưa có tài khoản <a href="./Register">Đăng ký ngay</a></p>
        </div>
      </Form>

      {/* Modal Component */}
      <OtpModal
        show={showModal}
        onHide={() => setShowModal(false)}
        email={email}
        otp={otp}
        setOtp={setOtp}
        mode  = "reset-password"
      />
    </Container>
  );
};

export default ForgotPassword;
