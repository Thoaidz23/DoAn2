import React, { useState, useEffect } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const EditBrandCategory = () => {
  const { id } = useParams(); // Lấy id từ URL
  const [name_category_brand, setNameCategoryBrand] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Lấy thông tin thương hiệu từ API
  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/cagbrands/${id}`);
        const result = await response.json();
        
        if (response.ok) {
          setNameCategoryBrand(result.name_category_brand); // Set dữ liệu vào input
        } else {
          setError(result.message || "Lỗi khi lấy thông tin thương hiệu.");
        }
      } catch (err) {
        setError("Lỗi máy chủ.");
      }
    };

    fetchBrand();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name_category_brand.trim()) {
      setError("Tên thương hiệu không được để trống.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/cagbrands/${id}`, {
        method: "PUT", // Sử dụng PUT để cập nhật dữ liệu
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name_category_brand }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
        setError("");
        setTimeout(() => {
          navigate("/admin/brandcategory"); // Chuyển hướng về danh sách thương hiệu
        }, 1500);
      } else {
        setError(result.message || "Lỗi khi cập nhật thương hiệu.");
      }
    } catch (err) {
      setError("Lỗi máy chủ.");
    }
  };

  return (
    <Card className="p-4 bg-dark text-white">
      <h3 className="mb-4">Chỉnh sửa thương hiệu</h3>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">✅ Chỉnh sửa thương hiệu thành công!</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Tên thương hiệu</Form.Label>
          <Form.Control
            type="text"
            value={name_category_brand}
            onChange={(e) => setNameCategoryBrand(e.target.value)}
            placeholder="Nhập tên thương hiệu"
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Cập nhật thương hiệu
        </Button>
      </Form>
    </Card>
  );
};

export default EditBrandCategory;
