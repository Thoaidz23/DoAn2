import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const StockWarningPage = () => {
  const [filters, setFilters] = useState({
  code: "",
  name: "",
  status: "",
  threshold: localStorage.getItem("threshold") || 10, // load giá trị cũ
});
  const [variants, setVariants] = useState([]);
 
  // Load dữ liệu từ backend
  const fetchVariants = async () => {
    try {
      // 1. Lấy danh sách group_product
      const res = await axios.get("http://localhost:5000/api/products");
      const groups = res.data;

      // 2. Lấy chi tiết variant cho từng group_product, bỏ qua lỗi 404
      const variantResponses = await Promise.all(
        groups.map(async (gp) => {
          try {
            const res = await axios.get(`http://localhost:5000/api/products/edit/${gp.id_group_product}`);
            // map từng variant kèm thông tin group_product
            return res.data.map(v => ({
              ...v,
              groupName: gp.name_group_product,
              categoryName: gp.name_category_product,
              brandName: gp.name_category_brand
            }));
          } catch (err) {
            console.warn(`Không tìm thấy chi tiết cho group_product ${gp.id_group_product}`);
            return [];
          }
        })
      );

      // 3. Gộp tất cả variant thành 1 mảng
      const allVariants = variantResponses.flat();

      // 4. Lưu vào state
      setVariants(allVariants);

    } catch (err) {
      console.error(err);
      alert("Lỗi khi tải danh sách sản phẩm!");
    }
  };
const handleThresholdChange = (e) => {
  const val = e.target.value;
  setFilters(prev => {
    const newFilters = { ...prev, threshold: val };
    localStorage.setItem("threshold", val); // lưu vào localStorage
    return newFilters;
  });
};

  

  useEffect(() => {
    fetchVariants();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

const handleRowClick = (variant) => {
  setFilters(prev => ({
    ...prev,
    name: variant.groupName // điền tên sản phẩm vào filter
  }));
};

  const threshold = Number(filters.threshold) || 10;
  // Lọc variant theo input
  const filteredVariants = variants.filter(v => {
     if (v.quantity === null || v.quantity === undefined) return false;
    let status = "";
    if (v.quantity === 0) status = "hethang";
      else if (v.quantity <= threshold) status = "saphet";
      else status = "ton"; // những sp giữa 50-100

    const matchStatus = filters.status === "" || filters.status === status;
    const matchCode = filters.code === "" || String(v.id_product).toLowerCase().includes(filters.code.toLowerCase());
    const matchName = filters.name === "" || v.groupName.toLowerCase().includes(filters.name.toLowerCase());
    return matchStatus && matchCode && matchName;
  });

  // Sắp xếp tồn kho: ít → nhiều
  const sortedVariants = filteredVariants.sort((a, b) => a.quantity - b.quantity);
 const lastStt = sortedVariants.length > 0 ? sortedVariants.length : 0;
  return (
    <div style={{ padding: "25px", backgroundColor: "#181a1b", minHeight: "100vh", color: "#fff" }}>
      <h3 className="mb-4"> Danh sách sản phẩm tồn kho ({lastStt})</h3>

      {/* Bộ lọc tìm kiếm */}
      <div style={{ backgroundColor: "#242526", padding: "20px", borderRadius: "10px", border: "1px solid #333", marginBottom: "20px" }}>
        <h5>Bộ lọc tìm kiếm</h5>
        <form className="row g-3 mt-2" onSubmit={e => e.preventDefault()}>
          <div className="col-md-2">
            <label className="form-label">ID sản phẩm</label>
            <input 
              type="text" 
              className="form-control bg-light text-dark border-1" 
              placeholder="Nhập id sản phẩm"
              name="code"
              value={filters.code}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Tên sản phẩm</label>
            <div className="input-group">
              <input 
                type="text" 
                className="form-control bg-light text-dark border-1" 
                placeholder="Nhập tên sản phẩm"
                name="name"
                value={filters.name}
                onChange={handleInputChange}
              />
              <button 
                className="btn btn-secondary"
                style={{ background: '#242526' }}
                type="button"
                onClick={() => setFilters({ ...filters, name: "" })}
              >
                X
              </button>
            </div>
          </div>
         <div className="col-md-3">
  <label className="form-label">Ngưỡng tồn kho</label>
  <input
    type="number"
    className="form-control bg-light text-dark border-1"
    placeholder="10"
    name="threshold"
    value={filters.threshold}
    onChange={handleThresholdChange}
    min={0}
  />
</div>

          <div className="col-md-3">
            <label className="form-label">Trạng thái</label>
            <select 
              className="form-select bg-light text-dark border-1" 
              name="status"
              value={filters.status}
              onChange={handleInputChange}
            >
              <option value="">Tất cả</option>
              <option value="ton">Tồn kho</option>
              <option value="saphet">Sắp hết hàng</option>
              <option value="hethang">Hết hàng</option>
            </select>
          </div>
          

          {/* <div className="col-md-3 mt-5">
            <button className="btn btn-primary "><i className="bi bi-search"></i> Tìm kiếm</button>
          </div> */}
        </form>
      </div>

      {/* Bảng cảnh báo */}
      <div style={{ backgroundColor: "#242526", padding: "20px", borderRadius: "10px", border: "1px solid #333" }}>
        
        <table className="table table-dark table-hover mt-3">
          <thead>
            <tr>
              <th  className="fw-bold" style={{ color: 'orange' }}>##</th>
              <th>ID SP</th>
              <th>Tên SP</th>
              <th>Danh mục</th>
              <th>RAM</th>
              <th>ROM</th>
              <th>Màu sắc</th>
              <th>Tồn kho</th>
              <th>Trạng thái</th>
              <th>Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {sortedVariants.map((v, idx) => {
              let status = "";
                if (v.quantity === 0) status = "hethang";
                else if (v.quantity <= threshold) status = "saphet";
                else status = "ton"; 

              return (
                <tr key={v.id_product}>
                  <td className="fw-bold" style={{ color: 'orange' }}>{idx + 1}</td>
                  
                  <td>{v.id_product}</td>
                  <td  onClick={() => handleRowClick(v)} style={{ cursor: "pointer" }}>{v.groupName}</td>
                  <td>{v.name_category_product}</td>
                  <td>{v.name_ram || "-"}</td>
                  <td>{v.name_rom || "-"}</td>
                  <td>{v.name_color || "-"}</td>
                  <td >{v.quantity}</td>
                  <td>
                    {status === "saphet" && <span className="badge bg-warning text-dark">Sắp hết hàng</span>}
                    {status === "hethang" && <span className="badge bg-danger">Hết hàng</span>}
                    {status === "ton" && <span className="badge bg-success">Tồn kho</span>}                       
                  </td>
                  <td>
                    <td>
                                    <Link to={`/stock-history/${v.id_product}`} className="btn btn-primary btn-sm">
                                      Xem
                                    </Link>
                                  </td>

                  </td>
                </tr>
              );
            })}
            {sortedVariants.length === 0 && (
              <tr>
                <td colSpan="10" className="text-center">Không có sản phẩm cần cảnh báo</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockWarningPage;
