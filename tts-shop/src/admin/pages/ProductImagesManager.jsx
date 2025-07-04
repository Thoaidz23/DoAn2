import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button, Image, Form } from "react-bootstrap";

const ProductImagesPage = () => {
  const { id } = useParams(); // id là id_group_product
  const [images, setImages] = useState([]);
  const [newImage, setNewImage] = useState(null);

  const fetchImages = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/products/images/${id}`);
                        


      setImages(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách ảnh:", err);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [id]);

  const handleImageUpload = async () => {
    if (!newImage) return;

    const formData = new FormData();
    formData.append("image", newImage);

    try {
      await axios.post(`http://localhost:5000/api/products/images/upload/${id}`, formData);
      setNewImage(null);
      fetchImages();
    } catch (err) {
      console.error("Lỗi khi upload ảnh:", err);
    }
  };

  const handleDelete = async (id_product_images) => {
    if (!window.confirm("Bạn có chắc muốn xóa ảnh này?")) return;

    try {
     await axios.delete(`http://localhost:5000/api/products/images/delete/${id_product_images}`);
      fetchImages();
    } catch (err) {
      console.error("Lỗi khi xóa ảnh:", err);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Quản lý ảnh chi tiết sản phẩm</h3>

      <div className="sticky-top mb-3 z-1" style={{width:"100%",height:"5%"}}>
        <Form.Group>
          <Form.Label>Thêm ảnh mới</Form.Label>
          <Form.Control type="file" accept="image/*" onChange={(e) => setNewImage(e.target.files[0])} />
        </Form.Group>
        <Button className="mt-2" onClick={handleImageUpload}>Tải lên</Button>
      </div>

      <div className="row"  style={{width:"100%"}}>
        {images.map((img) => (
          <div key={img.id_product_images} className="col-md-3 mb-3"style={{width:"15%"}}>
            <Image 
            
            src={`http://localhost:5000/images/product/${img.name}`} thumbnail fluid />
            <Button
              variant="danger"
              className="mt-2 w-100"
              onClick={() => handleDelete(img.id_product_images)}
            >
              Xóa
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImagesPage;
