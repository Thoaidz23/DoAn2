import React, { useEffect, useState,useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../customer/context/AuthContext";


const StockAdjustList = () => {
  const [list, setList] = useState([]);
  const { user } = useContext(AuthContext);
  console.log(user)
  useEffect(() => {
    axios.get("http://localhost:5000/api/stock-adjust")
      .then(res => setList(res.data));
      
  }, []);

  return (
    <div className="p-4">
      <h3>📦 Danh sách phiếu điều chỉnh</h3>
      {user.role == 4 && (
        <Link to="/admin/stockadjust-create" className="btn btn-success mb-3">
          + Thêm phiếu điều chỉnh
      </Link>
      )}
      

      <table className="table table-dark table-hover">
        <thead>
          <tr>
            <th>#</th>
            <th>Mã phiếu</th>
            <th>Nhân viên</th>
            <th>Ngày</th>
            <th>Lý do</th>
            <th>Chi tiết</th>
          </tr>
        </thead>

        <tbody>
          {list.map((item, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{item.code_adjust}</td>
              <td>{item.name}</td>
              <td>{new Date(item.created_at).toLocaleDateString('vi-VN')}</td>
              <td>{item.reason}</td>
              <td>
                <Link to={`/admin/stockadjust-detail/${item.id}`} className="btn btn-primary btn-sm">
                  Xem
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default StockAdjustList;
