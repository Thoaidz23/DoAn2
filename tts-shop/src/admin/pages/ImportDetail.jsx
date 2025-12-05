import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useParams } from "react-router-dom";

const ImportDetail = () => {
  const { id } = useParams();
  const [stock, setStock] = useState(null);
  const [details, setDetails] = useState([]);

  const [staffs, setStaffs] = useState([]);

  console.log(id,stock,details,staffs)
  useEffect(() => {
    const fetchStaffs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/staffaccounts");
        setStaffs(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách nhân viên:", err);
      }
    };

    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/stock/${id}`);
        setStock(res.data.stock);
        setDetails(res.data.details);
      } catch (err) {
        console.error(err);
        alert("Lỗi khi lấy chi tiết phiếu!");
      }
    };
    fetchStaffs();
    if (id) fetchData();
  }, [id]);

  if (!stock)
    return <div style={{ padding: "25px", color: "#fff" }}>Đang tải dữ liệu...</div>;

  const employeeName =
    staffs.find((s) => s.id_user === stock.id_employee)?.name || "";

  const totalAmount = details.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  // Xác định loại phiếu: nhập hay xuất
  const isExport = stock.type === "EXPORT"; // nếu backend trả type
  // hoặc nếu là phiếu xuất có mã đơn hàng
  const labelCode = isExport ? "Mã đơn hàng" : "Nhà cung cấp";
  const labelDate = isExport ? "Ngày xuất" : "Ngày nhập";
  const labelPrice = isExport ? "Giá xuất" : "Giá nhập";

  return (
    <div
      className="main-content"
      style={{
        padding: "25px",
        backgroundColor: "#181a1b",
        minHeight: "100vh",
        color: "#fff",
      }}
    >
      <h3 className="mb-4">
        <i className={isExport ? "bi bi-download" : "bi bi-upload"}></i>{" "}
        {isExport ? "Chi tiết phiếu xuất" : "Chi tiết phiếu nhập"}
      </h3>

      {/* ----- Thông tin phiếu ----- */}
      <div className="card-dark mb-4" style={cardDark}>
        <h5>Thông tin {isExport ? "phiếu xuất" : "phiếu nhập"}</h5>
        <div className="row g-3 mt-2">
          <div className="col-md-4">
            <label className="form-label">Mã phiếu</label>
            <input
              type="text"
              className="form-control bg-dark text-light border-0"
              value={stock.code_stock}
              readOnly
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">{labelCode}</label>
            <input
              type="text"
              className="form-control bg-dark text-light border-0"
              value={isExport ? stock.code_order : stock.supplier}
              readOnly
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">{labelDate}</label>
            <input
              type="text"
              className="form-control bg-dark text-light border-0"
              value={new Date(stock.created_at).toLocaleString("vi-VN", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit"
})}
              readOnly
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Nhân viên</label>
            <input
              type="text"
              className="form-control bg-dark text-light border-0"
              value={employeeName}
              readOnly
            />
          </div>
           <div className="col-md-8">
            <label className="form-label">Ghi chú</label>
            <input
              type="text"
              className="form-control bg-dark text-light border-0"
              value={stock.note}
              readOnly
            />
          </div>

        </div>
      </div>

      {/* ----- Danh sách sản phẩm ----- */}
      <div className="card-dark" style={cardDark}>
        <h5>Danh sách sản phẩm</h5>
        <table className="table table-dark table-hover mt-3">
          <thead>
            <tr>
              <th className="fw-bold" style={{ color: "orange" }}>
                ##
              </th>
              <th>ID SP</th>
              <th>Tên sản phẩm</th>
              <th>RAM</th>
              <th>ROM</th>
              <th>Màu sắc</th>
              <th>Số lượng</th>
              <th>{labelPrice}</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {details.map((item, index) => (
              <tr key={item.id_stock_detail}>
                <td className="fw-bold" style={{ color: "orange" }}>
                  {index + 1}
                </td>
                <td>{item.id_product}</td>
                <td>{item.name}</td>
                <td>{item.name_ram || "-"}</td>
                <td>{item.name_rom || "-"}</td>
                <td>{item.name_color || "-"}</td>
                <td>{item.quantity}</td>
                <td>{item.price.toLocaleString()}</td>
                <td>{(item.quantity * item.price).toLocaleString()}</td>
              </tr>
            ))}
            <tr>
              <td colSpan="8" className="text-end fw-bold">
                Tổng tiền:
              </td>
              <td className="fw-bold">{totalAmount.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-3 text-end">
        <button className="btn btn-success">
          <i className="bi bi-printer"></i> In phiếu
        </button>
      </div>
    </div>
  );
};

const cardDark = {
  backgroundColor: "#242526",
  border: "1px solid #333",
  borderRadius: "10px",
  padding: "20px",
};

export default ImportDetail;
