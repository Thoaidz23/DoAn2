// src/admin/pages/AddBrandCategory.jsx (hoặc theo đúng cấu trúc bạn đang dùng)

import React, { useState } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AddBrandCategory = () => {
  const [brandName, setBrandName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!brandName.trim()) {
      setError("Tên thương hiệu không được để trống.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/cagbrands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name_category_brand: brandName }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
        setError("");
        setBrandName("");
        setTimeout(() => {
          navigate("/admin/brandcategory");
        }, 2500);
      } else {
        setError(result.error || "Đã xảy ra lỗi khi thêm.");
      }
    } catch (err) {
      setError("Lỗi máy chủ.");
    }
  };

  return (
    <Card className="p-4 bg-dark text-white">
      <h3 className="mb-4">Thêm thương hiệu</h3>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">✅ Thêm thương hiệu thành công!</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Tên thương hiệu</Form.Label>
          <Form.Control
            type="text"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            placeholder="Nhập tên thương hiệu"
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Thêm thương hiệu
        </Button>
      </Form>
    </Card>
  );
};

export default AddBrandCategory;
