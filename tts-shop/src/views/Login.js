import React, { useState } from "react";
import { Form, FloatingLabel, Container, Button } from "react-bootstrap";
import Navbar from "../component/NavBar";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Container className="d-flex justify-content-center vh-100 ">
        <Navbar></Navbar>
      <Form className="w-50">
        {/* Email */}
        <h2 className="text-center mb-4 mt-5 custom-container">Đăng Nhập</h2>
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
        <FloatingLabel controlId="floatingPassword" label="Mật khẩu">
          <Form.Control
            type="password"
            placeholder=" "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="custom-input"
          />
        </FloatingLabel>

        {/* Button */}
        <Button variant="primary" className="mt-4 w-100">
          Đăng nhập
        </Button>
        <div className="d-flex justify-content-between mt-3 text-primary">
                            <a href="#">Quên mật khẩu?</a>
                            <a href="#">Đăng ký ngay</a>
                        </div>
      </Form>
    </Container>
  );
};

export default Login;
