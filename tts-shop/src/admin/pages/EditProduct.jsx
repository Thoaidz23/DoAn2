import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Image } from "react-bootstrap";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // name_group_product: "",
    image: "",
    content: "",
  });

  const [previewImage, setPreviewImage] = useState("");
  const [parameters, setParameters] = useState([]);
  const [classifications, setClassifications] = useState([]);  
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]); 

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/edit/${id}`);
        const data = await res.json();
        const product = data.find((item) => item.id_product === parseInt(id));

        // Lấy các thông số kỹ thuật duy nhất từ danh sách data
        const parameters = [];
        const seen = new Set();
        data.forEach(item => {
        const key = `${item.attribute}-${item.value}`;
        if (!seen.has(key)) {
          seen.add(key);
          if (item.attribute && item.value) {
            parameters.push({ attribute: item.attribute, value: item.value });
          }
        }
      });
      // Lấy các phân loại (RAM, ROM, Color) và các thông tin khác
        const classifications = [];
        const seenClassifications = new Set();
        data.forEach(item => {
          const key = `${item.name_ram}-${item.name_rom}-${item.name_color}`;
          if (!seenClassifications.has(key)) {
            seenClassifications.add(key);
            if (item.name_ram && item.name_rom && item.name_color) {
              classifications.push({
                name_ram: item.name_ram,
                name_rom: item.name_rom,
                name_color: item.name_color,
                quantity: item.quantity || "",
                price: item.price || "",
              });
            }
          }
        });
        if (product) {
          setFormData({
            name_group_product: product.name_group_product || "",
            image: product.image || "",
            content: product.content || "",
          });
          setPreviewImage(`http://localhost:5000/images/product/${product.image}`);
          console.log("Thông số kỹ thuật:", product.parameters);
          setParameters(parameters);
          setClassifications(classifications);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleParameterChange = (index, field, value) => {
    const updated = [...parameters];
    updated[index][field] = value;
    setParameters(updated);
  };

  const handleAddParameter = () => {
    setParameters([...parameters, { attribute: "", value: "" }]);
  };

  const handleRemoveParameter = (index) => {
    const updated = parameters.filter((_, i) => i !== index);
    setParameters(updated.length > 0 ? updated : [{ attribute: "", value: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name_group_product", formData.name_group_product);
    data.append("content", formData.content);
    data.append("parameters", JSON.stringify(parameters)); // gửi mảng thông số
    if (formData.image instanceof File) {
      data.append("image", formData.image);
    }

    try {
      const res = await fetch(`http://localhost:5000/api/products/edit/${id}`, {
        method: "PUT",
        body: data,
      });

      if (res.ok) {
        alert("Cập nhật sản phẩm thành công");
        navigate("/admin/product");
      } else {
        alert("Cập nhật sản phẩm thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Chỉnh sửa sản phẩm</h3>
      <Form onSubmit={handleSubmit} style={{width:"100%", marginTop:""}}>
        <div className="mb-3">
          <label className="form-label">Tên sản phẩm</label>
          <input
            type="text"
            className="form-control"
            name="name_group_product"
            value={formData.name_group_product}
            onChange={handleChange}
            required
          />
        </div>

        {previewImage && (
          <div className="mb-3">
            <label className="form-label">Ảnh sản phẩm</label>
            <div>
              <Image
                src={previewImage}
                alt="Product"
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />
            </div>
          </div>
        )}

        <div className="mb-3">
          <label className="form-label">Chọn ảnh sản phẩm mới</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Mô tả</label>
          <div className="bg-white text-dark rounded p-2">
            <CKEditor
              editor={ClassicEditor}
              data={formData.content}
              onChange={(event, editor) => {
                const data = editor.getData();
                setFormData({ ...formData, content: data });
              }}
            />
          </div>
        </div>

        {/* Thông số kỹ thuật */}
        <div className="mb-3">
  <label className="form-label">Thông số kỹ thuật</label>
  {parameters.map((param, index) => (
    <div key={index} className="d-flex gap-2 mb-2">
      <input
        type="text"
        className="form-control form-control-sm w-auto"  // Thêm class form-control-sm và w-auto để giảm chiều rộng
        placeholder="Thuộc tính"
        value={param.attribute || ""}
        onChange={(e) => handleParameterChange(index, "attribute", e.target.value)}
      />
      <input
        type="text"
        className="form-control form-control-sm w-auto"  // Thêm class form-control-sm và w-auto để giảm chiều rộng
        placeholder="Giá trị"
        value={param.value || ""}
        onChange={(e) => handleParameterChange(index, "value", e.target.value)}
      />
      <Button variant="danger" onClick={() => handleRemoveParameter(index)}>
        Xóa
      </Button>
      {index === parameters.length - 1 && (
        <Button variant="primary" onClick={handleAddParameter}>
          Thêm
        </Button>
      )}
    </div>
  ))}
</div>


{/* Phân loại */}
        <div className="mb-3">
  <label className="form-label">Phân loại</label>
  <div className="d-flex gap-2 mb-2">
    <div className="w-20" style={{ marginLeft: "70px" }}>
  <label className="form-label">RAM</label>
</div>
<div className="w-20" style={{ marginLeft: "150px" }}>
  <label className="form-label">ROM</label>
</div>
<div className="w-20" style={{ marginLeft: "140px" }}>
  <label className="form-label">Màu</label>
</div>
<div className="w-20" style={{ marginLeft: "130px" }}>
  <label className="form-label">Số lượng</label>
</div>
<div className="w-20" style={{ marginLeft: "130px" }}>
  <label className="form-label">Giá</label>
</div>

  </div>

  {classifications.map((classification, index) => (
    <div key={index} className="d-flex gap-2 mb-2">
      <div className="w-20">
        <input
          type="text"
          className="form-control form-control-sm w-auto"
          placeholder="RAM"
          value={classification.name_ram || ""}
          disabled
        />
      </div>

      <div className="w-20">
        <input
          type="text"
          className="form-control form-control-sm w-auto"
          placeholder="ROM"
          value={classification.name_rom || ""}
          disabled
        />
      </div>

      <div className="w-20">
        <input
          type="text"
          className="form-control form-control-sm w-auto"
          placeholder="Color"
          value={classification.name_color || ""}
          disabled
        />
      </div>

      <div className="w-20">
        <input
          type="number"
          className="form-control form-control-sm w-auto"
          placeholder="Số lượng"
          value={classification.quantity || ""}
          onChange={(e) => handleParameterChange(index, "quantity", e.target.value)}
        />
      </div>

      <div className="w-20">
        <input
          type="number"
          className="form-control form-control-sm w-auto"
          placeholder="Giá"
          value={classification.price || ""}
          onChange={(e) => handleParameterChange(index, "price", e.target.value)}
        />
      </div>
    </div>
  ))}
</div>




        <Button type="submit" variant="success" className="mt-4">
          Cập nhật sản phẩm
        </Button>
      </Form>
    </div>
  );
};

export default EditProduct;
