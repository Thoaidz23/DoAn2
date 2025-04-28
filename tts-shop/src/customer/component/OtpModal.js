import React, { useEffect, useState } from "react";
import { Modal, Button, FloatingLabel, Form, Alert } from "react-bootstrap";
import axios from "axios";

const OtpModal = ({ show, onHide, email, otp, setOtp }) => {
  const [counter, setCounter] = useState(30);
  const [isCounting, setIsCounting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Bắt đầu đếm ngược khi modal hiện
  useEffect(() => {
    let interval;

    if (show) {
      setCounter(30);
      setIsCounting(true);
      interval = setInterval(() => {
        setCounter((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsCounting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [show]);

  const handleVerifyOtp = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/users/verify-otp", {
        email,
        otp,
      });
      setMessage(res.data.message);
      setError("");
      setTimeout(() => {
        setMessage("");
        onHide(); // Đóng modal sau khi xác thực thành công
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi xác thực OTP");
      setMessage("");
    }
  };

  const handleResendOtp = async () => {
    try {
      await axios.post("http://localhost:5000/api/users/send-otp", { email });
      setMessage("OTP mới đã được gửi!");
      setError("");
      setCounter(30);
      setIsCounting(true);
    } catch (err) {
      setError(err.response?.data?.message || "Không gửi được OTP mới");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Xác thực Email</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Nhập mã OTP được gửi đến email <strong>{email}</strong></p>

        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        <FloatingLabel controlId="floatingOtp" label="Nhập mã OTP" className="mb-3">
          <Form.Control
            type="text"
            placeholder="Nhập mã OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </FloatingLabel>

        <Button variant="danger" className="w-100 mb-3" onClick={handleVerifyOtp}>
          Xác nhận
        </Button>

        <div className="text-center">
          <p className="mb-2">Nhận OTP mới {isCounting && `(trong ${counter}s)`}</p>
          {!isCounting && (
            <Button variant="link" onClick={handleResendOtp}>
              Gửi lại mã OTP
            </Button>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default OtpModal;
