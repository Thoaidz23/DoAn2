import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditStaff = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState(2); // mặc định 2
  const [error, setError] = useState("");
  console.log(id,name,email,phone,address,role)
  useEffect(() => {
    // Lấy dữ liệu nhân viên theo id
    axios.get(`http://localhost:5000/api/staffaccounts/edit/${id}`)
      .then((res) => {
        const staff = res.data;
        console.log(staff)
        setName(staff.name || "");
        setEmail(staff.email || "");
        setPhone(staff.phone || "");
        setAddress(staff.address || "");
        setRole(staff.role); 
      })
      .catch((err) => {
        console.error("Lỗi khi lấy thông tin nhân viên:", err);
        setError("Không tìm thấy nhân viên");
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError("Tên, email và số điện thoại không được để trống.");
      return;
    }

    try {
      // Gửi dữ liệu cập nhật (không gửi password)
      await axios.put(`http://localhost:5000/api/staffaccounts/${id}`, {
        name,
        email,
        phone,
        address,
        role,
      });

      alert("Cập nhật nhân viên thành công");
      navigate("/admin/staffaccount");
    } catch (err) {
      console.error("Lỗi khi cập nhật nhân viên:", err);
      setError("Cập nhật thất bại, thử lại sau");
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Chỉnh sửa nhân viên</h3>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} style={{ width: "100%", marginTop: "-180px" }}>
        <div className="mb-3">
          <label className="form-label">Tên nhân viên</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Số điện thoại</label>
          <input
            type="text"
            className="form-control"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Địa chỉ</label>
          <input
            type="text"
            className="form-control"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Phân loại nhân viên</label>
          <select
            className="form-select"
            value={role}
            onChange={(e) => setRole(Number(e.target.value))}
            required
          >
            <option value={2}>Nhân viên bán hàng</option>
            <option value={4}>Quản lý kho</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary">Lưu thay đổi</button>
      </form>
    </div>
  );
};

export default EditStaff;
