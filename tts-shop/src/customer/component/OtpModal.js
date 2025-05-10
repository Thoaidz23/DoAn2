import React, { useEffect, useState } from "react";
import { Modal, Button, FloatingLabel, Form, Alert } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OtpModal = ({ show, onHide, email, otp, setOtp, mode, onVerified }) => {
  const [counter, setCounter] = useState(30);
  const [isCounting, setIsCounting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
      const res = await axios.post("http://localhost:5000/api/otp/verify-otp", {
        email,
        otp,
      });
      setMessage(res.data.message);
      setError("");

      setTimeout(() => {
        setMessage("");
        onHide(); // hoặc giữ modal nếu muốn

        if (mode === "reset-password") {
          navigate("/Newpassword", { state: { email } });
        } else if (mode === "register" && typeof onVerified === "function") {
          onVerified(); // gọi callback để tạo user
        }

        setOtp(""); // Clear OTP field
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.message || "Lỗi xác thực OTP");
      setMessage("");
    }
  };

  const handleResendOtp = async () => {
    // Không cho phép gửi lại OTP trong khi đang đếm ngược
    if (isCounting) return;

    try {
      await axios.post("http://localhost:5000/api/otp/send-otp", { email });
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
