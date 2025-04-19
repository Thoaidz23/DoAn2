// src/admin/pages/AddProduct.jsx
import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    ten_sanpham: "",
    giasp: "",
    soluong: "",
    mota: "",
    hinhanh: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      alert("✅ Thêm sản phẩm thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error);
    }
  };

  return (
    <Card className="p-4 bg-dark text-white">
      <h3 className="mb-4">Thêm sản phẩm mới</h3>
      <Form onSubmit={handleSubmit} encType="multipart/form-data">
        <Form.Group className="mb-3">
          <Form.Label>Tên sản phẩm</Form.Label>
          <Form.Control type="text" name="ten_sanpham" onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Giá</Form.Label>
          <Form.Control type="number" name="giasp" onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Số lượng</Form.Label>
          <Form.Control type="number" name="soluong" onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Mô tả</Form.Label>
          <Form.Control as="textarea" rows={3} name="mota" onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Hình ảnh</Form.Label>
          <Form.Control type="file" name="hinhanh" onChange={handleChange} required />
        </Form.Group>

        <Button variant="success" type="submit">Thêm sản phẩm</Button>
      </Form>
    </Card>
  );
};

export default AddProduct;
