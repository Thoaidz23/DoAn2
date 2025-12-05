import React, { useEffect, useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from "react-router-dom";

const HistoryPage = () => {
  const [stocks, setStocks] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [filters, setFilters] = useState({
    type: "",
    code: "",
    fromDate: "",
    toDate: ""
  });

  const [supplierFilter, setSupplierFilter] = useState(""); // Bộ lọc NCC riêng
  const [orderFilter, setOrderFilter] = useState("");
  const navigate = useNavigate();

  // Load danh sách stock
  const fetchStocks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/stock");
      setStocks(res.data);
    } catch (err) {
      console.error(err);
      alert("Lỗi khi tải lịch sử nhập/xuất!");
    }
  };

  // Load nhân viên
  const fetchStaffs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/staffaccounts");
      setStaffs(res.data);
    } catch (err) {
      console.error("Lỗi lấy danh sách nhân viên:", err);
    }
  };

  useEffect(() => {
    fetchStocks();
    fetchStaffs();
  }, []);

  // Bộ lọc chung
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Click vào tên NCC -> tự động set bộ lọc NCC
  const handleRowClick = (stock) => {
    setSupplierFilter(stock.supplier || "");
  };

  // Filter stocks theo bộ lọc chung
  const filteredStocks = stocks.filter(stock => {
    const matchType = filters.type ? stock.type === filters.type : true;
    const matchCode = filters.code ? stock.code_stock.toLowerCase().includes(filters.code.toLowerCase()) : true;

    const stockDate = new Date(stock.created_at); // thời gian đầy đủ
    const fromDate = filters.fromDate ? new Date(filters.fromDate + "T00:00:00") : null;
    const toDate = filters.toDate ? new Date(filters.toDate + "T23:59:59") : null;

    const matchFrom = filters.fromDate ? stockDate  >= fromDate : true;
    const matchTo = filters.toDate ? stockDate  <= toDate : true;

    return matchType && matchCode && matchFrom && matchTo;
  });

  // Tách nhập & xuất
  const imports = filteredStocks.filter(stock => stock.type === "IMPORT");
  const exports = filteredStocks.filter(stock => stock.type === "EXPORT");



  // Lọc thêm theo đơn hàng
  const filteredExports = orderFilter
  ? exports.filter(e =>
      (e.code_order || "").toLowerCase().includes(orderFilter.toLowerCase())
    )
  : exports;

  // Lọc thêm theo NCC
  const filteredImports = supplierFilter
    ? imports.filter(i =>
        (i.supplier || "").toLowerCase().includes(supplierFilter.toLowerCase())
      )
    : imports;


