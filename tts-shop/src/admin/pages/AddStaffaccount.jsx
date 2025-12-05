import React, { useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AddStaff = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState(""); // role 2 hoặc 4
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) return setError("Tên nhân viên không được để trống.");
    if (!email.trim()) return setError("Email không được để trống.");
    if (!phone.trim()) return setError("Số điện thoại không được để trống.");
    if (!address.trim()) return setError("Địa chỉ không được để trống.");
    if (!role) return setError("Phân loại nhân viên không được để trống.");

    const data = { name, email, phone, address, role };

    try {
      const response = await fetch("http://localhost:5000/api/staffaccounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
        setError("");
        setTimeout(() => navigate("/admin/staffaccount"), 1500);
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
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Số điện thoại</Form.Label>
          <Form.Control
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Nhập số điện thoại"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Địa chỉ</Form.Label>
          <Form.Control
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Nhập địa chỉ"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Phân loại nhân viên</Form.Label>
          <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="">-- Chọn phân loại --</option>
            <option value="2">Nhân viên bán hàng</option>
            <option value="4">Quản lý kho</option>
          </Form.Select>
        </Form.Group>

        <Button variant="primary" type="submit">
          Thêm nhân viên
        </Button>
      </Form>
    </Card>
  );
};

export default AddStaff;
