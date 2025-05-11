import React, { useState, useEffect } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const EditProductCategory = () => {
  const { id } = useParams(); // Lấy id từ URL
  const [name_category_product, setTenDmsp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Lấy thông tin danh mục từ API
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/cagproducts/${id}`);
        const result = await response.json();
        
        if (response.ok) {
          setTenDmsp(result.name_category_product); // Set dữ liệu vào input
        } else {
          setError(result.message || "Lỗi khi lấy thông tin danh mục.");
        }
      } catch (err) {
        setError("Lỗi máy chủ.");
      }
    };

    fetchCategory();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name_category_product.trim()) {
      setError("Tên danh mục không được để trống.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/cagproducts/${id}`, {
        method: "PUT", // Sử dụng PUT để cập nhật dữ liệu
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name_category_product }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
        setError("");
        setTimeout(() => {
          navigate("/admin/productcategory"); // Chuyển hướng về danh sách danh mục
        }, 1500);
      } else {
        setError(result.message || "Lỗi khi cập nhật danh mục.");
      }
    } catch (err) {
      setError("Lỗi máy chủ.");
    }
  };

  return (
    <Card className="p-4 bg-dark text-white">
      <h3 className="mb-4">Chỉnh sửa danh mục sản phẩm</h3>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">✅ Chỉnh sửa danh mục thành công!</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3"  style={{marginTop: "-500px"}}>
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
          Cập nhật danh mục
        </Button>
      </Form>
    </Card>
  );
};

export default EditProductCategory;
