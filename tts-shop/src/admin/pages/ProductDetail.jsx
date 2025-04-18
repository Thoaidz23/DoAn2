// src/admin/pages/ProductDetail.jsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Button } from "react-bootstrap";

const ProductDetail = () => {
  const { id } = useParams(); // lấy id từ URL
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.error("Lỗi khi fetch chi tiết sản phẩm:", err));
  }, [id]);

  if (!product) return <p>Đang tải chi tiết sản phẩm...</p>;

  return (
    <div>
      <h3>Chi tiết sản phẩm</h3>
      <Card className="p-4 mt-3">
        <Card.Img
          variant="top"
          src={`http://localhost:5000/images/product/${product.hinhanh}`}
          style={{ maxWidth: "300px", objectFit: "cover" }}
        />
        <Card.Body>
          <Card.Title>{product.ten_sanpham}</Card.Title>
          <Card.Text><strong>Giá:</strong> {product.giasp?.toLocaleString("vi-VN")}₫</Card.Text>
          <Card.Text><strong>Số lượng:</strong> {product.soluong}</Card.Text>
          <Card.Text><strong>Mô tả:</strong> {product.mota || "Chưa có mô tả"}</Card.Text>
          <Button variant="secondary" onClick={() => window.history.back()}>Quay lại</Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ProductDetail;
