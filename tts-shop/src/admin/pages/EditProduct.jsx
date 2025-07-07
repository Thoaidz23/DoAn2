// EditProduct.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Image } from "react-bootstrap";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import axios from "axios";


const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [discount, setDiscount] = useState(0);


  const [formData, setFormData] = useState({
    name_group_product: "",
    content: "",
    image: "",
    id_category_product: "",
    id_category_brand: "",
  });

  const [previewImage, setPreviewImage] = useState("");
  const [parameters, setParameters] = useState([{ attribute: "", value: "" }]);
  const [classifications, setClassifications] = useState([]);
  const [rams, setRams] = useState([]);
  const [roms, setRoms] = useState([]);
  const [colors, setColors] = useState([]);
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/edit/${id}`);
        const data = res.data;

        if (data.length === 0) return;

        const product = data[0];

        const classSet = new Set();
        const uniqueClassifications = [];
        const paramSet = new Set();
        const uniqueParams = [];

        data.forEach(item => {
          const key = `${item.id_ram}-${item.id_rom}-${item.id_color}`;
          if (!classSet.has(key)) {
            classSet.add(key);
            uniqueClassifications.push({
              id_product: item.id_product,
              id_ram: item.id_ram,
              id_rom: item.id_rom,
              id_color: item.id_color,
              quantity: item.quantity,
              price: item.price,
            });
          }

          const paramKey = `${item.attribute}-${item.value}`;
          if (!paramSet.has(paramKey) && item.attribute && item.value) {
            paramSet.add(paramKey);
            uniqueParams.push({ attribute: item.attribute, value: item.value });
          }
        });

        setFormData({
          name_group_product: product.name_group_product,
          content: product.content,
          image: product.image,
          id_category_product: product.id_category_product,
          id_category_brand: product.id_category_brand,
        });

        setDiscount(product.sale || 0);

        setClassifications(uniqueClassifications);
        setParameters(uniqueParams);

        if (product.image) {
          setPreviewImage(`http://localhost:5000/images/product/${product.image}`);
        }
      } catch (error) {
        console.error("Lỗi khi fetch sản phẩm:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
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

  const handleClassificationChange = (index, field, value) => {
  const updated = [...classifications];
  updated[index][field] = value;
  setClassifications(updated);
};


 const handleAddClassification = () => {
  const isIncomplete = classifications.some(
    cls => !cls.id_ram || !cls.id_rom || !cls.id_color || !cls.quantity || !cls.price
  );

  if (isIncomplete) {
    alert("Vui lòng điền đầy đủ thông tin các phân loại trước khi thêm mới.");
    return;
  }

  // Thêm phân loại mới rỗng
  setClassifications([
    ...classifications,
    {
      id_ram: "",
      id_rom: "",
      id_color: "",
      quantity: "",
      price: "",
    },
  ]);
};


  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const cls of classifications) {
      if (!cls.quantity || !cls.price) {
        return alert("Vui lòng điền đầy đủ thông tin phân loại.");
      }
    }

    for (const param of parameters) {
      if (!param.attribute || !param.value) {
        return alert("Vui lòng điền đầy đủ thông số kỹ thuật.");
      }
    }

    const data = new FormData();
    data.append("name_group_product", formData.name_group_product);
    data.append("content", formData.content);
    data.append("id_category_product", formData.id_category_product);
    data.append("id_category_brand", formData.id_category_brand);
    data.append("discount", discount);

    // Transform classifications to expected format for backend
    const transformedClassifications = classifications.map(cls => ({
      id_product: cls.id_product || null,
      ram: cls.id_ram || null,
      rom: cls.id_rom || null,
      color: cls.id_color || null,
      quantity: cls.quantity,
      price: cls.price, // giữ nguyên giá
      discount: discount, // chỉ lưu % khuyến mãi
    }));

    setClassifications([
      ...classifications,
      {
        id_ram: "",
        id_rom: "",
        id_color: "",
        quantity: "",
        price: "",
        isNew: true,
      },
    ]);

    data.append("classifications", JSON.stringify(transformedClassifications));
    data.append("parameters", JSON.stringify(parameters));

    if (formData.image instanceof File) {
      data.append("image", formData.image);
    }

    try {
      const res = await fetch(`http://localhost:5000/api/products/update/${id}`, {
        method: "POST",
        body: data,
      });

      if (res.ok) {
        alert("Cập nhật sản phẩm thành công");
        navigate("/admin/product");
      } else {
        alert("Cập nhật sản phẩm thất bại");
      }
    } catch (err) {
      console.error("Lỗi gửi request cập nhật:", err);
      alert("Có lỗi xảy ra khi cập nhật sản phẩm");
    }
  };
  
    useEffect(() => {
      // Fetch danh sách RAM, ROM, Color từ backend
     const fetchOptions = async () => {
  try {
    const [ramRes, romRes, colorRes] = await Promise.all([
      fetch("http://localhost:5000/api/products/ram"),
      fetch("http://localhost:5000/api/products/rom"),
      fetch("http://localhost:5000/api/products/color"),
    ]);

    const ramsData = await ramRes.json();
    const romsData = await romRes.json();
    const colorsData = await colorRes.json();

    console.log("RAMs:", ramsData);
    console.log("ROMs:", romsData);
    console.log("Colors:", colorsData);
    setRams(Array.isArray(ramsData) ? ramsData : []);
  setRoms(Array.isArray(romsData) ? romsData : []);
  setColors(Array.isArray(colorsData) ? colorsData : []);
    setRams(ramsData);
    setRoms(romsData);
    setColors(colorsData);
  } catch (err) {
    console.error("Lỗi khi lấy RAM/ROM/Color:", err);
  }
};

    
      fetchOptions();
    }, []);
  return (
    <div className="container mt-4" style={{height:"auto"}}>
      <h3 className="mb-4">Chỉnh sửa sản phẩm</h3>
      <Button 
        onClick={() => navigate(`/admin/product/${id}/images`)}
        style={{margin:"1% 0 0 65%",height:"5%"} }>
        Ảnh chi tiết
      </Button>
      <Form onSubmit={handleSubmit} style={{width:"100%"}}>
        <Form.Group className="mb-3">
          <Form.Label>Tên sản phẩm</Form.Label>
          <Form.Control
            type="text"
            name="name_group_product"
            value={formData.name_group_product}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {previewImage && (
          <div className="mb-3">
            <Image src={previewImage} alt="Preview" style={{ width: "150px" }} />
          </div>
        )}

        <Form.Group className="mb-3">
          <Form.Label>Ảnh mới</Form.Label>
          <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
        </Form.Group>

        <Form.Group className="mb-3" >
          <Form.Label>Mô tả</Form.Label>
          <div style={{color:"black"}}>
          <CKEditor
            editor={ClassicEditor}
            data={formData.content}
            onChange={(event, editor) =>
              setFormData(prev => ({ ...prev, content: editor.getData() }))
            }
          />
          </div>
        </Form.Group>

        {/* Parameters */}
        <Form.Group className="mb-3">
          <Form.Label>Thông số kỹ thuật</Form.Label>
          {parameters.map((param, idx) => (
            <div key={idx} className="d-flex gap-2 mb-2" > 
              <Form.Control
              style={{color:"black"}}
                type="text"
                placeholder="Thuộc tính"
                value={param.attribute}
                onChange={(e) => handleParameterChange(idx, "attribute", e.target.value)}
              />
              <Form.Control
                type="text"
                placeholder="Giá trị"
                value={param.value}
                onChange={(e) => handleParameterChange(idx, "value", e.target.value)}
              />
              <Button variant="danger" onClick={() => handleRemoveParameter(idx)}>Xóa</Button>
              {idx === parameters.length - 1 && (
                <Button onClick={handleAddParameter}>Thêm</Button>
              )}
            </div>
          ))}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Phân loại sản phẩm</Form.Label>
          {classifications.map((cls, idx) => (
            <div key={idx} className="d-flex gap-2 mb-2" >
              <Form.Select
                value={cls.id_ram || ""}
                onChange={(e) => handleClassificationChange(idx, "id_ram", e.target.value)}
              >
                <option value="">Chọn RAM</option>
                {rams.map(ram => (
                  <option  key={ram.id_ram} value={ram.id_ram}>{ram.name_ram}</option>
                ))}
              </Form.Select>
              
              <Form.Select
                value={cls.id_rom || ""}
                onChange={(e) => handleClassificationChange(idx, "id_rom", e.target.value)}
              >
                <option value="">Chọn ROM</option>
                {roms.map(rom => (
                  <option key={rom.id_rom} value={rom.id_rom}>{rom.name_rom}</option>
                ))}
              </Form.Select>
              
              <Form.Select
                value={cls.id_color || ""}
                onChange={(e) => handleClassificationChange(idx, "id_color", e.target.value)}
              >
                <option value="">Chọn Màu</option>
                {colors.map(color => (
                  <option key={color.id_color} value={color.id_color}>{color.name_color}</option>
                ))}
              </Form.Select>
              
              <Form.Control
                type="number"
                placeholder="Số lượng"
                value={cls.quantity}
                onChange={(e) => handleClassificationChange(idx, "quantity", e.target.value)}
              />
              <Form.Control
                type="number"
                placeholder="Giá"
                value={cls.price}
                onChange={(e) => handleClassificationChange(idx, "price", e.target.value)}
              />
            </div>
          ))}
          <Button onClick={handleAddClassification}>Thêm phân loại mới</Button>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Khuyến mãi (%)</Form.Label>
          <Form.Select
            value={discount}
            onChange={(e) => setDiscount(parseInt(e.target.value))}
          >
            <option value={0}>Không khuyến mãi</option>
            <option value={5}>5%</option>
            <option value={10}>10%</option>
            <option value={15}>15%</option>
            <option value={20}>20%</option>
            <option value={30}>30%</option>
          </Form.Select>
        </Form.Group>



        <Button type="submit" variant="primary" style={{background:"green"}}>Cập nhật</Button>
      </Form>
    </div>
  );
};

export default EditProduct;
