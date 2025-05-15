import React, { useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AddStaff = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Tên nhân viên không được để trống.");
      return;
    }
    if (!email.trim()) {
      setError("Email không được để trống.");
      return;
    }
    if (!phone.trim()) {
      setError("Số điện thoại không được để trống.");
      return;
    }
    if (!address.trim()) {
      setError("Địa chỉ không được để trống.");
      return;
    }

    // Không có password nữa
    const data = { name, email, phone, address };

    try {
      const response = await fetch("http://localhost:5000/api/staffaccounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
        setError("");
        setTimeout(() => {
          navigate("/admin/staffaccount");
        }, 1500);
      } else {
        setError(result.message || "Lỗi khi thêm nhân viên.");
      }
    } catch (err) {
      setError("Lỗi máy chủ: " + (err.message || "Không xác định"));
    }
  };

  return (
    <Card className="p-4 bg-dark text-white">
      <h3 className="mb-4">Thêm mới nhân viên</h3>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">✅ Thêm nhân viên thành công!</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Tên nhân viên</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập tên nhân viên"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Số điện thoại</Form.Label>
          <Form.Control
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Nhập số điện thoại"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Địa chỉ</Form.Label>
          <Form.Control
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Nhập địa chỉ"
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Thêm nhân viên
        </Button>
      </Form>
    </Card>
  );
};

export default AddStaff;
