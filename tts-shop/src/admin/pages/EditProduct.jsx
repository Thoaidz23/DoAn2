import React, { useState, useEffect } from "react";
import { Form, Button, Card, Modal } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom"; // Dùng useParams để lấy id sản phẩm từ URL

const EditProduct = () => {
  const { id } = useParams(); // Lấy id sản phẩm từ URL
  const navigate = useNavigate(); // Để điều hướng sau khi sửa sản phẩm
  const [formData, setFormData] = useState({
    ten_sanpham: "",
    giasp: "",
    soluong: "",
    mota: "",
    hinhanh: null,
    id_dmsp: "",
  });
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [previewImage, setPreviewImage] = useState(null); // <- Thêm state để hiển thị ảnh


  // Fetch danh mục sản phẩm từ backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products/categories");
        const result = await response.json();
        setCategories(result);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch thông tin sản phẩm từ backend khi trang được mở
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        const product = await response.json();
        setFormData({
          ten_sanpham: product.ten_sanpham,
          giasp: product.giasp,
          soluong: product.soluong,
          mota: product.noidung,
          hinhanh: null, // Giữ nguyên null để tránh bug upload
          id_dmsp: product.id_dmsp,
        });
        setPreviewImage(product.hinhanh); // <- Hiển thị ảnh cũ
      } catch (error) {
        console.error("Lỗi khi lấy thông tin sản phẩm:", error);
      }
    };
    fetchProduct();
  }, [id]);
  

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value, // Xử lý file cho hình ảnh
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.id_dmsp) {
      alert("Vui lòng chọn danh mục sản phẩm!");
      return;
    }

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "PUT", // Sử dụng phương thức PUT để sửa sản phẩm
        body: data,
      });
      const result = await res.json();
      console.log(result);

      if (res.ok) {
        setModalMessage("✅ Sửa sản phẩm thành công!");
        setShowModal(true);
      } else {
        setModalMessage("❌ Lỗi khi sửa sản phẩm!");
        setShowModal(true);
      }
    } catch (error) {
      console.error("Lỗi khi sửa sản phẩm:", error);
      setModalMessage("❌ Lỗi khi sửa sản phẩm!");
      setShowModal(true);
    }
  };

  const handleModalClose = () => {
    setShowModal(false); // Đóng modal
    navigate("/admin/product"); // Quay lại trang sản phẩm sau khi sửa thành công
  };

  return (
    <Card className="p-4 bg-dark text-white">
      <h3 className="mb-4">Sửa sản phẩm</h3>
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
  {/* Hiển thị ảnh hiện tại nếu có */}
  {previewImage ? (
    <div className="mb-3">
      <img
        src={`http://localhost:5000/images/product/${previewImage}`}
        alt="Hình ảnh sản phẩm"
        style={{ maxWidth: '200px', height: 'auto' }}
      />
    </div>
  ) : (
    <div className="mb-3">
      <i className="fas fa-image" style={{ fontSize: '50px' }}></i>
    </div>
  )}
  {/* Input để chọn lại hình ảnh mới */}
  <Form.Control
    type="file"
    name="hinhanh"
    onChange={handleChange}
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

        <Button variant="success" type="submit">
          Lưu thay đổi
        </Button>
      </Form>

      {/* Modal thông báo */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Thông báo</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default EditProduct;