console.log("Before sort:", filteredImports.map(s => s.created_at));
const sortedImports = [...filteredImports].sort(
  (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
);
console.log("After sort:", sortedImports.map(s => s.created_at));

const sortedExports = [...filteredExports].sort(
  (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
);
console.log(filteredImports.map(s => s.created_at));
console.log(sortedImports.map(s => s.created_at));

  return (
    <div style={{ padding: "25px", backgroundColor: "#181a1b", minHeight: "100vh", color: "#fff" }}>
      <h3 className="mb-4"><i className="bi bi-clock-history"></i> Lịch sử nhập/xuất hàng</h3>

      {/* Bộ lọc tìm kiếm */}
      <div className="card-dark mb-4" style={cardDark}>
        <h5>Bộ lọc tìm kiếm</h5>
        <form className="row g-3 mt-2">
          

          <div className="col-md-2">
            <label className="form-label">Mã phiếu</label>
            <input type="text" className="form-control" name="code" value={filters.code} onChange={handleInputChange} />
          </div>

          <div className="col-md-2">
            <label className="form-label">Từ ngày</label>
            <input type="date" className="form-control" name="fromDate" value={filters.fromDate} onChange={handleInputChange} />
          </div>

          <div className="col-md-2">
            <label className="form-label">Đến ngày</label>
            <input type="date" className="form-control" name="toDate" value={filters.toDate} onChange={handleInputChange} />
          </div>
        </form>
      </div>

      {/* Bảng nhập & xuất */}
      <div className="mt-4" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>

        {/* ======= BẢNG NHẬP ======= */}
        <div className="card-dark" style={cardDark}>
          <h5 className="text-success">
            <i className="bi bi-box-arrow-in-down"></i> Danh sách nhập kho
          </h5>

          {/* Bộ lọc NCC */}
          <div className="mt-3">
            <label className="form-label">Lọc theo nhà cung cấp</label>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Tên nhà cung cấp"
                value={supplierFilter}
                onChange={(e) => setSupplierFilter(e.target.value)}
              />
              <button
                className="btn btn-secondary"
                style={{ background: '#242526' }}
                onClick={() => setSupplierFilter("")}
              >
                X
              </button>
            </div>
          </div>

          <table className="table table-dark table-hover mt-3">
            <thead>
              <tr>
                <th>#</th>
                <th>Mã phiếu</th>
                <th>Nhà cung cấp</th>
                <th>Ngày</th>
                <th>Nhân viên</th>
                <th>Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {sortedImports.map((stock, index) => (
                <tr key={stock.id_stock}>
                  <td style={{ color: "orange" }}>{index + 1}</td>
                  <td>{stock.code_stock}</td>
                  <td onClick={() => handleRowClick(stock)}>{stock.supplier || "N/A"}</td>
                  <td>{new Date(stock.created_at).toLocaleDateString("vi-VN")}</td>
                  <td>{staffs.find(s => s.id_user === stock.id_employee)?.name || "N/A"}</td>
                  <td>
                    <button className="btn btn-sm btn-secondary" onClick={() => navigate(`/admin/import-detail/${stock.id_stock}`)}>
                      <i className="bi bi-eye"></i> Xem
                    </button>
                  </td>
                </tr>
              ))}

              {filteredImports.length === 0 && (
                <tr><td colSpan="6" className="text-center">Không có dữ liệu</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ======= BẢNG XUẤT ======= */}
        <div className="card-dark" style={cardDark}>
          <h5 className="text-danger">
            <i className="bi bi-box-arrow-up"></i> Danh sách xuất kho
          </h5>
            {/* Bộ lọc mã đơn hàng */}
            <div className="mt-3">
              <label className="form-label">Lọc theo mã đơn hàng</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nhập mã đơn hàng"
                  value={orderFilter}
                  onChange={(e) => setOrderFilter(e.target.value)}
                />
                <button
                  className="btn btn-secondary"
                  style={{ background: '#242526' }}
                  onClick={() => setOrderFilter("")}
                >
                  X
                </button>
              </div>
            </div>

          <table className="table table-dark table-hover mt-3">
            <thead>
              <tr>
                <th>#</th>
                <th>Mã phiếu</th>
                <th>Mã đơn</th>
                <th>Ngày</th>
                <th>Nhân viên</th>
                <th>Chi tiết</th>
              </tr>
            </thead>

            <tbody>
              {sortedExports.map((stock, index) => (
                <tr key={stock.id_stock}>
                  <td style={{ color: "orange" }}>{index + 1}</td>
                  <td>{stock.code_stock}</td>
                  <td>{stock.code_order || "N/A"}</td>
                  <td>{new Date(stock.created_at).toLocaleDateString("vi-VN")}</td>
                  <td>{staffs.find(s => s.id_user === stock.id_employee)?.name || "N/A"}</td>
                  <td>
                    <button className="btn btn-sm btn-secondary" onClick={() => navigate(`/admin/import-detail/${stock.id_stock}`)}>
                      <i className="bi bi-eye"></i> Xem
                    </button>
                  </td>
                </tr>
              ))}

              {filteredExports.length === 0 && (
                <tr><td colSpan="6" className="text-center">Không có dữ liệu</td></tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

const cardDark = {
  backgroundColor: "#242526",
  border: "1px solid #333",
  borderRadius: "10px",
  padding: "20px"
};

export default HistoryPage;
