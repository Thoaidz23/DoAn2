import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { Button } from "react-bootstrap";
import axios from 'axios';

const Staff = () => {
  const [staffs, setStaffs] = useState([]);
  console.log(staffs)
  useEffect(() => {
    fetch("http://localhost:5000/api/staffaccounts")
      .then((res) => res.json())
      .then((data) => setStaffs(data))
      .catch((err) => console.error("Lỗi khi fetch nhân viên:", err));
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa nhân viên này không?")) {
      try {
        await axios.delete(`http://localhost:5000/api/staffaccounts/${id}`);
        alert("Xóa nhân viên thành công!");
        window.location.reload();
      } catch (err) {
        console.error("Lỗi khi xóa nhân viên:", err);
        alert("Xóa không thành công");
      }
    }
  };

  return (
    <div>
      <h3 className="mb-4">Quản lý nhân viên</h3>

      <div className="mb-3 text-end" style={{ marginTop: "-100px" }}>
        <Button as={Link} to="/admin/staffaccount/add" variant="primary" className="mb-3">
          Thêm nhân viên
        </Button>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-dark table-hover align-middle">
          <thead>
            <tr>
              <th className="text-center align-middle">STT</th>
              <th className="text-center align-middle">Tên</th>
              <th className="text-center align-middle">Email</th>
              <th className="text-center align-middle">Số điện thoại</th>
              <th className="text-center align-middle">Địa chỉ</th>
              <th className="text-center align-middle">Phân loại</th>
              <th className="text-center align-middle">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {staffs.length > 0 ? (
              staffs.map((staff, index) => (
                <tr key={staff.id_user}>
                  <td className="text-center">{index + 1}</td>
                  <td className="text-center">{staff.name}</td>
                  <td className="text-center">{staff.email}</td>
                  <td className="text-center">{staff.phone}</td>
                  <td className="text-center">{staff.address}</td>
                   <td className="text-center">
                    {staff.role === 2 ? "Nhân viên bán hàng" : staff.role === 4 ? "Quản lý kho" : "Không xác định"}
                  </td>                 
                  <td className="text-center">
                    <Link to={`/admin/staffaccount/edit/${staff.id_user}`}>
                      <button className="btn btn-sm btn-warning me-2">Sửa</button>
                    </Link>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(staff.id_user)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">Danh sách nhân viên trống</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Staff;
