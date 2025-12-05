import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const StockAdjustDetail = () => {
  const { id } = useParams();
  const [adjust, setAdjust] = useState(null);
  console.log(adjust)

  useEffect(() => {
    axios.get(`http://localhost:5000/api/stock-adjust/${id}`)
      .then(res => setAdjust(res.data));
  }, [id]);

  if (!adjust) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h3>📄 Chi tiết phiếu điều chỉnh</h3>

      <div className="card-dark p-3 mb-4">
        <p><b>Mã phiếu:</b> {adjust.adjust.code_adjust}</p>
        <p><b>Nhân viên:</b> {adjust.details[0]?.staff_name}</p>
        <p><b>Lý do:</b> {adjust.adjust.reason}</p>
        <p><b>Ngày:</b> {adjust.adjust.created_at}</p>
      </div>

      <table className="table table-dark table-hover">
  <thead>
    <tr>
      <th>#</th>
      <th>Sản phẩm</th>
      <th>RAM</th>
      <th>ROM</th>
      <th>Màu</th>
      <th>Số lượng</th>
    </tr>
  </thead>

  <tbody>
    {adjust.details.map((d, i) => (
      <tr key={i}>
        <td>{i + 1}</td>
        <td>{d.name_group_product}</td>
        <td>{d.name_ram || "-"}</td>
        <td>{d.name_rom || "-"}</td>
        <td>{d.name_color || "-"}</td>
        <td>{d.adjust_quantity}</td>
      </tr>
    ))}
  </tbody>
</table>

    </div>
  );
};

export default StockAdjustDetail;
