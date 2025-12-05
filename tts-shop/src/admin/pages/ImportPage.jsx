import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { AuthContext } from "../../customer/context/AuthContext";

const ImportPage = () => {
  const { user } = useContext(AuthContext);

  const [groupProducts, setGroupProducts] = useState([]);
  const [variants, setVariants] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [products, setProducts] = useState([]);

  const today = new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState({
    code: "",
    supplier: "",
    date: today,
    note: "",
    id_product: "",
    productName: "",
    quantity: "",
    price: ""
  });

  // Lấy danh sách nhóm sản phẩm
  useEffect(() => {
    axios.get("http://localhost:5000/api/products")
      .then(res => setGroupProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Chọn nhóm sản phẩm
  const handleSelectGroup = async (e) => {
    const groupId = parseInt(e.target.value);
    setSelectedGroup(groupId);
    setSelectedVariant(null);

    if (!groupId) {
      setVariants([]);
      return;
    }

    try {
      const res = await axios.get(`http://localhost:5000/api/products/edit/${groupId}`);
      setVariants(res.data);
    } catch (err) {
      console.error(err);
      setVariants([]);
    }
  };

  // Chọn variant
  const handleSelectVariant = (e) => {
    const variantId = parseInt(e.target.value);
    const variant = variants.find(v => v.id_product === variantId);
    setSelectedVariant(variant);

    setForm({
      ...form,
      id_product: variant.id_product,
      productName: variant.name_group_product,
      price: variant.price
    });
  };

  // Thêm sản phẩm vào danh sách
  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!form.id_product || !form.productName || !form.quantity || !form.price || !selectedVariant) return;

    const newProduct = {
      id: products.length + 1,
      id_product: form.id_product,
      name: form.productName,
      quantity: parseInt(form.quantity),
      price: parseInt(form.price),
      ram: selectedVariant.name_ram || "",
      rom: selectedVariant.name_rom || "",
      color: selectedVariant.name_color || "",
      id_group_product: selectedGroup
    };

    setProducts([...products, newProduct]);

    // Reset form và variant
    setForm({
      ...form,
      id_product: "",
      productName: "",
      quantity: "",
      price: ""
    });
    setSelectedVariant(null);
  };

  // Xóa sản phẩm
  const handleDeleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  // Click vào dòng sản phẩm để edit
  const handleRowClick = async (product) => {
    const groupId = product.id_group_product;
    setSelectedGroup(groupId);

    if (groupId) {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/edit/${groupId}`);
        setVariants(res.data);

        const variant = res.data.find(v => v.id_product === product.id_product);
        setSelectedVariant(variant || null);

      } catch (err) {
        console.error(err);
        setVariants([]);
        setSelectedVariant(null);
      }
    } else {
      setVariants([]);
      setSelectedVariant(null);
    }

    setForm({
      ...form,
      id_product: product.id_product,
      productName: product.name,
      quantity: product.quantity,
      price: product.price
    });

    setProducts(prev => prev.filter(p => p.id !== product.id));
  };

  const totalAmount = products.reduce((sum, p) => sum + p.quantity * p.price, 0);

  const handleSubmitImport = async () => {
    try {
      const payload = {
        code_stock: form.code,
        supplier: form.supplier,
        note: form.note,
        id_user: user.id,
        items: products.map(p => ({
          id_product: p.id_product,
          quantity: p.quantity,
          price: p.price
        }))
      };

      const res = await axios.post("http://localhost:5000/api/stock/import", payload);
      alert("Nhập hàng thành công! ID phiếu: " + res.data.id_stock);

      setProducts([]);
      setForm({
        code: "",
        supplier: "",
        date: today,
        note: "",
        id_product: "",
        productName: "",
        quantity: "",
        price: ""
      });
      setSelectedGroup(null);
      setSelectedVariant(null);
      setVariants([]);

    } catch (err) {
      console.error(err);
      alert("Lỗi khi tạo phiếu nhập!");
    }
  };

  return (
    <div className="main-content" style={{ padding: "25px", backgroundColor: "#181a1b", minHeight: "100vh", color: "#fff" }}>
      <h3 className="mb-4"><i className="bi bi-upload"></i> Nhập hàng</h3>

      {/* Thông tin phiếu nhập */}
      <div className="card-dark mb-4" style={{ backgroundColor: "#242526", padding: "20px", borderRadius: "10px", border: "1px solid #333" }}>
        <h5>Thông tin phiếu nhập</h5>
        <div className="row g-3 mt-2">
          <div className="col-md-7">
            <label className="form-label">Nhà cung cấp</label>
            <input type="text" className="form-control text-dark border-0" placeholder="Tên NCC"
              name="supplier" value={form.supplier} onChange={handleInputChange} />
          </div>
          <div className="col-md-5">
            <label className="form-label">Ngày nhập</label>
            <input type="date" className="form-control text-dark border-0" name="date" value={form.date} readOnly />
          </div>
          <div className="col-md-12">
            <label className="form-label">Ghi chú</label>
            <input type="text" className="form-control text-dark border-0" placeholder="Nhập ghi chú"
              name="note" value={form.note} onChange={handleInputChange} />
          </div>
        </div>
      </div>

      {/* Thêm sản phẩm */}
      <div className="card-dark mb-4" style={{ backgroundColor: "#242526", padding: "20px", borderRadius: "10px", border: "1px solid #333" }}>
        <h5>Thêm sản phẩm</h5>
        <form className="row g-3 mt-2" onSubmit={handleAddProduct}>

          <div className="col-md-4">
            <label className="form-label">Nhóm sản phẩm</label>
            <select className="form-select text-dark border-0" onChange={handleSelectGroup} value={selectedGroup || ""}>
              <option value="">Chọn sản phẩm</option>
              {groupProducts.map(g => (
                <option key={g.id_group_product} value={g.id_group_product}>{g.name_group_product}</option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">Phiên bản</label>
            {variants.length > 0 && (
              <select className="form-select text-dark border-0"
                onChange={handleSelectVariant}
                value={selectedVariant?.id_product || ""}>
                <option value="">Chọn phiên bản</option>
                {variants.map(v => (
                  <option key={v.id_product} value={v.id_product}>
                    {v.name_ram} / {v.name_rom} / {v.name_color} - Giá: {v.price.toLocaleString()}đ
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="col-md-2">
            <label className="form-label">Số lượng</label>
            <input type="number" className="form-control text-dark border-0" name="quantity"
              value={form.quantity} onChange={handleInputChange} />
          </div>

          <div className="col-md-2">
            <label className="form-label">Giá nhập</label>
            <input type="number" className="form-control text-dark border-0" name="price"
              value={form.price} onChange={handleInputChange} />
          </div>

          <div className="col-md-2 d-flex align-items-end">
            <button className="btn btn-primary w-100" type="submit"><i className="bi bi-plus-circle"></i> Thêm</button>
          </div>

        </form>
      </div>

      {/* Danh sách sản phẩm */}
      {products.length > 0 && (
        <div className="card-dark" style={{ backgroundColor: "#242526", padding: "20px", borderRadius: "10px", border: "1px solid #333" }}>
          <h5>Danh sách sản phẩm nhập</h5>
          <table className="table table-dark table-hover mt-3">
            <thead>
              <tr>
                <th className="fw-bold" style={{ color: 'orange' }}>##</th>
                <th>ID SP</th>
                <th>Tên sản phẩm</th>
                <th>RAM</th>
                <th>ROM</th>
                <th>Màu</th>
                <th>Số lượng</th>
                <th>Giá nhập</th>
                <th>Thành tiền</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, index) => (
                <tr key={p.id} style={{ cursor: "pointer" }} onClick={() => handleRowClick(p)}>
                  <td className="fw-bold" style={{ color: 'orange' }}>{index + 1}</td>
                  <td>{p.id_product}</td>
                  <td>{p.name}</td>
                  <td>{p.ram}</td>
                  <td>{p.rom}</td>
                  <td>{p.color}</td>
                  <td>{p.quantity}</td>
                  <td>{p.price.toLocaleString()}</td>
                  <td>{(p.quantity * p.price).toLocaleString()}</td>
                  <td>
                    <i className="bi bi-trash text-danger" style={{ cursor: "pointer" }} onClick={() => handleDeleteProduct(p.id)}></i>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="col-md-12 text-end mt-2">
            <button className="btn btn-success" onClick={handleSubmitImport}>
              <i className="bi bi-check2-circle"></i> Hoàn tất nhập ({totalAmount.toLocaleString()} VNĐ)
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default ImportPage;
