// src/admin/pages/AddBrandCategory.jsx (hoặc theo đúng cấu trúc bạn đang dùng)

import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AddBrandCategory = () => {
  const [brandName, setBrandName] = useState("");
  const [error, setError] = useState("");
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
        body: JSON.stringify({ ten_dmth: brandName }),
      });

      const result = await response.json();

      if (response.ok) {
        navigate("/admin/brands"); // Chuyển về trang danh sách thương hiệu
      } else {
        setError(result.error || "Đã xảy ra lỗi khi thêm.");
      }
    } catch (err) {
      setError("Lỗi máy chủ.");
    }
  };

  return (
    <div className="mt-4">
      <h3>Thêm thương hiệu</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="brandName">
          <Form.Label>Tên thương hiệu</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nhập tên thương hiệu"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
          />
        </Form.Group>

        {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

        <Button type="submit" variant="success" className="mt-3">
          Lưu
        </Button>
      </Form>
    </div>
  );
};

export default AddBrandCategory;
