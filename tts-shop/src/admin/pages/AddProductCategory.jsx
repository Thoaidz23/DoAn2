import React, { useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AddProductCategory = () => {
  const [name_category_product, setTenDmsp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name_category_product.trim()) {
      setError("Tên danh mục không được để trống.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/cagproducts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name_category_product }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
        setError("");
        setTenDmsp("");
        setTimeout(() => {
          navigate("/admin/productcategory");
        }, 2500);
      } else {
        setError(result.message || "Lỗi khi thêm danh mục.");
      }
    } catch (err) {
      setError("Lỗi máy chủ.");
    }
  };

  return (
    <Card className="p-4 bg-dark text-white">
      <h3 className="mb-4">Thêm danh mục sản phẩm</h3>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">✅ Thêm danh mục thành công!</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" style={{marginTop: "-500px"}}>
          <Form.Label>Tên danh mục</Form.Label>
          <Form.Control
            type="text"
            value={name_category_product}
            onChange={(e) => setTenDmsp(e.target.value)}
            placeholder="Nhập tên danh mục (ví dụ: Laptop, Điện thoại...)"
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

export default AddProductCategory;
