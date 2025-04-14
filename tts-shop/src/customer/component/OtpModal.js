import React, { useEffect, useState } from "react";
import { Modal, Button, FloatingLabel, Form } from "react-bootstrap";

const OtpModal = ({ show, onHide, email, otp, setOtp }) => {
  const [counter, setCounter] = useState(30);
  const [isCounting, setIsCounting] = useState(false);

  // Bắt đầu đếm khi modal hiển thị
  useEffect(() => {
    let interval;

    if (show) {
      setIsCounting(true);
      setCounter(30);

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

    // Clear khi modal đóng
    return () => clearInterval(interval);
  }, [show]);

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Xác thực Số điện thoại</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Nhập mã OTP được gửi qua email {email}</p>
        <FloatingLabel controlId="floatingOtp" label="Nhập mã OTP">
          <Form.Control
            type="text"
            placeholder=" "
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="custom-input"
          />
        </FloatingLabel>
        <Button variant="danger" className="mt-3 w-100">
          Xác nhận
        </Button>
        <p className="text-center mt-3">
          Nhận OTP mới {isCounting ? `(sau: ${counter}s)` : ""}
        </p>
        {!isCounting && (
          <Button variant="link" className="w-100 p-0">
            Gửi lại mã OTP
          </Button>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default OtpModal;
