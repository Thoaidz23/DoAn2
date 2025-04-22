import React, { useState, useEffect } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const AddProduct = () => {
  const [formData, setFormData] = useState({
    ten_sanpham: "",
    giasp: "",
    soluong: "",
    mota: "",
    hinhanh: null,
    id_dmsp: "", // Thêm thuộc tính id_dmsp cho danh mục sản phẩm
  });

  const [categories, setCategories] = useState([]); // Dùng để lưu danh mục sản phẩm

  // Fetch danh mục sản phẩm từ backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products/categories");
        const result = await response.json();
        setCategories(result); // Lưu danh mục sản phẩm vào state categories
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      }
    };
    fetchCategories();
  }, []);

  const navigate = useNavigate(); // Khởi tạo useNavigate

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value, // Xử lý file cho hình ảnh
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra nếu chưa chọn danh mục sản phẩm
    if (!formData.id_dmsp) {
      alert("Vui lòng chọn danh mục sản phẩm!");
      return;
    }

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
      console.log(result);  // Log kết quả trả về để kiểm tra
      if (res.ok) {
        alert("✅ Thêm sản phẩm thành công!");
        navigate("/admin/product"); // Chuyển hướng về trang sản phẩm (điều chỉnh đường dẫn nếu cần)
      } else {
        alert("❌ Lỗi khi thêm sản phẩm!");
      }
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
          <Form.Control 
            type="text" 
            name="ten_sanpham" 
            value={formData.ten_sanpham} 
            onChange={handleChange} 
            required 
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Giá</Form.Label>
          <Form.Control 
            type="number" 
            name="giasp" 
            value={formData.giasp} 
            onChange={handleChange} 
            required 
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Số lượng</Form.Label>
          <Form.Control 
            type="number" 
            name="soluong" 
            value={formData.soluong} 
            onChange={handleChange} 
            required 
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Mô tả</Form.Label>
          <Form.Control 
            as="textarea" 
            rows={3} 
            name="mota" 
            value={formData.mota} 
            onChange={handleChange} 
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Hình ảnh</Form.Label>
          <Form.Control 
            type="file" 
            name="hinhanh" 
            onChange={handleChange} 
            required 
          />
        </Form.Group>

        {/* Chọn danh mục sản phẩm */}
        <Form.Group className="mb-3">
          <Form.Label>Danh mục sản phẩm</Form.Label>
          <Form.Control
            as="select"
            name="id_dmsp"
            value={formData.id_dmsp}
            onChange={handleChange}
            required
          >
            <option value="">Chọn danh mục</option>
            {categories.map((category) => (
              <option key={category.id_dmsp} value={category.id_dmsp}>
                {category.ten_dmsp}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Button variant="success" type="submit">Thêm sản phẩm</Button>
      </Form>
    </Card>
  );
};

export default AddProduct;
