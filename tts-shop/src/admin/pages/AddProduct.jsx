import React, { useState, useEffect } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    ten_sanpham: "",
    mota: "",
    hinhanh: null,
    price: "",
    id_dmsp: "",
    id_category_brand: "", // Thêm id_category_brand để lưu thông tin thương hiệu
  });

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]); // Thêm state cho thương hiệu
  const [ramOptions, setRamOptions] = useState([]);
  const [romOptions, setRomOptions] = useState([]);
  const [colorOptions, setColorOptions] = useState([]);
  const [configurations, setConfigurations] = useState([
    { ram: "", rom: "", color: "", quantity: "", price: "" },
  ]);

  const navigate = useNavigate();

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updated = [...configurations];
    updated[index][name] = value;
    setConfigurations(updated);
  };

  const handleAddRow = () => {
    setConfigurations([...configurations, { ram: "", rom: "", color: "", quantity: "", price: "" }]);
  };

  const handleRemoveRow = (index) => {
    setConfigurations(configurations.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.id_dmsp || !formData.id_category_brand) {
      alert("Vui lòng chọn danh mục sản phẩm và thương hiệu!");
      return;
    }

    const data = new FormData();
    data.append("ten_sanpham", formData.ten_sanpham);
    data.append("mota", formData.mota);
    data.append("price", formData.price);
    data.append("id_dmsp", formData.id_dmsp);
    data.append("id_category_brand", formData.id_category_brand); // Thêm id_category_brand
    data.append("hinhanh", formData.hinhanh);

    // Thêm cấu hình sản phẩm
    data.append("configurations", JSON.stringify(configurations));

    try {
      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      if (res.ok) {
        alert("✅ Thêm sản phẩm thành công!");
        navigate("/admin/product");
      } else {
        alert("❌ Lỗi khi thêm sản phẩm!");
      }
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log("Đang gọi API để lấy danh mục sản phẩm...");
        const res = await fetch("http://localhost:5000/api/products/categories");

        if (!res.ok) {
          throw new Error('Không thể lấy danh mục sản phẩm');
        }

        const result = await res.json();
        console.log("Danh mục sản phẩm đã được lấy:", result);
        setCategories(result);
      } catch (err) {
        console.error("Lỗi khi lấy danh mục:", err);
      }
    };

    const fetchBrands = async () => {  // Thêm hàm lấy thương hiệu
      try {
        console.log("Đang gọi API để lấy danh mục thương hiệu...");
        const res = await fetch("http://localhost:5000/api/products/brands");

        if (!res.ok) {
          throw new Error('Không thể lấy danh mục thương hiệu');
        }

        const result = await res.json();
        console.log("Danh mục thương hiệu đã được lấy:", result);
        setBrands(result);
      } catch (err) {
        console.error("Lỗi khi lấy thương hiệu:", err);
      }
    };

    const fetchOptions = async () => {
      try {
        const [ramRes, romRes, colorRes] = await Promise.all([
          fetch("http://localhost:5000/api/products/ram"),
          fetch("http://localhost:5000/api/products/rom"),
          fetch("http://localhost:5000/api/products/color"),
        ]);

        const ram = await ramRes.json();
        const rom = await romRes.json();
        const color = await colorRes.json();

        setRamOptions(ram);
        setRomOptions(rom);
        setColorOptions(color);
      } catch (err) {
        console.error("Lỗi khi lấy RAM/ROM/Color:", err);
      }
    };

    fetchCategories();
    fetchBrands();  // Gọi hàm fetch thương hiệu
    fetchOptions();
  }, []);

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
            onChange={(e) => setFormData({ ...formData, ten_sanpham: e.target.value })}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Hình ảnh</Form.Label>
          <Form.Control
            type="file"
            name="hinhanh"
            onChange={(e) => setFormData({ ...formData, hinhanh: e.target.files[0] })}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
        <Form.Label>Mô tả</Form.Label>
        <div className="bg-white text-dark rounded">
          <CKEditor
            editor={ClassicEditor}
            data={formData.mota}
            onChange={(event, editor) => {
              const data = editor.getData();
              setFormData({ ...formData, mota: data });
            }}
          />
        </div>
      </Form.Group>


        <Form.Group className="mb-3">
          <Form.Label>Danh mục sản phẩm</Form.Label>
          <Form.Control
            as="select"
            name="id_dmsp"
            value={formData.id_dmsp}
            onChange={(e) => setFormData({ ...formData, id_dmsp: e.target.value })}
            required
          >
            <option value="">Chọn danh mục</option>
            {categories.map((category) => (
              <option key={category.id_category_product} value={category.id_category_product}>
                {category.name_category_product}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Danh mục thương hiệu</Form.Label>
          <Form.Control
            as="select"
            name="id_category_brand"
            value={formData.id_category_brand}
            onChange={(e) => setFormData({ ...formData, id_category_brand: e.target.value })}
            required
          >
            <option value="">Chọn thương hiệu</option>
            {brands.map((brand) => (
              <option key={brand.id_category_brand} value={brand.id_category_brand}>
                {brand.name_category_brand}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Label>Phân loại</Form.Label>
        {configurations.map((config, index) => (
          <div key={index} className="d-flex align-items-center mb-3 gap-3">
            <div className="col-1">
              <Form.Control
                as="select"
                name="ram"
                value={config.ram}
                onChange={(e) => handleChange(e, index)}
              >
                <option value="">RAM</option>
                {ramOptions.map((ram, idx) => (
                  <option key={idx} value={ram.id_ram}>{ram.name_ram}</option>
                ))}
              </Form.Control>
            </div>
            <div className="col-1">
              <Form.Control
                as="select"
                name="rom"
                value={config.rom}
                onChange={(e) => handleChange(e, index)}
              >
                <option value="">ROM</option>
                {romOptions.map((rom, idx) => (
                  <option key={idx} value={rom.id_rom}>{rom.name_rom}</option>
                ))}
              </Form.Control>
            </div>
            <div className="col-2">
              <Form.Control
                as="select"
                name="color"
                value={config.color}
                onChange={(e) => handleChange(e, index)}
              >
                <option value="">Màu</option>
                {colorOptions.map((color, idx) => (
                  <option key={idx} value={color.id_color}>{color.name_color}</option>
                ))}
              </Form.Control>
            </div>
            <div className="col-2">
              <Form.Control
                type="number"
                name="quantity"
                value={config.quantity}
                onChange={(e) => handleChange(e, index)}
                placeholder="Số lượng"
              />
            </div>
            <div className="col-2">
              <Form.Control
                type="text"
                name="price"
                value={config.price}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    handleChange(e, index);
                  }
                }}
                placeholder="Giá"
              />
            </div>
            <Button variant="danger" onClick={() => handleRemoveRow(index)} className="ms-2">Xóa</Button>
            {index === configurations.length - 1 && (
              <Button variant="primary" onClick={handleAddRow} className="ms-2">Thêm</Button>
            )}
          </div>
        ))}

        <Button variant="success" type="submit">Thêm sản phẩm</Button>
      </Form>
    </Card>
  );
};

export default AddProduct;
