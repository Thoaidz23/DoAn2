import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer
} from "recharts";

const StockHistory = () => {
  const { id_product } = useParams();
  const [data, setData] = useState(null);
  const [chartData, setChartData] = useState([]);
const [startDate, setStartDate] = useState("");
const [endDate, setEndDate] = useState("");


  const loadData = async () => {
  try {
    let url = `http://localhost:5000/api/stock/history/${id_product}`;

    // Nếu có chọn thời gian → thêm query
    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }

    const res = await axios.get(url);

    setData(res.data);

    const history = res.data.history || [];

    // Tổng biến động trong khoảng chọn
    const totalChange = history.reduce((sum, h) => sum + Number(h.change), 0);

    // Tồn đầu kỳ = tồn hiện tại - biến động trong đoạn thời gian chọn
    const initialStock = Number(res.data.current_quantity) - totalChange;

    // Sort theo ngày
    history.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Tạo chart
    let running = initialStock;

    const chart = [
      { date: "Ban đầu", stock: initialStock },
      ...history.map(item => {
        running += Number(item.change);
        return {
          date: item.date,
          stock: running,
        };
      })
    ];

    setChartData(chart);

  } catch (err) {
    console.log("🔥 API ERROR:", err.response?.data || err);
  }
};
useEffect(() => {
    loadData();
}, [startDate, endDate]);


  if (!data) return <p className="text-white p-3">Đang tải...</p>;

  return (
    <div className="p-4 text-white" style={{ background: "#181a1b", minHeight: "100vh" }}>
      
      <h3>Lịch sử kho – Sản phẩm #{id_product}</h3>
  <div className="d-flex gap-3 mb-3">
  <div>
    <label>Từ ngày</label>
    <input
      type="date"
      value={startDate}
      onChange={(e) => setStartDate(e.target.value)}
      className="form-control"
    />
  </div>

  <div>
    <label>Đến ngày</label>
    <input
      type="date"
      value={endDate}
      onChange={(e) => setEndDate(e.target.value)}
      className="form-control"
    />
  </div>
</div>


      {/* =========================== BIỂU ĐỒ =========================== */}
      <div className="mt-4 p-3" style={{ background: "#202223", borderRadius: "10px" }}>
        <h4 className="mb-3 text-info">📊 Biểu đồ biến động tồn kho</h4>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="date" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Legend />

            <Line type="monotone" dataKey="stock" stroke="#00ff00" name="Tồn kho" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Tồn kho hiện tại */}
      <h4 className="mt-4 text-info">
        📦 Tồn kho hiện tại: {data.current_quantity}
      </h4>

      {/* IMPORT */}
      <h4 className="mt-4 text-success">Lịch sử nhập kho</h4>
      <table className="table table-dark table-bordered">
        <thead>
          <tr>
            <th>Mã phiếu</th><th>Số lượng</th><th>Giá</th><th>Nhà cung cấp</th><th>Ngày</th>
          </tr>
        </thead>
        <tbody>
          {data.imports.map((r) => (
            <tr key={r.id_stock_detail}>
              <td>{r.code_stock}</td>
              <td>+{r.quantity}</td>
              <td>{r.price}</td>
              <td>{r.supplier}</td>
              <td>{new Date(r.created_at).toLocaleString("vi-VN")}</td>

            </tr>
          ))}
        </tbody>
      </table>

      {/* EXPORT */}
      <h4 className="mt-4 text-warning">Lịch sử xuất kho</h4>
      <table className="table table-dark table-bordered">
        <thead>
          <tr>
            <th>Mã phiếu</th><th>Số lượng</th><th>Đơn hàng</th><th>Ngày</th>
          </tr>
        </thead>
        <tbody>
          {data.exports.map((r) => (
            <tr key={r.id_stock_detail}>
              <td>{r.code_stock}</td>
              <td>-{r.quantity}</td>
              <td>{r.code_order}</td>
              <td>{new Date(r.created_at).toLocaleString("vi-VN")}</td>

            </tr>
          ))}
        </tbody>
      </table>

      {/* ADJUST */}
      <h4 className="mt-4 text-danger">Lịch sử điều chỉnh kho</h4>
      <table className="table table-dark table-bordered">
        <thead>
          <tr>
            <th>Mã phiếu</th><th>Lý do</th><th>Số lượng</th><th>Người thực hiện</th><th>Ngày</th>
          </tr>
        </thead>
        <tbody>
          {data.adjustments.map((r) => (
            <tr key={r.id_adjust_detail}>
              <td>{r.code_adjust}</td>
              <td>{r.reason}</td>
              <td>{r.adjust_quantity}</td>
              <td>{r.staff_name}</td>
             <td>{new Date(r.created_at).toLocaleString("vi-VN")}</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockHistory;
