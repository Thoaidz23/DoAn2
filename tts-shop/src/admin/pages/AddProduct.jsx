import React, { useState, useEffect } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const AddProduct = () => {
    const [formData, setFormData] = useState({
    name_group_product: "",
    content: "",
    image: null,  // Ảnh đại diện
    price: "",
    id_category_product: "",
    id_category_brand: "",
    warranty_level: "",
  });

  const [previewImage, setPreviewImage] = useState(null);

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [ramOptions, setRamOptions] = useState([]);
  const [romOptions, setRomOptions] = useState([]);
  const [colorOptions, setColorOptions] = useState([]);
  const [configurations, setConfigurations] = useState([
    { ram: "", rom: "", color: "", quantity: "", price: "" },
  ]);
  const [parameters, setParameters] = useState([ // Thêm state cho thông số kỹ thuật
    { attribute: "", value: "" },
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

  const handleParameterChange = (e, index) => {
    const { name, value } = e.target;
    const updatedParameters = [...parameters];
    updatedParameters[index][name] = value;
    setParameters(updatedParameters);
  };

   const handleAddParameter = () => {
    setParameters([...parameters, { attribute: "", value: "" }]);
  };

  const handleRemoveParameter = (index) => {
    setParameters(parameters.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.id_category_product || !formData.id_category_brand) {
    alert("Vui lòng chọn danh mục sản phẩm và thương hiệu!");
    return;
  }

  const data = new FormData();
  data.append("name_group_product", formData.name_group_product);
  data.append("content", formData.content);
  data.append("price", formData.price);
  data.append("id_category_product", formData.id_category_product);
  data.append("id_category_brand", formData.id_category_brand);
  data.append("image", formData.image);
  data.append("configurations", JSON.stringify(configurations));
  data.append("parameters", JSON.stringify(parameters));
  data.append("warranty_level", formData.warranty_level);

  try {
    const res = await fetch("http://localhost:5000/api/products/add", {
      method: "POST",
      body: data,
    });

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
        const res = await fetch("http://localhost:5000/api/products/categories");
        const result = await res.json();
        setCategories(result);
      } catch (err) {
        console.error("Lỗi khi lấy danh mục:", err);
      }
    };

    const fetchBrands = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products/brands");
        const result = await res.json();
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

        setRamOptions(await ramRes.json());
        setRomOptions(await romRes.json());
        setColorOptions(await colorRes.json());
      } catch (err) {
        console.error("Lỗi khi lấy RAM/ROM/Color:", err);
      }
    };

    fetchCategories();
    fetchBrands();
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
            value={formData.name_group_product || ""}
            onChange={(e) => setFormData({ ...formData, name_group_product: e.target.value })}
            required
          />
        </Form.Group>
          {previewImage && (
          <div className="mb-3">
            <img
              src={previewImage}
              alt="Ảnh xem trước"
              style={{ maxWidth: "100%", maxHeight: "300px", marginTop: "10px", borderRadius: "8px" }}
            />
          </div>
        )}

        <Form.Group className="mb-3">
          <Form.Label>Hình ảnh</Form.Label>
          <Form.Control
            type="file"
            name="image"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              setFormData({ ...formData, image: file });

              if (file) {
                setPreviewImage(URL.createObjectURL(file));
              } else {
                setPreviewImage(null);
              }
            }}
            required
          />
        </Form.Group>


        <Form.Group className="mb-3">
          <Form.Label>Mô tả</Form.Label>
          <div className="bg-white text-dark rounded">
            <CKEditor
              editor={ClassicEditor}
              data={formData.content}
              onChange={(event, editor) => {
                setFormData({ ...formData, content: editor.getData() });
              }}
            />
          </div>
        </Form.Group>

        <Form.Label>Thông số kỹ thuật</Form.Label>
        {parameters.map((param, index) => (
          <div key={index} className="d-flex align-items-center mb-3 gap-3">
            <div className="col-5">
              <Form.Control
                type="text"
                name="attribute"
                value={param.attribute || ""}
                onChange={(e) => handleParameterChange(e, index)}
                placeholder="Attribute"
              />
            </div>
            <div className="col-5">
              <Form.Control
                type="text"
                name="value"
                value={param.value || ""}
                onChange={(e) => handleParameterChange(e, index)}
                placeholder="Value"
              />
            </div>
            {parameters.length > 1 && (
              <Button variant="danger" onClick={() => handleRemoveParameter(index)} className="ms-2">
                Xóa
              </Button>
            )}

            {index === parameters.length - 1 && (
              <Button variant="primary" onClick={handleAddParameter} className="ms-2">Thêm</Button>
            )}
          </div>
        ))}

        <Form.Group className="mb-3">
          <Form.Label>Danh mục sản phẩm</Form.Label>
          <Form.Control
            as="select"
            name="id_category_product"
            value={formData.id_category_product}
            onChange={(e) => setFormData({ ...formData, id_category_product: e.target.value })}
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
                value={config.ram || ""}
                onChange={(e) => handleChange(e, index)}
              >
                <option value="">RAM</option>
                {ramOptions.map((ram) => (
                  <option key={ram.id_ram} value={ram.id_ram}>{ram.name_ram}</option>
                ))}
              </Form.Control>
            </div>
            <div className="col-1">
              <Form.Control
                as="select"
                name="rom"
                value={config.rom || ""}
                onChange={(e) => handleChange(e, index)}
              >
                <option value="">ROM</option>
                {romOptions.map((rom) => (
                  <option key={rom.id_rom} value={rom.id_rom}>{rom.name_rom}</option>
                ))}
              </Form.Control>
            </div>
            <div className="col-2">
              <Form.Control
                as="select"
                name="color"
                value={config.color || ""}
                onChange={(e) => handleChange(e, index)}
              >
                <option value="">Màu</option>
                {colorOptions.map((color) => (
                  <option key={color.id_color} value={color.id_color}>{color.name_color}</option>
                ))}
              </Form.Control>
            </div>
            <div className="col-2">
              <Form.Control
                type="number"
                name="quantity"
                value={config.quantity || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {  // Kiểm tra giá trị số cho quantity
                    handleChange(e, index);
                  }
                }}
                placeholder="Số lượng"
              />
            </div>
            <div className="col-2">
              <Form.Control
                type="text"
                name="price"
                value={config.price || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    handleChange(e, index);
                  }
                }}
                placeholder="Giá"
              />
            </div>
            {configurations.length > 1 && (
              <Button variant="danger" onClick={() => handleRemoveRow(index)} className="ms-2">
                Xóa
              </Button>
            )}

            {index === configurations.length - 1 && (
              <Button variant="primary" onClick={handleAddRow} className="ms-2">Thêm</Button>
            )}
          </div>
        ))}
        <Form.Group className="mb-3">
        <Form.Label>Chế độ bảo hành</Form.Label>
        <Form.Control
          as="select"
          name="warranty_level"
          value={formData.warranty_level}
          onChange={(e) => setFormData({ ...formData, warranty_level: e.target.value })}
          required
        >
          <option value="">Chọn chế độ bảo hành</option>
          <option value="0">Trọn đời</option>
          <option value="1">6 tháng</option>
          <option value="2">1 năm</option>
          <option value="3">2 năm</option>
          <option value="4">3 năm</option>
        </Form.Control>
      </Form.Group>

        <Button variant="success" type="submit">Thêm sản phẩm</Button>
      </Form>
    </Card>
  );
};

export default AddProduct;