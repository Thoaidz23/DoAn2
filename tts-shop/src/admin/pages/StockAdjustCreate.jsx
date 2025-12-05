import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { AuthContext } from "../../customer/context/AuthContext";

const StockAdjustCreate = () => {
  const { user } = useContext(AuthContext);

  const [groupProducts, setGroupProducts] = useState([]);
  const [variants, setVariants] = useState([]);


  const validVariants = variants.filter(v =>
    v.name_ram || v.name_rom || v.name_color
  );

  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [items, setItems] = useState([]);

  const [form, setForm] = useState({
    reason: "",
    id_product: "",
    quantity: "",
  });

// CONTROL UI STATES
const isGroupSelected = !!selectedGroup;
const hasVariants = validVariants.length > 0;
const isVariantSelected = !!selectedVariant;

// ⬇ Điều kiện mở input số lượng
// - Nếu có variant → phải chọn variant
// - Nếu không có variant → chỉ cần chọn group
const canInputQty = (!hasVariants && isGroupSelected) || isVariantSelected;

// ⬇ Mở nút thêm chỉ khi số lượng hợp lệ
const canAdd = canInputQty && form.quantity !== "";

  // ======================================
  // LOAD NHÓM SẢN PHẨM
  // ======================================
  useEffect(() => {
    axios.get("http://localhost:5000/api/products")
      .then(res => setGroupProducts(res.data))
      .catch(err => console.log(err));
  }, []);

  // ======================================
  // CHỌN NHÓM → LẤY VARIANT
  // ======================================
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
      console.log(err);
      setVariants([]);
    }
  };

  // ======================================
  // CHỌN PHIÊN BẢN
  // ======================================
  const handleSelectVariant = (e) => {
    const variantId = parseInt(e.target.value);
    const variant = variants.find(v => v.id_product === variantId);
        const validVariants = variants.filter(v =>
      v.name_ram || v.name_rom || v.name_color
    );

    setSelectedVariant(variant);

    setForm({
      ...form,
      id_product: variant.id_product,
      quantity: "",
    });
  };

  // ======================================
  // THÊM SẢN PHẨM VÀO DANH SÁCH ĐIỀU CHỈNH
  // ======================================
  const handleAddItem = (e) => {
  e.preventDefault();
  if (!form.quantity) return;
 if (selectedVariant && Number(form.quantity) > Number(selectedVariant.quantity)) {
    alert(`Chỉ còn ${selectedVariant.quantity} sản phẩm trong kho, không thể trừ ${form.quantity}!`);
    return;
}


  let variant = selectedVariant;

  // Nếu KHÔNG có phiên bản → lấy sản phẩm duy nhất từ API
  if (!variant && variants.length === 1) {
    variant = variants[0];
  }

  if (!variant) return; // Vẫn không có -> dừng

  const newItem = {
    id: items.length + 1,
    id_product: variant.id_product,
    name_group_product: variant.name_group_product,
    ram: variant.name_ram,
    rom: variant.name_rom,
    color: variant.name_color,
    adjust_quantity: parseInt(form.quantity),
    id_group_product: selectedGroup
  };

  setItems([...items, newItem]);

  // Reset form
  setSelectedGroup(null);
  setVariants([]);
  setSelectedVariant(null);
  setForm({ reason: form.reason, id_product: "", quantity: "" });
};

  // ======================================
  // CLICK 1 DÒNG → EDIT
  // ======================================
  const handleRowClick = async (item) => {
    setSelectedGroup(item.id_group_product);

    try {
      const res = await axios.get(`http://localhost:5000/api/products/edit/${item.id_group_product}`);
      setVariants(res.data);

      const variant = res.data.find(v => v.id_product === item.id_product);
      setSelectedVariant(variant);

    } catch (err) {
      console.log(err);
    }

    setForm({
      ...form,
      id_product: item.id_product,
      quantity: item.adjust_quantity,
    });

    setItems(prev => prev.filter(i => i.id !== item.id));
  };

  // ======================================
  // XOÁ ITEM
  // ======================================
  const handleDeleteItem = (id) => {
    setItems(items.filter(i => i.id !== id));
  };

  // ======================================
  // GỬI PHIẾU
  // ======================================
  const handleSubmit = () => {
    if (!form.reason.trim()) {
      alert("Vui lòng nhập lý do điều chỉnh trước khi thêm sản phẩm!");
      return;
    }
    axios.post("http://localhost:5000/api/stock-adjust", {
      id_staff: user.id,
      reason: form.reason,
      items: items.map(p => ({
        id_product: p.id_product,
        adjust_quantity: p.adjust_quantity
      }))
    })
      .then(() => {
  alert("Tạo phiếu điều chỉnh thành công!");
  window.location.href = "/admin/stockadjust-list";
})
      .catch(err => console.log(err));
    
  };

  return (
    <div className="main-content" style={{ padding: "25px", backgroundColor: "#181a1b", minHeight: "100vh", color: "#fff" }}>
      <h3 className="mb-4"><i className="bi bi-sliders"></i> Điều chỉnh tồn kho</h3>


      {/* ==================== THÔNG TIN PHIẾU ==================== */}
      <div className="card-dark mb-4" style={{ backgroundColor: "#242526", padding: "20px", borderRadius: "10px", border: "1px solid #333" }}>
        <h5>Thông tin phiếu</h5>

        <div className="row g-3 mt-2">
          <div className="col-md-12">
            <label className="form-label">Lý do điều chỉnh</label>
            <textarea
              className="form-control text-dark border-0"
              placeholder="Nhập lý do"
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
            ></textarea>
          </div>
        </div>

      </div>


      {/* ==================== THÊM SẢN PHẨM ==================== */}
      <div className="card-dark mb-4" style={{ backgroundColor: "#242526", padding: "20px", borderRadius: "10px", border: "1px solid #333" }}>
        <h5>Thêm sản phẩm cần điều chỉnh</h5>

        <form className="row g-3 mt-2" onSubmit={handleAddItem}>

          <div className="col-md-4">
            <label className="form-label">Sản phẩm</label>
            <select className="form-select text-dark border-0"
              onChange={handleSelectGroup}
              value={selectedGroup || ""}
            >
              <option value="">Chọn sản phẩm</option>
              {groupProducts.map(g => (
                <option key={g.id_group_product} value={g.id_group_product}>{g.name_group_product}</option>
              ))}
            </select>
          </div>

          {validVariants.length > 0 ? (
            <div className="col-md-4">
               <label className="form-label">Phiên bản</label>
            <select
              className={`form-select text-dark border-0 ${!isGroupSelected || !hasVariants ? "bg-secondary text-light" : ""}`}
              onChange={handleSelectVariant}
              value={selectedVariant?.id_product || ""}
              disabled={!isGroupSelected || !hasVariants}
            >
              <option value="">{hasVariants ? "Chọn phiên bản" : "Không có phiên bản"}</option>

              {hasVariants && validVariants.map(v => (
                <option key={v.id_product} value={v.id_product}>
                  {v.name_ram || "-"} / {v.name_rom || "-"} / {v.name_color || "-"}
                </option>
              ))}
            </select>
                </div>
          ):(
            <div className="col-md-4">
              <label className="form-label">Phiên bản</label>
              <select
                className="form-select text-dark border-0 bg-secondary text-light"
                onChange={handleSelectVariant}
                value={selectedVariant?.id_product || ""}
                disabled
              >
                <option value="">Không có</option>
              </select>   
            </div>
          )}

          <div className="col-md-2">
            <label className="form-label">Số lượng</label>
           <input
  type="number"
  className={`form-control text-dark border-0 ${!canInputQty ? "bg-secondary text-light" : ""}`}
  value={form.quantity}
  disabled={!canInputQty}
  onChange={(e) => {
    if (!canInputQty) return;

    const val = e.target.value;
    if (val === "") {
      setForm({ ...form, quantity: "" });
      return;
    }

    const num = Number(val);

    // tồn kho
    const maxQty = Number(
      selectedVariant?.quantity ??
      variants[0]?.quantity ??
      0
    );

    if (num > maxQty) {
      alert(`❌ Chỉ còn ${maxQty} sản phẩm trong kho!`);
      setForm({ ...form, quantity: maxQty });
      return;
    }

    setForm({ ...form, quantity: num });
  }}
/>



          </div>

          <div className="col-md-2 d-flex align-items-end">
            <button className="btn btn-primary w-100"
              type="submit"
              disabled={!canAdd}
              style={{ opacity: canAdd ? 1 : 0.5 }}
            >
              <i className="bi bi-plus-circle"></i> Thêm
            </button>

          </div>

        </form>
      </div>


      {/* ==================== DANH SÁCH ITEM ==================== */}
      {items.length > 0 && (
        <div className="card-dark" style={{ backgroundColor: "#242526", padding: "20px", borderRadius: "10px", border: "1px solid #333" }}>
          <h5>Danh sách điều chỉnh</h5>

          <table className="table table-dark table-hover mt-3">
            <thead>
              <tr>
                <th className="fw-bold" style={{ color: 'orange' }}>#</th>
                <th>ID SP</th>
                <th>Nhóm</th>
                <th>RAM</th>
                <th>ROM</th>
                <th>Màu</th>
                <th>SL Điều chỉnh</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {items.map((p, index) => (
                <tr key={p.id} style={{ cursor: "pointer" }} onClick={() => handleRowClick(p)}>
                  <td className="fw-bold" style={{ color: 'orange' }}>{index + 1}</td>
                  <td>{p.id_product}</td>
                  <td>{p.name_group_product}</td>
                  <td>{p.ram || "-"}</td>
                  <td>{p.rom || "-"}</td>
                  <td>{p.color || "-"}</td>
                  <td>{p.adjust_quantity}</td>
                  <td style={{ width: '30px', textAlign: 'center' }}>
                     <i className="bi bi-trash" 
                        style={{ width: '50px'}}
                        onClick={(e) => { e.stopPropagation(); handleDeleteItem(p.id);
                      }}></i>
                  </td>
                    
                </tr>
              ))}
            </tbody>
          </table>

          <div className="col-md-12 text-end mt-2">
            <button className="btn btn-success" onClick={handleSubmit}>
              <i className="bi bi-check2-circle"></i> Hoàn tất điều chỉnh
            </button>
          </div>

        </div>
      )}

    </div>
  );
};

export default StockAdjustCreate;
