import React, { useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AddBanner = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState(null);


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!name.trim()) {
      setError("Tên banner không được để trống.");
      return;
    }
  
    if (!image) {
      setError("Vui lòng chọn ảnh cho banner.");
      return;
    }
  
    const formData = new FormData();
    formData.append("name", name);
    formData.append("image", image);
  
    try {
      const response = await fetch("http://localhost:5000/api/banners", {
        method: "POST",
        body: formData,
      });
  
      const text = await response.text();  // Đọc phản hồi dưới dạng văn bản
  
      try {
        const result = JSON.parse(text);  // Cố gắng chuyển sang JSON
        if (response.ok) {
          setSuccess(true);
          setError("");
          setTimeout(() => {
            navigate("/admin/banner");
          }, 1500);
        } else {
          setError(result.message || "Lỗi khi thêm banner.");
        }
      } catch (err) {
        setError("Phản hồi không phải dạng JSON: " + err.message);
      }
  
    } catch (err) {
      console.error("Error during fetch:", err);
      setError("Lỗi máy chủ: " + (err.message || "Không xác định"));
    }
  };
  
  

  return (
    <Card className="p-4 bg-dark text-white">
      <h3 className="mb-4">Thêm mới banner</h3>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">✅ Thêm banner thành công!</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" style={{marginTop: "-500px"}}>
          <Form.Label>Tên banner</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập tên banner"
            required
          />
        </Form.Group>
        
{previewImage && (
  <div className="mb-3">
    <img
      src={previewImage}
      alt="Preview"
      style={{ maxWidth: "100%", maxHeight: "300px", marginTop: "10px", borderRadius: "8px" }}
    />
  </div>
)}

        <Form.Group className="mb-3">
  <Form.Label>Ảnh banner</Form.Label>
  <Form.Control
    type="file"
    onChange={(e) => {
      const file = e.target.files[0];
      setImage(file);
      if (file) {
        setPreviewImage(URL.createObjectURL(file)); // tạo link ảnh tạm
      } else {
        setPreviewImage(null);
      }
    }}
    accept="image/*"
    required
  />
</Form.Group>


        <Button variant="primary" type="submit">
          Thêm banner
        </Button>
      </Form>
    </Card>
  );
};

export default AddBanner;
