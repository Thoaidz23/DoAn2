// src/admin/pages/AddPostCategory.jsx

import React, { useState } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AddPostCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      setError("Tên danh mục bài viết không được để trống.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/cagposts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name_category_post: categoryName }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
        setError("");
        setCategoryName("");
        setTimeout(() => {
          navigate("/admin/postcategory");
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
      <h3 className="mb-4">Thêm danh mục bài viết</h3>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">✅ Thêm danh mục bài viết thành công!</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" style={{marginTop: "-500px"}}>
          <Form.Label>Tên danh mục bài viết</Form.Label>
          <Form.Control
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Nhập tên danh mục bài viết"
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Thêm danh mục
        </Button>
      </Form>
    </Card>
  );
};

export default AddPostCategory;
