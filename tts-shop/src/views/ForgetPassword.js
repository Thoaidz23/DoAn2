import React, { useState } from "react";
import { Form, FloatingLabel, Container, Button, Modal } from "react-bootstrap";
import Navbar from "../component/NavBar";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [counter, setCounter] = useState(30);
  const [isCounting, setIsCounting] = useState(false);

  const handleContinue = () => {
    setShowModal(true);
    setIsCounting(true);
    setCounter(30);
    const interval = setInterval(() => {
      setCounter((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsCounting(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <Container className="d-flex justify-content-center vh-100">
      <Navbar />
      <Form className="w-50 mt-5">
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
      </Form>

      {/* Modal OTP */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
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
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ForgotPassword;
